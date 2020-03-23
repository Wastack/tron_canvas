import { Engine, Direction, Player } from "./engine.js"
import { Size, Color, Position } from "../utils.js"

class ClientEngine extends Engine {

    applyChangetoPlayer(color: Color, dir?: Direction, is_dead?: boolean) {
        this.players.forEach(p => {
            if (p.color == color.toUpperCase()) {
                if (dir != null)
                    p.direction = dir
                if (is_dead != null)
                    p.is_dead = is_dead
            }
        });
    }

}
