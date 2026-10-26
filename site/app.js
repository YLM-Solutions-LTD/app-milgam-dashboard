import { ALLOWED_HOST_ORIGINS, CURRENT_SNAPSHOT_LIVE_CALLS_ENABLED, DATASETS } from "./constants.js";
import { createApiClient } from "./api-client.js";
import { createDashboardMachine } from "./dashboard-machine.js";
import { buildInclusiveRange } from "./date-range.js";
import { applyRuntimeLocale, onHostContextRevoked, summarizeContext } from "./host-context.js";
import { createSnapshotController } from "./current-snapshot.js";
import { createHostServices } from "./host-services.js";
import { createHostBootstrap } from "./host-bootstrap.js";
import { pageWindow } from "./pagination.js";

const LOG_PREFIX = "[milgam-dashboard.app]";

const CHART_COLORS = ["#2457d6", "#198f82", "#7a51b5", "#d27a1f", "#5d718f", "#b94a6b"];
const CHART_SCALE_STEPS = 20;
const DATASET_LABELS = {
  [DATASETS.periods]: "תקופות הדיווח",
  [DATASETS.division]: "חלוקה לפי חטיבות",
  [DATASETS.summary]: "סיכום מטה וסניפים",
  [DATASETS.category]: "תמהיל הקטגוריות",
  [DATASETS.closure]: "זמני סגירה לפי קטגוריה",
  reconciliation: "התאמת נתוני הדשבורד",
  unknown: "נתוני הדשבורד"
};

const controlsElement = document.getElementById("controls");
const stateElement = document.getElementById("state-region");
const dashboardElement = document.getElementById("dashboard");
const connectionElement = document.getElementById("connection-status");
const snapshotContentElement = document.getElementById("snapshot-content");
const snapshotStatusElement = document.getElementById("snapshot-status");
const snapshotRefreshElement = document.getElementById("snapshot-refresh");

let service = null;
let pendingContext = null;
let hostTimeout = null;
let lastStateValue = null;
let snapshotController = null;
let hostServices = null;
let permitNavigationPending = false;
let activeContext = null;
let refreshPending = null;
let refreshAnalyticsRequested = false;
let renderedDashboardData = null;
const detailPages = { division: 0, categoryHeadquarters: 0, categoryBranches: 0, closureHeadquarters: 0, closureBranches: 0 };

console.info(LOG_PREFIX, "Bootstrapping mini-app", {
  title: document.title,
  userAgent: navigator.userAgent,
  allowedOrigins: ALLOWED_HOST_ORIGINS,
  xstateReady: Boolean(window.XState)
});

function traceState(state) {
  const snapshot = {
    state: state.value,
    hostTimedOut: state.context.hostTimedOut,
    selectedRange: state.context.selectedRange,
    hasRuntime: Boolean(state.context.runtime),
    requestStage: state.context.requestStage,
    requestId: state.context.requestId,
    error: state.context.error ? {
      name: state.context.error.name,
      kind: state.context.error.kind,
      status: state.context.error.status,
      dataset: state.context.error.dataset
    } : null,
    datasetCount: {
      periods: state.context.periods?.length || 0
    }
  };
  if (snapshot.state !== lastStateValue) {
    console.info(LOG_PREFIX, "State transition", snapshot);
    lastStateValue = snapshot.state;
  }
}

function acceptHostContext(context, client) {
    const priorSnapshot = snapshotController?.getState();
    activeContext = context;
    console.info(LOG_PREFIX, "Host context callback invoked", summarizeContext(context));
    applyRuntimeLocale(context, document);
    hostServices = createHostServices(context, client);
    snapshotController?.dispose();
    snapshotController = null;
    if (CURRENT_SNAPSHOT_LIVE_CALLS_ENABLED) {
      snapshotController = createSnapshotController({
        client: createApiClient(context),
        onChange: renderSnapshot,
        initialData: priorSnapshot?.lastGoodData || null,
        initialRefreshedAt: priorSnapshot?.refreshedAt || null
      });
      void snapshotController.refresh();
    } else {
      renderSnapshot({ status: "disabled", data: null });
    }
    console.info(LOG_PREFIX, "Locale applied", {
      lang: document.documentElement.lang,
      dir: document.documentElement.dir
    });
    clearTimeout(hostTimeout);
    if (service) service.send({ type: "HOST_CONTEXT_RECEIVED", context });
    else pendingContext = context;
}

