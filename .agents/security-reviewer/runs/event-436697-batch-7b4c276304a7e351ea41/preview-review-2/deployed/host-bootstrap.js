import { ALLOWED_HOST_ORIGINS } from "./constants.js";
import { contextFromSdk, revokeHostContext } from "./host-context.js";

function resolvedParentOrigin(windowObject) {
  const candidates = [windowObject.location?.ancestorOrigins?.[0], windowObject.document?.referrer];
  for (const candidate of candidates) {
    if (!candidate) continue;
    try {
      const origin = new URL(candidate).origin;
      if (ALLOWED_HOST_ORIGINS.includes(origin)) return origin;
    } catch {
      // Continue to the next independently supplied browser origin.
    }
  }
  return null;
}

export function createHostBootstrap({ windowObject = window, onContext, onRevoked, timeoutMs = 5000 } = {}) {
  const hostOrigin = resolvedParentOrigin(windowObject);
  let client = null;
  let context = null;
  let sessionSource = null;
  let disposed = false;
  let reconnecting = null;

  const revoke = (reason) => {
    if (context) revokeHostContext(context, reason);
    context = null;
    client?.dispose();
    client = null;
    onRevoked?.(reason);
  };

  const observeSession = (event) => {
    if (disposed || event.source !== windowObject.parent || event.origin !== hostOrigin) return;
    const message = event.data;
    if (!message || message.protocol !== "SimplyVibe" || message.version !== 1 || message.type !== "Ready"
      || message.source !== "host" || typeof message.payload?.source !== "string") return;
    if (sessionSource && sessionSource !== message.payload.source) {
      revoke("session-reset");
      queueMicrotask(() => { if (!disposed) void connect(); });
    }
    sessionSource = message.payload.source;
  };

  windowObject.addEventListener("message", observeSession);

  async function connect() {
    if (disposed) throw Object.assign(new Error("Host bootstrap disposed"), { code: "DISPOSED" });
    if (!hostOrigin || typeof windowObject.SimplyVibeClient !== "function") {
      throw Object.assign(new Error("Verified host SDK is unavailable"), { code: "HOST_UNAVAILABLE" });
    }
    if (reconnecting) return reconnecting;
    reconnecting = (async () => {
      revoke("reconnect");
      const nextClient = new windowObject.SimplyVibeClient({ hostOrigin, timeoutMs });
      client = nextClient;
      // Register before ready so live host events cannot race bootstrap.
      nextClient.on("SimplyVibe.AuthorizationRevoked", () => revoke("host-event"));
      try {
        const rawContext = await nextClient.ready();
        if (client !== nextClient || disposed) throw Object.assign(new Error("Host generation replaced"), { code: "SESSION_RESET" });
        const nextContext = contextFromSdk(rawContext, hostOrigin, nextClient, windowObject.SimplyVibeClient);
        if (!nextContext) throw Object.assign(new Error("Host context rejected"), { code: "INVALID_CONTEXT" });
        context = nextContext;
        onContext?.(nextContext, nextClient);
        return { context: nextContext, client: nextClient };
      } catch (error) {
        if (client === nextClient) revoke(error?.code || "handshake-failed");
        throw error;
      }
    })().finally(() => { reconnecting = null; });
    return reconnecting;
  }

  return {
    connect,
    reconnect: connect,
    dispose() {
      if (disposed) return;
      disposed = true;
      windowObject.removeEventListener("message", observeSession);
      revoke("disposed");
    }
  };
}
