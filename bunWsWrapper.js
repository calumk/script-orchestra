/** WebSocket server*/
// originally based on BunnyWs : https://github.com/JGTools/BunnyWS

export class bunWsWrapper {
    server;
    /**
    * @param port - The port number to listen on
    * @param events - An object containing event handlers
    */
    constructor(port, events) {
        this.server = Bun.serve({
            websocket: {
                open: (ws) => {
                    ws.data = { id: crypto.randomUUID() };
                    ws.subscribe("global");
                    events.open(ws);
                },
                message: events.message,
                close: events.close,
            },
            fetch(req, server) {
                if (!server.upgrade(req))
                    return new Response(null, { status: 404 });
            },
            port
        });
    }
    /** Publishes a message to all connected clients */
    publish(msg, compress) {
        return this.server.publish("global", msg, compress);
    }
}