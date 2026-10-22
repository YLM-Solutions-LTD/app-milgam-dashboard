import { isBoundHostContext } from "./host-context.js";

export function createHostServices(context, hostAdapter = globalThis.SimplyVibeHostAdapter) {
  if (!isBoundHostContext(context)) return unavailable();
  if (!hostAdapter || typeof hostAdapter.ready !== "function" || typeof hostAdapter.executeCommand !== "function") return unavailable();
  return {
    available: true,
    ready: () => hostAdapter.ready(),
    executeCommand: (name, parameter) => hostAdapter.executeCommand(name, parameter),
    toDisplayDate: (value) => typeof hostAdapter.ToDisplayDate === "function" ? hostAdapter.ToDisplayDate(value) : String(value)
  };
}

function unavailable() {
  const reject = () => Promise.reject(Object.assign(new Error("Host service is unavailable"), { code: "HOST_UNAVAILABLE" }));
  return { available: false, ready: reject, executeCommand: reject, toDisplayDate: (value) => String(value) };
}