const hostBootstrap = createHostBootstrap({
  windowObject: window,
  onContext: acceptHostContext
});

const removeRevocationListener = onHostContextRevoked((context) => {
  if (context !== activeContext) return;
  activeContext = null;
  hostServices = null;
  snapshotController?.invalidate();
  if (service) service.send("HOST_CONTEXT_REVOKED");
});

const machine = createDashboardMachine(window.XState);
service = window.XState.interpret(machine).onTransition((state) => {
  traceState(state);
  render(state);
});
service.start();
console.info(LOG_PREFIX, "State machine started");
void hostBootstrap.connect().catch((error) => {
  console.warn(LOG_PREFIX, "Verified host handshake failed", { code: error?.code || "HOST_UNAVAILABLE" });
});

if (pendingContext) service.send({ type: "HOST_CONTEXT_RECEIVED", context: pendingContext });
hostTimeout = window.setTimeout(() => {
  console.warn(LOG_PREFIX, "Host connection timed out");
  service.send("HOST_TIMEOUT");
}, 3000);

window.addEventListener("message", (event) => {
  if (!event || !event.data) return;
  if (event.data?.type === "simplylog-host-ready") {
    console.info(LOG_PREFIX, "Received host control ping", { origin: event.origin });
  }
});

window.addEventListener("pagehide", () => {
  console.info(LOG_PREFIX, "Page hiding; cleaning up");
  clearTimeout(hostTimeout);
  hostBootstrap.dispose();
  removeRevocationListener();
  snapshotController?.dispose();
  service.stop();
}, { once: true });

snapshotRefreshElement.addEventListener("click", () => { void refreshAuthorization(); });

function refreshAnalyticsAuthorization() {
  refreshAnalyticsRequested = true;
  if (refreshPending) return refreshPending;
  refreshPending = (async () => {
    try {
      const previousContext = activeContext;
      const verified = await hostBootstrap.verify();
      if (verified.context !== previousContext || activeContext !== previousContext) return; // Fresh re-entry already loads its data.
      if (refreshAnalyticsRequested) service.send("REFRESH");
    } catch (error) {
      console.warn(LOG_PREFIX, "Host reauthorization failed", { code: error?.code || "HOST_UNAVAILABLE" });
    } finally {
      refreshPending = null;
      refreshAnalyticsRequested = false;
      if (snapshotController) renderSnapshot(snapshotController.getState());
      if (service) renderControls(service.state);
    }
  })();
  snapshotRefreshElement.disabled = true;
  const analyticalRefresh = controlsElement.querySelector("#refresh-button");
  if (analyticalRefresh) analyticalRefresh.disabled = true;
  return refreshPending;
}

function refreshAuthorization() { return refreshSnapshot(); }

async function refreshSnapshot() {
  if (refreshPending) return refreshPending;
  refreshPending = (async () => {
    try {
      const previousContext = activeContext;
      const verified = await hostBootstrap.verify();
      if (verified.context === previousContext && activeContext === previousContext) await snapshotController?.refresh();
    } catch (error) {
      console.warn(LOG_PREFIX, "Snapshot reauthorization failed", { code: error?.code || "HOST_UNAVAILABLE" });
    } finally {
      refreshPending = null;
      if (snapshotController) renderSnapshot(snapshotController.getState());
      if (service) renderControls(service.state);
    }
  })();
  snapshotRefreshElement.disabled = true;
  return refreshPending;
}

async function dispatchAuthorized(event) {
  try {
    const previousContext = activeContext;
    const verified = await hostBootstrap.verify();
    if (verified.context === previousContext) service.send(event);
  } catch (error) {
    console.warn(LOG_PREFIX, "Host reauthorization failed", { code: error?.code || "HOST_UNAVAILABLE" });
  }
}

function render(state) {
  console.debug(LOG_PREFIX, "Rendering", {
    isReady: state.matches("ready"),
    state: state.value,
    hasData: Boolean(state.context.data),
    periods: state.context.periods?.length || 0
  });
  renderConnection(state);
  renderControls(state);

  if (state.matches("ready")) {
    stateElement.replaceChildren();
    if (renderedDashboardData !== state.context.data) {
      renderedDashboardData = state.context.data;
      Object.keys(detailPages).forEach((key) => { detailPages[key] = 0; });
    }
    dashboardElement.innerHTML = renderDashboard(state.context.data);
    bindDetailPaging(state.context.data);
    return;
  }

  dashboardElement.replaceChildren();
  stateElement.innerHTML = renderStateCard(state);
  bindStateActions();
}

