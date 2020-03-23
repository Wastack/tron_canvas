import {GameMap} from "./canvas.js"
import {HotSeatEngine} from "./engines/hotseat_engine.js"
import {WebSocketClient} from "./service/connection.js"
import { ClientEngine } from "./engines/client_engine.js"


export function ShowLogin() {
    let login_div = document.getElementById("input-container")
    let canvas_div = document.getElementById("canvas-container")

    login_div?.toggleAttribute("hidden")
    if (!canvas_div?.hasAttribute("hidden")) {
        canvas_div?.toggleAttribute("hidden")
    }

    let hotseat_button = document.getElementById("hotseat_button")

    hotseat_button!!.onclick = () => {
        console.log("Clicked")
        login_div?.toggleAttribute("hidden")
        canvas_div?.toggleAttribute("hidden")
        let engine = new HotSeatEngine(new GameMap({ width: 1024, height: 800 }, { width: 100, height: 100 }), { width: 100, height: 100 })
        engine.registerKeyboardEvents()
    }
    let server_button = document.getElementById("play_server_button")
    server_button!!.onclick = () => {
        let user_name_input = document.getElementById("user_name_input") as HTMLInputElement
        let user_name = user_name_input.value
        if( user_name === undefined) {
            console.error("User name is undefined")
            return
        }
        user_name = user_name.trim()
        if(user_name == "" ) {
            alert("You must specify a user name in order to play on server.")
        }
        if(user_name.length < 3) {
            alert("User name should be at least 3 characters long.")
        }

        let client = new WebSocketClient(new ClientEngine([], new GameMap({ width: 1024, height: 800 }, { width: 100, height: 100 }), { width: 100, height: 100 }))
        // TODO start server engine
        
    }
}