import { DatasetValidationError } from "./data-mappers.js";

const EQUIPMENT_FIELDS = [
  "EquipmentId", "LocationEntityId", "LocationEntityType", "LocationPath", "EquipmentTypeId", "IsActive",
  "TreatmentDaysInterval", "NextTreatmentDate", "LastTreatmentEventId", "LastTreatmentDate",
  "LastTreatmentSeverityId", "LastTreatmentStatus", "TreatmentCategoryId", "ValidTreatmentSeverityId", "AsOf"
];

export async function loadCurrentSnapshot(client, { signal } = {}) {
  const [events, permits, equipment] = await Promise.all([
    client.requestCurrent("currentEvents", { signal }),
    client.requestCurrent("currentPermits", { signal }),
    client.requestCurrent("currentEquipment", { signal })
  ]);
  return mapCurrentSnapshot({ events, permits, equipment });
}

export function mapCurrentSnapshot(raw) {
  return {
    events: mapCurrentEvents(raw.events),
    permits: mapCurrentPermits(raw.permits),
    equipment: mapCurrentEquipment(raw.equipment)
  };
}

export function mapCurrentEvents(envelope) {
  requireEnvelope(envelope, "MilgamDashboardCurrentEvents", 3);
  const scopes = new Map();
  for (const [index, row] of envelope.Items.entries()) {
    requireRow(row, "MilgamDashboardCurrentEvents", index);
    const key = row.ScopeKey;
    if (!["overall", "headquarters", "branches"].includes(key) || scopes.has(key)) invalid("MilgamDashboardCurrentEvents", "Invalid or duplicate ScopeKey");
    const total = count(row.TotalCount, "TotalCount", "MilgamDashboardCurrentEvents", index);
    const open = count(row.OpenCount, "OpenCount", "MilgamDashboardCurrentEvents", index);
    if (open > total) invalid("MilgamDashboardCurrentEvents", "OpenCount exceeds TotalCount");
    scopes.set(key, { key, total, open, asOf: requiredValue(row.AsOf, "AsOf", "MilgamDashboardCurrentEvents", index) });
  }
  const overall = scopes.get("overall");
  const hq = scopes.get("headquarters");
  const branches = scopes.get("branches");
  if (!overall || !hq || !branches || hq.total + branches.total !== overall.total || hq.open + branches.open !== overall.open) {
    invalid("MilgamDashboardCurrentEvents", "Scope reconciliation failed");
  }
  return { overall, headquarters: hq, branches, asOf: overall.asOf };
}

export function mapCurrentPermits(envelope) {
  requireEnvelope(envelope, "MilgamDashboardCurrentPermits", 1);
  const row = envelope.Items[0];
  requireRow(row, "MilgamDashboardCurrentPermits", 0);
  return {
    valid: count(row.ValidCount, "ValidCount", "MilgamDashboardCurrentPermits", 0),
    missing: count(row.MissingCount, "MissingCount", "MilgamDashboardCurrentPermits", 0),
    overdue: count(row.OverdueCount, "OverdueCount", "MilgamDashboardCurrentPermits", 0),
    asOf: requiredValue(row.AsOf, "AsOf", "MilgamDashboardCurrentPermits", 0),
    valueDate: requiredValue(row.ValueDate, "ValueDate", "MilgamDashboardCurrentPermits", 0)
  };
}

export function mapCurrentEquipment(envelope) {
  requireEnvelope(envelope, "MilgamDashboardCurrentEquipment");
  const facts = new Map();
  for (const [index, row] of envelope.Items.entries()) {
    requireRow(row, "MilgamDashboardCurrentEquipment", index);
    const id = requiredValue(row.EquipmentId, "EquipmentId", "MilgamDashboardCurrentEquipment", index);
    const fact = Object.fromEntries(EQUIPMENT_FIELDS.map((field) => [field, row[field] ?? null]));
    fact.EquipmentId = id;
    const prior = facts.get(String(id));
    if (prior && JSON.stringify(prior) !== JSON.stringify(fact)) invalid("MilgamDashboardCurrentEquipment", "Conflicting duplicate EquipmentId");
    facts.set(String(id), fact);
  }
  if (facts.size !== envelope.TotalCount) invalid("MilgamDashboardCurrentEquipment", "Equipment population mismatch");
  return { total: facts.size, facts: [...facts.values()], classification: "unavailable" };
}

export function createSnapshotController({ client, load = loadCurrentSnapshot, now = () => new Date(), onChange = () => {} }) {
  let generation = 0;
  let controller = null;
  let state = { status: "idle", data: null, lastGoodData: null, error: null, refreshedAt: null };
  const emit = (patch) => { state = { ...state, ...patch }; onChange(state); };
  async function refresh() {
    const id = ++generation;
    controller?.abort();
    controller = new AbortController();
    emit({ status: "loading", error: null });
    try {
      const data = await load(client, { signal: controller.signal });
      if (id !== generation) return state;
      const refreshedAt = now();
      emit({ status: "ready", data, lastGoodData: data, error: null, refreshedAt });
    } catch (error) {
      if (id !== generation || controller.signal.aborted) return state;
      emit({ status: state.lastGoodData ? "stale" : "error", data: state.lastGoodData, error: safeError(error) });
    }
    return state;
  }
  return { refresh, getState: () => state, dispose: () => { generation += 1; controller?.abort(); } };
}

function requireEnvelope(value, dataset, length = null) {
  if (!value || !Array.isArray(value.Items) || !Number.isSafeInteger(value.TotalCount) || value.TotalCount < 0
    || (length !== null && (value.Items.length !== length || value.TotalCount !== length))) invalid(dataset, "Invalid complete envelope");
}
function requireRow(row, dataset, index) { if (!row || typeof row !== "object" || Array.isArray(row)) invalid(dataset, `Invalid row ${index}`); }
function count(value, field, dataset, index) { if (!Number.isSafeInteger(value) || value < 0) invalid(dataset, `Invalid ${field} at row ${index}`); return value; }
function requiredValue(value, field, dataset, index) { if (value === null || value === undefined || String(value).trim() === "") invalid(dataset, `Missing ${field} at row ${index}`); return value; }
function invalid(dataset, detail) { throw new DatasetValidationError(dataset, detail); }
function safeError(error) { return { kind: error?.kind || "unknown", status: Number.isInteger(error?.status) ? error.status : null, dataset: error?.dataset || "currentSnapshot" }; }