function renderConnection(state) {
  const connected = !state.matches("awaitingHost");
  connectionElement.innerHTML = `
    <span class="status-dot${connected ? " connected" : ""}" aria-hidden="true"></span>
    <span>${connected ? "מחובר ל-SimplyLog" : "ממתין לחיבור מאובטח"}</span>
  `;
}

function renderControls(state) {
  const { selectedRange, refreshedAt } = state.context;
  const periodLoading = state.matches("awaitingHost") || state.matches("loadingPeriods") || !selectedRange;
  const refreshed = refreshedAt ? formatDateTime(refreshedAt) : "טרם בוצע רענון";

  controlsElement.innerHTML = `
    <div class="field">
      <label for="from-date">מתאריך</label>
      <input id="from-date" type="date" min="1753-01-01" max="9999-12-31" value="${selectedRange?.from || ""}" aria-describedby="range-error" ${periodLoading ? "disabled" : ""}>
    </div>
    <div class="field">
      <label for="to-date">עד תאריך (כולל)</label>
      <input id="to-date" type="date" min="1753-01-01" max="9999-12-31" value="${selectedRange?.to || ""}" aria-describedby="range-error" ${periodLoading ? "disabled" : ""}>
    </div>
    <button id="apply-range" class="button button-primary" type="button" ${periodLoading || refreshPending ? "disabled" : ""}>החלת טווח</button>
    <button id="refresh-button" class="button" type="button" ${!selectedRange || refreshPending ? "disabled" : ""}>רענון נתונים</button>
    <span class="refresh-note">עדכון אחרון: ${escapeHtml(refreshed)}</span>
    <p id="range-error" class="range-error" role="alert" aria-live="assertive"></p>
  `;

  controlsElement.querySelector("#apply-range")?.addEventListener("click", () => {
    const fromInput = controlsElement.querySelector("#from-date");
    const toInput = controlsElement.querySelector("#to-date");
    try {
      const range = buildInclusiveRange(fromInput.value, toInput.value);
      fromInput.removeAttribute("aria-invalid");
      toInput.removeAttribute("aria-invalid");
      void dispatchAuthorized({ type: "RANGE_APPLIED", range });
    } catch (error) {
      const focusTarget = !fromInput.value ? fromInput : toInput;
      focusTarget.setAttribute("aria-invalid", "true");
      controlsElement.querySelector("#range-error").textContent = "יש להזין טווח תאריכים תקין; תאריך ההתחלה אינו יכול להיות אחרי תאריך הסיום.";
      focusTarget.focus();
    }
  });
  controlsElement.querySelector("#refresh-button")?.addEventListener("click", () => {
    void refreshAnalyticsAuthorization();
  });
}

function renderSnapshot(state) {
  const terminal = state.terminalAuthorization === true;
  snapshotRefreshElement.disabled = Boolean(refreshPending) || state.status === "loading" || state.status === "disabled" || terminal;
  if (state.status === "disabled") {
    snapshotStatusElement.textContent = "תמונת המצב הנוכחית אינה מופעלת בסביבה זו.";
    snapshotContentElement.replaceChildren();
    return;
  }
  if (state.status === "loading" && !state.data) {
    snapshotStatusElement.textContent = "טוען תמונת מצב נוכחית…";
    snapshotContentElement.replaceChildren();
    return;
  }
  if (state.status === "error") {
    snapshotStatusElement.innerHTML = terminal
      ? "ההרשאה לתמונת המצב פגה. יש להיכנס מחדש דרך SimplyLog כדי לחדש את הנתונים."
      : 'לא ניתן לטעון את תמונת המצב. <button class="link-button" data-snapshot-retry type="button">נסו שוב</button>';
    snapshotContentElement.replaceChildren();
    snapshotStatusElement.querySelector("[data-snapshot-retry]")?.addEventListener("click", () => { void refreshSnapshot(); });
    return;
  }
  if (!state.data) return;
  const stale = state.status === "stale";
  snapshotStatusElement.innerHTML = stale
    ? (terminal
      ? "הנתונים המוצגים הם העדכון התקין האחרון. ההרשאה פגה; יש להיכנס מחדש דרך SimplyLog כדי לרענן."
      : 'הנתונים המוצגים הם העדכון התקין האחרון. הרענון נכשל. <button class="link-button" data-snapshot-retry type="button">נסו שוב</button>')
    : `עודכן: ${escapeHtml(hostServices?.toDisplayDate(state.data.events.asOf) || String(state.data.events.asOf))}`;
  snapshotContentElement.innerHTML = renderSnapshotContent(state.data);
  snapshotStatusElement.querySelector("[data-snapshot-retry]")?.addEventListener("click", () => { void refreshSnapshot(); });
  snapshotContentElement.querySelectorAll("[data-permit]").forEach((button) => button.addEventListener("click", navigateToPermits));
}

