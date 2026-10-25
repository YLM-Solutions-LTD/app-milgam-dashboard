import { createApiClient, sanitizeValue } from "./api-client.js";
import { loadDashboard, loadPeriods } from "./dashboard-data.js";
import { selectLatestPeriod } from "./data-mappers.js";

const LOG_PREFIX = "[milgam-dashboard.machine]";

const ERROR_TARGETS = [
  ["isUnauthorized", "unauthorized"],
  ["isForbidden", "forbidden"],
  ["isBadRequest", "badRequest"],
  ["isServerError", "serverError"],
  ["isNetworkError", "networkError"],
  ["isInvalidResponse", "invalidResponse"],
  ["isCurrentRequest", "error"]
];

export function createDashboardMachine(XState, dependencies = {}) {
  if (!XState?.createMachine || !XState?.assign) {
    throw new TypeError("XState 4.38.3 is required");
  }

  const deps = {
    createClient: createApiClient,
    loadPeriods,
    loadDashboard,
    now: () => new Date(),
    ...dependencies
  };
  const { createMachine, assign } = XState;

  const selectionTransitions = {
    YEAR_CHANGED: {
      target: "loadingDashboard",
      cond: "canSelectYear",
      actions: "selectYear"
    },
    MONTH_CHANGED: {
      target: "loadingDashboard",
      cond: "canSelectMonth",
      actions: "selectMonth"
    }
  };

  const retryTransitions = [
    { target: "loadingPeriods", cond: "failedWhileLoadingPeriods", actions: "clearError" },
    { target: "loadingDashboard", cond: "hasSelectedPeriod", actions: "clearError" },
    { target: "loadingPeriods", actions: "clearError" }
  ];

  const errorTransitions = ERROR_TARGETS.map(([cond, target]) => ({
    target: `#milgamDashboard.${target}`,
    cond,
    actions: "storeError"
  }));

  const recoverableErrorState = {
    on: {
      RETRY: retryTransitions,
      ...selectionTransitions
    }
  };

  return createMachine(
    {
      id: "milgamDashboard",
      initial: "awaitingHost",
      predictableActionArguments: true,
      context: {
        runtime: null,
        client: null,
        periods: [],
        selectedPeriod: null,
        data: null,
        error: null,
        failedStage: null,
        requestStage: null,
        requestId: 0,
        hostTimedOut: false,
        refreshedAt: null,
        emptyReason: null
      },
      states: {
        awaitingHost: {
          on: {
            HOST_TIMEOUT: { actions: "markHostTimedOut" },
            HOST_CONTEXT_RECEIVED: {
              target: "loadingPeriods",
              cond: "hasNoRuntime",
              actions: "storeRuntime"
            }
          }
        },
        loadingPeriods: {
          entry: ["clearError", "startPeriodsRequest"],
          invoke: { src: "periodLoader" },
          on: {
            PERIODS_LOADED: [
              {
                target: "empty",
                cond: "isCurrentEmptyPeriodsResult",
                actions: "storePeriods"
              },
              {
                target: "loadingDashboard",
                cond: "isCurrentRequest",
                actions: "storePeriods"
              }
            ],
            REQUEST_FAILED: errorTransitions,
            REFRESH: { target: "loadingPeriods" }
          }
        },
        loadingDashboard: {
          entry: ["clearError", "startDashboardRequest"],
          invoke: { src: "dashboardLoader" },
          on: {
            DASHBOARD_LOADED: [
              {
                target: "empty",
                cond: "isCurrentEmptyDashboardResult",
                actions: "storeDashboard"
              },
              {
                target: "ready",
                cond: "isCurrentRequest",
                actions: "storeDashboard"
              }
            ],
            REQUEST_FAILED: errorTransitions,
            REFRESH: { target: "loadingDashboard" },
            ...selectionTransitions
          }
        },
        ready: {
          on: {
            REFRESH: "loadingDashboard",
            ...selectionTransitions
          }
        },
        empty: {
          on: {
            RETRY: [
              { target: "loadingPeriods", cond: "hasNoSelectedPeriod" },
              { target: "loadingDashboard" }
            ],
            REFRESH: [
              { target: "loadingPeriods", cond: "hasNoSelectedPeriod" },
              { target: "loadingDashboard" }
            ],
            ...selectionTransitions
          }
        },
        unauthorized: recoverableErrorState,
        forbidden: recoverableErrorState,
        badRequest: recoverableErrorState,
        serverError: recoverableErrorState,
        networkError: recoverableErrorState,
        invalidResponse: recoverableErrorState,
        error: recoverableErrorState
      },
      on: {
        HOST_CONTEXT_RECEIVED: {
          target: "loadingPeriods",
          actions: "storeRuntime"
        },
        HOST_CONTEXT_REVOKED: {
          target: "awaitingHost",
          actions: "clearRuntime"
        }
      }
    },
    {
      actions: {
        markHostTimedOut: assign({ hostTimedOut: () => true }),
        storeRuntime: assign((context, event) => ({
          runtime: event.context,
          client: deps.createClient(event.context),
          hostTimedOut: false
        })),
        clearRuntime: assign({
          runtime: () => null,
          client: () => null,
          error: () => null,
          requestStage: () => null,
          hostTimedOut: () => false
        }),
        clearError: assign({ error: () => null, emptyReason: () => null }),
        startPeriodsRequest: assign((context) => ({
          requestId: context.requestId + 1,
          requestStage: "periods"
        })),
        startDashboardRequest: assign((context) => ({
          requestId: context.requestId + 1,
          requestStage: "dashboard"
        })),
        storePeriods: assign((context, event) => ({
          periods: event.result.periods,
          selectedPeriod: event.result.selectedPeriod,
          emptyReason: event.result.selectedPeriod ? null : "periods"
        })),
        storeDashboard: assign((context, event) => ({
          data: event.result,
          refreshedAt: deps.now(),
          emptyReason: event.result.isEmpty ? "dashboard" : null
        })),
        selectYear: assign((context, event) => ({
          selectedPeriod: selectLatestPeriod(context.periods, Number(event.year)),
          data: null
        })),
        selectMonth: assign((context, event) => ({
          selectedPeriod: context.periods.find((period) => (
            period.available
            && period.year === context.selectedPeriod?.year
            && period.month === Number(event.month)
          )),
          data: null
        })),
        storeError: assign((context, event) => ({
          error: sanitizeError(event.error, context.runtime?.Token?.access_token),
          failedStage: context.requestStage
        }))
      },
      guards: {
        hasNoRuntime: (context) => context.runtime === null,
        isCurrentRequest: (context, event) => event.requestId === context.requestId,
        isCurrentEmptyPeriodsResult: (context, event) => (
          event.requestId === context.requestId && !event.result.selectedPeriod
        ),
        isCurrentEmptyDashboardResult: (context, event) => (
          event.requestId === context.requestId && event.result.isEmpty
        ),
        isUnauthorized: currentErrorGuard((error) => error?.status === 401),
        isForbidden: currentErrorGuard((error) => error?.status === 403),
        isBadRequest: currentErrorGuard((error) => error?.status === 400),
        isServerError: currentErrorGuard((error) => error?.status === 500),
        isNetworkError: currentErrorGuard((error) => error?.kind === "network"),
        isInvalidResponse: currentErrorGuard((error) => error?.kind === "invalid-response"),
        failedWhileLoadingPeriods: (context) => context.failedStage === "periods",
        hasSelectedPeriod: (context) => Boolean(context.selectedPeriod),
        hasNoSelectedPeriod: (context) => !context.selectedPeriod,
        canSelectYear: (context, event) => Boolean(selectLatestPeriod(context.periods, Number(event.year))),
        canSelectMonth: (context, event) => context.periods.some((period) => (
          period.available
          && period.year === context.selectedPeriod?.year
          && period.month === Number(event.month)
        ))
      },
      services: {
        periodLoader: (context) => createAbortableService(
          context,
          (signal) => deps.loadPeriods(context.client, { now: deps.now(), signal }),
          "PERIODS_LOADED"
        ),
        dashboardLoader: (context) => createAbortableService(
          context,
          (signal) => deps.loadDashboard(context.client, context.selectedPeriod, { signal }),
          "DASHBOARD_LOADED"
        )
      }
    }
  );
}

