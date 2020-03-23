export class WebSocketClient {
    constructor(clientEngine) {
        this.client_engine = clientEngine;
        // load chat
        //const chat = require("../format/Chat_pb.js")
    }
    onMessageCallback(e) {
        // TODO
    }
    onOpenCallback() {
        // TODO
    }
    /**
     * Connects to server through websocket at a given address.
     * @param address Address of server
     * @param clientEngine Engine, which will handle messages
     */
    connectThroughWebSocket(address) {
        let ws = new WebSocket(address);
        ws.onopen = this.onOpenCallback;
        ws.onmessage = this.onMessageCallback;
    }
}