function renderSnapshotContent(data) {
  const eventRow = (label, value) => `<div class="snapshot-event"><strong>${label}</strong><span>${formatInteger(value.total)} סה״כ · ${formatInteger(value.open)} פתוחים</span></div>`;
  const permit = (key, label, value) => `<button class="permit-metric" type="button" data-permit="${key}" aria-label="${label}: ${formatInteger(value)}; פתיחת לוח האישורים"><span>${label}</span><strong>${formatInteger(value)}</strong><small>פתיחת לוח האישורים</small></button>`;
  return `<div class="snapshot-grid">
    <article class="snapshot-card"><h3>אירועים בכל התקופות</h3>${eventRow("כלל האתרים", data.events.overall)}${eventRow("מטה", data.events.headquarters)}${eventRow("סניפים", data.events.branches)}</article>
    <article class="snapshot-card"><h3>אישורים</h3><div class="permit-grid">${permit("valid", "בתוקף", data.permits.valid)}${permit("missing", "חסרים", data.permits.missing)}${permit("overdue", "באיחור", data.permits.overdue)}</div><p class="snapshot-date">תאריך ערך: ${escapeHtml(hostServices?.toDisplayDate(data.permits.valueDate) || String(data.permits.valueDate))}</p></article>
    <article class="snapshot-card"><h3>ציוד</h3><p class="equipment-total"><strong>${formatInteger(data.equipment.total)}</strong> פריטי ציוד</p><p>סיווג טיפול בתוקף / באיחור: <strong>לא זמין</strong></p></article>
  </div>`;
}

async function navigateToPermits(event) {
  if (permitNavigationPending) return;
  const activatingElement = event.currentTarget;
  permitNavigationPending = true;
  const buttons = [...snapshotContentElement.querySelectorAll("[data-permit]")];
  buttons.forEach((button) => { button.disabled = true; button.setAttribute("aria-busy", "true"); });
  try {
    await hostBootstrap.verify();
    const services = hostServices;
    if (!services) throw Object.assign(new Error("Host service unavailable"), { code: "HOST_UNAVAILABLE" });
    await services.ready();
    await services.executeCommand("Navigate", { Url: "#/Permits/Dashboard" });
  } catch {
    snapshotStatusElement.textContent = "לא ניתן לפתוח כעת את לוח האישורים. הנתונים נשארו זמינים.";
  } finally {
    permitNavigationPending = false;
    buttons.forEach((button) => {
      if (!button.isConnected) return;
      button.disabled = false;
      button.removeAttribute("aria-busy");
    });
    if (activatingElement?.isConnected && !activatingElement.disabled && typeof activatingElement.focus === "function") {
      activatingElement.focus();
    }
  }
}

