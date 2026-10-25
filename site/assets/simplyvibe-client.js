(function (root) {
    'use strict';
    function error(code, message) { var value = new Error(message); value.code = code; return value; }
    function SimplyVibeClient(options) {
        options = options || {};
        var origin = new URL(options.hostOrigin).origin;
        if (origin === 'null' || options.hostOrigin !== origin) { throw new Error('hostOrigin must be an exact HTTP(S) origin.'); }
        if (!/^https?:$/.test(new URL(origin).protocol)) { throw new Error('hostOrigin must be HTTP(S).'); }
        var timeout = options.timeoutMs === undefined ? 30000 : options.timeoutMs;
        if (!Number.isFinite(timeout) || timeout <= 0) { throw new Error('timeoutMs must be positive.'); }
        var source = null, disposed = false, connected = false, listeners = new Map(), pending = new Map(), seen = new Set();
        var sequence = 0, prefix = Date.now().toString(36) + ':' + Math.random().toString(36).slice(2);
        var readyId = prefix + ':ready', readyResolve, readyReject;
        var readyPromise = new Promise(function (resolve, reject) { readyResolve = resolve; readyReject = reject; });
        // Construction may precede the caller's ready() call.
        readyPromise.catch(function () {});
        var readyTimer = setTimeout(function () { readyReject(error('TIMEOUT', 'Host handshake timed out.')); }, timeout);
        function send(type, requestId, payload) {
            var message = { protocol: 'SimplyVibe', version: 1, type: type, requestId: requestId, source: source, payload: payload };
            // Keep the protocol JSON portable and fail before posting an invalid command.
            var copy = JSON.parse(JSON.stringify(message, function (key, value) {
                if (typeof value === 'function' || typeof value === 'symbol' || typeof value === 'bigint') {
                    throw error('SERIALIZATION_ERROR', 'Payload must be JSON serializable.');
                }
                return value === undefined ? null : value;
            }));
            root.parent.postMessage(copy, origin);
        }
        function finish(id, failure, value) {
            var request = pending.get(id);
            if (!request) { return; }
            clearTimeout(request.timer);
            pending.delete(id);
            if (failure) { request.reject(failure); } else { request.resolve(value); }
        }
        function receive(event) {
            if (disposed || event.source !== root.parent || event.origin !== origin) { return; }
            var message;
            try { message = typeof event.data === 'string' ? JSON.parse(event.data) : event.data; }
            catch (_) { return; }
            if (!message || message.protocol !== 'SimplyVibe' || message.version !== 1 || !message.payload) { return; }
            var payload = message.payload;
            if (message.type === 'Ready' && message.source === 'host' && typeof payload.source === 'string') {
                if (message.requestId !== null && message.requestId !== readyId) { return; }
                if (source && source !== payload.source) {
                    pending.forEach(function (_, id) { finish(id, error('SESSION_RESET', 'Guest session changed.')); });
                    seen.clear();
                    connected = false;
                }
                source = payload.source;
                if (message.requestId === null) { send('Ready', readyId, {}); return; }
                connected = true;
                clearTimeout(readyTimer);
                readyResolve(payload.context);
            } else if (connected && message.type === 'CommandResult' && message.source === 'host' && typeof payload.ok === 'boolean') {
                finish(message.requestId, payload.ok ? null : error(payload.error && payload.error.code || 'COMMAND_FAILED', payload.error && payload.error.message || 'Command failed.'), payload.result);
            } else if (connected && message.type === 'Event' && typeof message.source === 'string' &&
                typeof payload.name === 'string' && typeof payload.eventId === 'string') {
                if (message.source === source || seen.has(payload.eventId)) { return; }
                seen.add(payload.eventId);
                if (seen.size > 2048) { seen.delete(seen.values().next().value); }
                var metadata = Object.freeze({ source: message.source, eventId: payload.eventId });
                (listeners.get(payload.name) || []).slice().forEach(function (handler) {
                    try { handler(payload.args, metadata); }
                    catch (failure) { console.error('SimplyVibe event handler failed:', payload.name, failure); }
                });
            }
        }
        root.addEventListener('message', receive);
        send('Ready', readyId, {});
        this.ready = function () { return disposed ? Promise.reject(error('DISPOSED', 'Client disposed.')) : readyPromise; };
        this.executeCommand = function (name, parameter, context) {
            if (disposed) { return Promise.reject(error('DISPOSED', 'Client disposed.')); }
            return readyPromise.then(function () {
                if (disposed) { throw error('DISPOSED', 'Client disposed.'); }
                if (!connected) { throw error('SESSION_RESET', 'Guest session changed.'); }
                return new Promise(function (resolve, reject) {
                    var id = prefix + ':' + (++sequence);
                    pending.set(id, { resolve: resolve, reject: reject, timer: setTimeout(function () {
                        finish(id, error('TIMEOUT', 'Command timed out; execution may still complete in the host.'));
                    }, timeout) });
                    try { send('ExecuteCommand', id, { name: name, parameter: parameter, context: context }); }
                    catch (failure) { finish(id, error('SERIALIZATION_ERROR', failure.message)); }
                });
            });
        };
        this.on = function (name, handler) {
            if (disposed) { throw error('DISPOSED', 'Client disposed.'); }
            if (typeof name !== 'string' || typeof handler !== 'function') { throw new Error('Event name and handler are required.'); }
            var handlers = listeners.get(name) || [];
            handlers.push(handler);
            listeners.set(name, handlers);
            return function () { listeners.set(name, (listeners.get(name) || []).filter(function (item) { return item !== handler; })); };
        };
        this.setHeader = function (options) { return this.executeCommand('SetHeader', options); };
        this.dispose = function () {
            if (disposed) { return; }
            disposed = true;
            connected = false;
            root.removeEventListener('message', receive);
            clearTimeout(readyTimer);
            readyReject(error('DISPOSED', 'Client disposed.'));
            pending.forEach(function (_, id) { finish(id, error('DISPOSED', 'Client disposed.')); });
            listeners.clear();
            seen.clear();
        };
    }
    root.SimplyVibeClient = SimplyVibeClient;
})(window);
