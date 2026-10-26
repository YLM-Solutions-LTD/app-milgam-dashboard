import { isBoundHostContext } from "./host-context.js";

export function createHostServices(context, hostAdapter) {
  if (!isBoundHostContext(context)) return unavailable();
  if (!hostAdapter || typeof hostAdapter.ready !== "function" || typeof hostAdapter.executeCommand !== "function") return unavailable();
  const requireActive = () => {
    if (!isBoundHostContext(context)) throw Object.assign(new Error("Host authorization is no longer active"), { code: "HOST_REVOKED" });
  };
  const guarded = async (operation) => {
    requireActive();
    const result = await operation();
    requireActive();
    return result;
  };
  return {
    available: true,
    ready: () => guarded(() => hostAdapter.ready()),
    executeCommand: (name, parameter) => guarded(() => hostAdapter.executeCommand(name, parameter)),
    toDisplayDate: (value) => {
      requireActive();
      return typeof hostAdapter.ToDisplayDate === "function" ? hostAdapter.ToDisplayDate(value) : String(value);
    }
  };
}

function unavailable() {
  const reject = () => Promise.reject(Object.assign(new Error("Host service is unavailable"), { code: "HOST_UNAVAILABLE" }));
  return { available: false, ready: reject, executeCommand: reject, toDisplayDate: (value) => String(value) };
}