function renderStateCard(state) {
  if (state.matches("awaitingHost")) {
    if (state.context.hostTimedOut) {
      return stateCard({
        icon: "M",
        title: "הדשבורד זמין מתוך SimplyLog",
        text: "יש לפתוח את ‎/App/milgam-dashboard‎ מתוך SimplyLog. הדף יתחבר אוטומטית כשיתקבל הקשר מארח מאומת."
      });
    }
    return loadingCard("מתחבר ל-SimplyLog", "ממתין להקשר מארח מאומת לפני טעינת נתונים.");
  }
  if (state.matches("loadingPeriods")) {
    return loadingCard("טוען תקופות זמינות", "מאתר את החודש האחרון שבו קיימים נתונים.");
  }
  if (state.matches("loadingDashboard")) {
    const range = state.context.selectedRange;
    const label = range ? `${range.from} – ${range.to}` : "הטווח שנבחר";
    return loadingCard("טוען את נתוני הדשבורד", label);
  }
  if (state.matches("empty")) {
    return stateCard({
      icon: "0",
      title: "אין נתונים לתקופה שנבחרה",
      text: state.context.emptyReason === "periods"
        ? "לא נמצאו נתונים בטווח הדיווח."
        : "אפשר לבחור טווח אחר או לנסות לרענן את הנתונים.",
      action: "נסה שוב"
    });
  }

  const error = errorCopy(state);
  return stateCard({ icon: "!", title: error.title, text: error.text, action: "נסה שוב" });
}

function loadingCard(title, text) {
  return `
    <div class="state-card" role="status">
      <span class="spinner" aria-hidden="true"></span>
      <h2>${escapeHtml(title)}</h2>
      <p>${escapeHtml(text)}</p>
    </div>
  `;
}

function stateCard({ icon, title, text, action = null }) {
  return `
    <div class="state-card">
      <span class="state-icon" aria-hidden="true">${escapeHtml(icon)}</span>
      <h2>${escapeHtml(title)}</h2>
      <p>${escapeHtml(text)}</p>
      ${action ? `<button class="button button-primary" data-action="retry" type="button">${escapeHtml(action)}</button>` : ""}
    </div>
  `;
}

function bindStateActions() {
  stateElement.querySelector('[data-action="retry"]')?.addEventListener("click", () => { void dispatchAuthorized("RETRY"); });
}

function errorCopy(state) {
  const dataset = DATASET_LABELS[state.context.error?.dataset] || DATASET_LABELS.unknown;
  if (state.matches("unauthorized")) {
    return { title: "החיבור פג", text: `לא ניתן לטעון את ${dataset}. יש להתחבר מחדש ל-SimplyLog.` };
  }
  if (state.matches("forbidden")) {
    return { title: "אין הרשאה להצגת הנתונים", text: `אין למשתמש הנוכחי הרשאה עבור ${dataset}.` };
  }
  if (state.matches("badRequest")) {
    return { title: "שגיאה בהגדרת דוח", text: `הבקשה עבור ${dataset} נדחתה. יש לבדוק את הגדרת דוח הישות.` };
  }
  if (state.matches("serverError")) {
    return { title: "שגיאת שרת", text: `אירעה שגיאה בעת הפקת ${dataset}. אפשר לנסות שוב.` };
  }
  if (state.matches("networkError")) {
    return { title: "בעיית תקשורת", text: `לא ניתן להגיע אל ${dataset}. בדקו את החיבור ונסו שוב.` };
  }
  if (state.matches("invalidResponse")) {
    return { title: "התקבלה תשובה לא תקינה", text: `הנתונים עבור ${dataset} אינם שלמים או אינם תואמים לחוזה הדוח.` };
  }
  return { title: "לא ניתן לטעון את הדשבורד", text: `אירעה שגיאה בטעינת ${dataset}. אפשר לנסות שוב.` };
}

function renderDashboard(data) {
  const headquarters = data.summary.find((row) => row.key === "headquarters");
  const branches = data.summary.find((row) => row.key === "branches");
  return `
    <div class="dashboard-grid">
      ${renderDivision(data.division, "division")}
      ${renderScopeSummary(data.summary)}
    </div>
    <div class="dashboard-grid">
      ${renderCategory("תמהיל קריאות מטה", data.category.headquarters, "headquarters", "categoryHeadquarters")}
      ${renderCategory("תמהיל קריאות סניפים", data.category.branches, "branches", "categoryBranches")}
    </div>
    <div class="dashboard-grid">
      ${renderClosureSection("ממוצע ימים לסגירת קריאה – מטה", headquarters, data.closure.headquarters, "closureHeadquarters")}
      ${renderClosureSection("ממוצע ימים לסגירת קריאה – סניפים", branches, data.closure.branches, "closureBranches")}
    </div>
  `;
}

