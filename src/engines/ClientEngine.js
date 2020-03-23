import { Engine } from "./engine.js";
class ClientEngine extends Engine {
    applyChangetoPlayer(color, dir, is_dead) {
        this.players.forEach(p => {
            if (p.color == color.toUpperCase()) {
                if (dir != null)
                    p.direction = dir;
                if (is_dead != null)
                    p.is_dead = is_dead;
            }
        });
    }
}
