import { ClientEngine } from "../engines/client_engine.js";


export class WebSocketClient {
    client_engine: ClientEngine
    constructor(clientEngine: ClientEngine) {
        this.client_engine = clientEngine

        // load chat
        //const chat = require("../format/Chat_pb.js")
    }


    onMessageCallback(e: MessageEvent) {
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
    connectThroughWebSocket(address: string) {
        let ws: WebSocket = new WebSocket(address)
        ws.onopen = this.onOpenCallback
        ws.onmessage = this.onMessageCallback

    }
}