function renderDivision(rows, pageKey) {
  const total = sum(rows, "count");
  if (total === 0) return panel("חלוקה לפי חטיבות", emptyInline("אין נתוני חטיבות לתקופה זו"));
  const window = pageWindow(rows, detailPages[pageKey]);
  detailPages[pageKey] = window.page;
  let cursor = 0;
  const visibleTotal = sum(window.items, "count");
  const chartRows = window.end < rows.length ? [...window.items, { label: "פריטים נוספים", count: total - visibleTotal }] : window.items;
  const segments = chartRows.map((row, index) => {
    const percentage = (row.count / total) * 100;
    const offset = -cursor;
    cursor += percentage;
    return `<circle class="donut-segment color-${index % CHART_COLORS.length}" cx="21" cy="21" r="15.9155" pathLength="100" stroke-dasharray="${percentage} ${100 - percentage}" stroke-dashoffset="${offset}"></circle>`;
  }).join("");
  const aria = `סה״כ ${formatInteger(total)}; מוצגים ${rangeText(window)}`;
  const legend = window.items.map((row, index) => `
    <li>
      <span class="swatch color-${index % CHART_COLORS.length}" aria-hidden="true"></span>
      <span class="legend-label">${escapeHtml(row.label)}</span>
      <span class="legend-value">${formatInteger(row.count)} · ${formatPercent(row.count, total)}</span>
    </li>
  `).join("");

  return panel("חלוקה לפי חטיבות", `
    <figure class="donut-layout">
      <div class="donut" role="img" tabindex="0" aria-label="${escapeAttribute(aria)}">
        <svg class="donut-svg" viewBox="0 0 42 42" aria-hidden="true" focusable="false">
          <circle class="donut-track" cx="21" cy="21" r="15.9155"></circle>
          ${segments}
        </svg>
        <strong class="donut-total" aria-hidden="true">${formatInteger(total)}</strong>
      </div>
      <figcaption><ul class="legend">${legend}</ul>${renderPager(pageKey, window)}</figcaption>
    </figure>
  `);
}

function magnitudeClass(value, maximum) {
  if (value <= 0 || maximum <= 0) return "magnitude-0";
  return `magnitude-${Math.max(1, Math.min(CHART_SCALE_STEPS, Math.ceil((value / maximum) * CHART_SCALE_STEPS)))}`;
}

function renderScopeSummary(rows) {
  const total = sum(rows, "eventCount");
  if (total === 0) return panel("בניין מטה מול סניפים", emptyInline("אין נתוני מטה וסניפים לתקופה זו"));

  const segments = rows.map((row) => `
    <div class="stack-segment ${row.key} ${magnitudeClass(row.eventCount, total)}" role="img" aria-label="${escapeAttribute(`${row.label}: ${formatInteger(row.eventCount)}, ${formatPercent(row.eventCount, total)}`)}">
      <strong>${escapeHtml(row.label)}</strong>
      <span>${formatPercent(row.eventCount, total)}</span>
    </div>
  `).join("");
  const legend = rows.map((row, index) => `
    <span><span class="swatch color-${index % 2}" aria-hidden="true"></span>
      ${escapeHtml(row.label)}: ${formatInteger(row.eventCount)} · ${formatPercent(row.eventCount, total)}</span>
  `).join("");

  return panel("בניין מטה מול סניפים", `
    <div class="stacked-chart" aria-label="התפלגות אירועים בין מטה וסניפים">${segments}</div>
    <div class="stack-legend" aria-label="מקרא מטה וסניפים">${legend}</div>
  `);
}

function renderCategory(title, rows, scope, pageKey) {
  if (rows.length === 0) return panel(title, emptyInline("אין נתוני קטגוריות לתקופה זו"), scope === "branches" ? "branch-panel" : "");
  const maximum = Math.max(...rows.map((row) => row.count), 1);
  const window = pageWindow(rows, detailPages[pageKey]);
  detailPages[pageKey] = window.page;
  const bars = window.items.map((row) => `
    <li class="bar-row" aria-label="${escapeAttribute(`${row.label}: ${formatInteger(row.count)}`)}">
      <span class="bar-label">${escapeHtml(row.label)}</span>
      <span class="bar-track" aria-hidden="true"><span class="bar-fill ${magnitudeClass(row.count, maximum)}"></span></span>
      <span class="bar-count">${formatInteger(row.count)}</span>
    </li>
  `).join("");
  return panel(title, `<ul class="bar-list" aria-label="${escapeAttribute(title)}">${bars}</ul>${renderPager(pageKey, window)}`, scope === "branches" ? "branch-panel" : "");
}

