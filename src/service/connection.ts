import { Engine } from "../engines/engine.js";
import { load } from "../../node_modules/protobufjs/index.js";


/**
 * Connects to server through websocket at a given address.
 * @param address Address of server
 * @param clientEngine Engine, which will handle messages
 */
function connectThroughWebSocket(address: string, clientEngine: Engine) {
    let ws: WebSocket = new WebSocket(address)
    ws.onopen = () => {
        // Websocket is connected
        // TODO show next phase
    }

    ws.onmessage = (evt: MessageEvent) => {
        let reveiced_message = evt.data
        // TODO
    }

}