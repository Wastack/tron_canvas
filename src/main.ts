import {GameMap} from "./canvas.js"
import {HotSeatEngine} from "./engines/hotseat_engine.js"


let engine = new HotSeatEngine(new GameMap({ width: 1024, height: 800 }, { width: 100, height: 100 }), { width: 100, height: 100 })
engine.registerKeyboardEvents(2)