function renderClosureSection(title, summary, rows, pageKey) {
  const window = pageWindow(rows, detailPages[pageKey]);
  detailPages[pageKey] = window.page;
  const tableContent = rows.length === 0 ? emptyInline("אין נתוני סגירה לפי קטגוריה") : `
    <div class="table-wrap">
      <table>
        <caption class="sr-only">${escapeHtml(title)} לפי קטגוריה</caption>
        <thead><tr><th scope="col">קטגוריה</th><th scope="col">ממוצע זמן סגירה (ימים)</th></tr></thead>
        <tbody>${window.items.map((row) => `
          <tr><td>${escapeHtml(row.label)}</td><td>${formatAverage(row.averageCloseDays, false)}</td></tr>
        `).join("")}</tbody>
      </table>
    </div>
    ${renderPager(pageKey, window)}
  `;

  return `
    <section class="closure-section" aria-labelledby="${summary.key}-closure-title">
      <h2 id="${summary.key}-closure-title">${escapeHtml(title)}</h2>
      <div class="kpi-grid">
        <article class="kpi-card">
          <span class="kpi-label">סה״כ קריאות סגורות</span>
          <strong class="kpi-value">${formatInteger(summary.closedCount)}</strong>
        </article>
        <article class="kpi-card">
          <span class="kpi-label">ממוצע זמן סגירה</span>
          <strong class="kpi-value">${formatAverage(summary.averageCloseDays, true)}</strong>
        </article>
      </div>
      ${tableContent}
    </section>
  `;
}

function rangeText(window) {
  return window.total === 0 ? "0 מתוך 0" : `${formatInteger(window.start + 1)}–${formatInteger(window.end)} מתוך ${formatInteger(window.total)}`;
}

function renderPager(key, window) {
  if (window.total <= window.items.length) return "";
  return `<nav class="detail-pager" data-page-key="${key}" aria-label="ניווט בפרטי ${escapeAttribute(key)}">
    <button class="button" type="button" data-page-step="-1" ${window.hasPrevious ? "" : "disabled"}>הקודם</button>
    <span class="detail-range" role="status" aria-live="polite">${rangeText(window)}</span>
    <button class="button" type="button" data-page-step="1" ${window.hasNext ? "" : "disabled"}>הבא</button>
  </nav>`;
}

function bindDetailPaging(data) {
  dashboardElement.querySelectorAll("[data-page-step]").forEach((button) => button.addEventListener("click", () => {
    const pager = button.closest("[data-page-key]");
    const key = pager?.dataset.pageKey;
    if (!key || !(key in detailPages)) return;
    detailPages[key] += Number(button.dataset.pageStep);
    dashboardElement.innerHTML = renderDashboard(data);
    bindDetailPaging(data);
    const replacement = dashboardElement.querySelector(`[data-page-key="${key}"] [data-page-step="${button.dataset.pageStep}"]`);
    replacement?.focus();
  }));
}

function panel(title, content, className = "") {
  return `<section class="panel ${className}"><h2>${escapeHtml(title)}</h2>${content}</section>`;
}

function emptyInline(message) {
  return `<p class="empty-inline">${escapeHtml(message)}</p>`;
}

function formatInteger(value) {
  return new Intl.NumberFormat(currentLocale(), { maximumFractionDigits: 0 }).format(value);
}

function formatYear(value) {
  return String(value);
}

function formatPercent(value, total) {
  const percentage = total === 0 ? 0 : (value / total) * 100;
  return `${new Intl.NumberFormat(currentLocale(), { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(percentage)}%`;
}

function formatAverage(value, includeUnit) {
  if (value === null) return "—";
  const formatted = new Intl.NumberFormat(currentLocale(), { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(value);
  return includeUnit ? `${formatted} ימים` : formatted;
}

function formatDateTime(date) {
  return new Intl.DateTimeFormat(currentLocale(), { dateStyle: "short", timeStyle: "short" }).format(date);
}

function currentLocale() {
  const language = document.documentElement.lang || "he";
  return language === "he" ? "he-IL" : language;
}

function sum(rows, field) {
  return rows.reduce((total, row) => total + row[field], 0);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("`", "&#096;");
}
