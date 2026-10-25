import { ALLOWED_HOST_ORIGINS } from "./constants.js";
import { contextFromSdk, onHostContextRevoked, revokeHostContext } from "./host-context.js";

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
  let deniedSessionSource = null;
  let removeContextRevocationListener = null;

  const revoke = (reason, { denySession = false } = {}) => {
    const revokedContext = context;
    context = null;
    if (denySession) deniedSessionSource = sessionSource || "pending-session";
    if (revokedContext) revokeHostContext(revokedContext, reason);
    const revokedClient = client;
    client = null;
    revokedClient?.dispose();
    onRevoked?.(reason);
  };

  removeContextRevocationListener = onHostContextRevoked((revokedContext, metadata) => {
    if (revokedContext !== context) return;
    const reason = metadata?.reason || "revoked";
    revoke(reason, { denySession: reason === "http-401" || reason === "http-403" });
  });

  const observeSession = (event) => {
    if (disposed || event.source !== windowObject.parent || event.origin !== hostOrigin) return;
    const message = event.data;
    if (!message || message.protocol !== "SimplyVibe" || message.version !== 1 || message.type !== "Ready"
      || message.source !== "host" || typeof message.payload?.source !== "string") return;
    const nextSessionSource = message.payload.source;
    if (sessionSource && sessionSource !== nextSessionSource) {
      sessionSource = nextSessionSource;
      deniedSessionSource = null;
      revoke("session-reset");
      const pendingConnection = reconnecting;
      queueMicrotask(() => {
        const reconnectCurrentSession = () => {
          if (disposed || sessionSource !== nextSessionSource) return;
          connect().catch((error) => {
            if (!["DISPOSED", "SESSION_RESET", "HOST_REVOKED"].includes(error?.code)) {
              console.warn("[milgam-dashboard.host-bootstrap] Fresh session handshake failed", { code: error?.code || "HOST_UNAVAILABLE" });
            }
          });
        };
        // Let the disposed handshake clear the single-flight promise first.
        // A superseded session must not reconnect over the newest session.
        if (pendingConnection) void pendingConnection.then(reconnectCurrentSession, reconnectCurrentSession);
        else reconnectCurrentSession();
      });
      return;
    }
    sessionSource = nextSessionSource;
  };

  windowObject.addEventListener("message", observeSession);

  async function connect() {
    if (disposed) throw Object.assign(new Error("Host bootstrap disposed"), { code: "DISPOSED" });
    if (!hostOrigin || typeof windowObject.SimplyVibeClient !== "function") {
      throw Object.assign(new Error("Verified host SDK is unavailable"), { code: "HOST_UNAVAILABLE" });
    }
    if (context && client) return { context, client };
    if (deniedSessionSource && (deniedSessionSource === "pending-session" || deniedSessionSource === sessionSource)) {
      throw Object.assign(new Error("The current host authorization generation was rejected"), { code: "HOST_REVOKED" });
    }
    if (reconnecting) return reconnecting;
    reconnecting = (async () => {
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
      removeContextRevocationListener?.();
      revoke("disposed");
    }
  };
}