export function classifyDashboardError(error) {
  if (error?.status === 401) return "unauthorized";
  if (error?.status === 403) return "forbidden";
  if (error?.status === 400) return "badRequest";
  if (error?.status === 500) return "serverError";
  if (error?.kind === "network") return "networkError";
  if (error?.kind === "invalid-response") return "invalidResponse";
  return "error";
}

function createAbortableService(context, task, successType) {
  return (sendBack) => {
    const controller = new AbortController();
    const requestId = context.requestId;
    let active = true;
    console.info(LOG_PREFIX, "Service started", { successType, requestId, requestStage: context.requestStage });

    Promise.resolve()
      .then(() => task(controller.signal))
      .then((result) => {
        console.info(LOG_PREFIX, "Service completed", { successType, requestId });
        if (active) sendBack({ type: successType, result, requestId });
      })
      .catch((error) => {
        if (active && !controller.signal.aborted) {
          console.error(LOG_PREFIX, "Service failed", {
            successType,
            requestId,
            errorName: error?.name,
            errorKind: error?.kind,
            errorStatus: error?.status
          });
          sendBack({ type: "REQUEST_FAILED", error, requestId });
        }
      });

    return () => {
      active = false;
      console.warn(LOG_PREFIX, "Service aborted", { successType, requestId });
      controller.abort();
    };
  };
}

function currentErrorGuard(predicate) {
  return (context, event) => event.requestId === context.requestId && predicate(event.error);
}

function sanitizeError(error, accessToken) {
  const secrets = [accessToken].filter(Boolean);
  return {
    name: typeof error?.name === "string" ? error.name : "Error",
    kind: typeof error?.kind === "string" ? error.kind : "unknown",
    dataset: typeof error?.dataset === "string" ? error.dataset : "unknown",
    status: Number.isInteger(error?.status) ? error.status : null,
    body: sanitizeValue(error?.body ?? null, secrets),
    detail: sanitizeValue(error?.detail ?? null, secrets)
  };
}
