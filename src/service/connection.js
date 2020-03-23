/**
 * Connects to server through websocket at a given address.
 * @param address Address of server
 * @param clientEngine Engine, which will handle messages
 */
function connectThroughWebSocket(address, clientEngine) {
    let ws = new WebSocket(address);
    ws.onopen = () => {
        // Websocket is connected
        // TODO show next phase
    };
    ws.onmessage = (evt) => {
        let reveiced_message = evt.data;
        // TODO
    };
}
