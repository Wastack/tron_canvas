export var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 1] = "Up";
    Direction[Direction["Down"] = 2] = "Down";
    Direction[Direction["Left"] = 3] = "Left";
    Direction[Direction["Right"] = 4] = "Right";
})(Direction || (Direction = {}));
export class Player {
    constructor(color, direction, position) {
        this.is_dead = false;
        this.history = [];
        this.color = color;
        this.direction = direction;
        this.position = position;
    }
}
export class Engine {
    constructor(players, gameMap, gameSize) {
        this.players = players;
        this.game_map = gameMap;
        this.game_size = gameSize;
    }
    static nextPosition(p) {
        switch (p.direction) {
            case Direction.Up:
                return { x: p.position.x, y: p.position.y - 1 };
            case Direction.Down:
                return { x: p.position.x, y: p.position.y + 1 };
            case Direction.Left:
                return { x: p.position.x - 1, y: p.position.y };
            case Direction.Right:
                return { x: p.position.x + 1, y: p.position.y };
        }
    }
    static advancePlayer(p) {
        if (p.is_dead)
            return;
        p.history.push(p.position);
        // update position
        p.position = Engine.nextPosition(p);
    }
    /**
     * Execute a turn in game. It should be called only after every other change has been acknowledged.
     */
    elapseTime() {
        this.players.forEach(p => {
            Engine.advancePlayer(p);
            // draw new position
            this.game_map.drawBlock(p.position.x, p.position.y, p.color);
        });
    }
}
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
