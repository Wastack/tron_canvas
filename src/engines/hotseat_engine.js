import { Engine, Direction, Player } from "./engine.js";
class LocalPlayer extends Player {
    constructor(color, direction, position) {
        super(color, direction, position);
        this.direction_queue = new DirectionQueue(direction);
    }
    setControls(up, down, left, right) {
        this.controls = { up: up, down: down, left: left, right: right };
    }
    tryKeyControl(key) {
        if (this.controls === undefined) {
            return;
        }
        switch (key) {
            case this.controls.up:
                this.direction_queue.push_back(Direction.Up);
                break;
            case this.controls.down:
                this.direction_queue.push_back(Direction.Down);
                break;
            case this.controls.left:
                this.direction_queue.push_back(Direction.Left);
                break;
            case this.controls.right:
                this.direction_queue.push_back(Direction.Right);
                break;
        }
    }
}
export class HotSeatEngine extends Engine {
    constructor(gameMap, gameSize) {
        super([], gameMap, gameSize);
        this.game_started = false;
        this.game_over = false;
        this.timer_id = 0;
        this.SPEED_MILISEC = 50;
        this.resetGame();
    }
    startGame(speed) {
        this.timer_id = setInterval(() => this.elapseTimeWithCheck(), speed);
    }
    elapseTimeWithCheck() {
        // assign new directions
        this.players.forEach(p => {
            p.direction = p.direction_queue.next();
        });
        this.elapseTime();
        // check if somebody died
        this.players.forEach(p => {
            // Check collide with wall
            if (p.position.y < 0 || p.position.x < 0 ||
                p.position.x >= this.game_size.width || p.position.y >= this.game_size.height) {
                p.is_dead = true;
            }
            // Check collide with players' history and head
            this.players.forEach(o => {
                o.history.forEach(pos => {
                    if (pos.x == p.position.x && pos.y == p.position.y) {
                        p.is_dead = true;
                    }
                });
                if (o.color == p.color)
                    return; // same player, head is same
                // check colliding with head
                // both players should die
                if (o.position.x == p.position.x && o.position.y == p.position.y) {
                    p.is_dead = true;
                    o.is_dead = true;
                }
            });
        });
        let alive_count = 0;
        this.players.forEach(p => {
            if (!p.is_dead)
                alive_count++;
        });
        if (alive_count < 2) {
            this.game_over = true;
            clearInterval(this.timer_id);
        }
    }
    resetGame() {
        let pos1x = Math.floor(this.game_size.width / 4);
        let pos1y = Math.floor(this.game_size.height / 4);
        let pos2x = Math.floor(this.game_size.width * (3 / 4));
        let pos2y = Math.floor(this.game_size.height * (3 / 4));
        let player1 = new LocalPlayer("#FF0000", Direction.Right, { x: pos1x, y: pos1y });
        player1.setControls("ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight");
        let player2 = new LocalPlayer("#00FF00", Direction.Left, { x: pos2x, y: pos2y });
        player2.setControls("w", "s", "a", "d");
        this.players = [
            player1,
            player2
        ];
        this.game_map.clearMap();
        this.players.forEach(p => {
            this.game_map.drawBlock(p.position.x, p.position.y, p.color);
        });
        this.game_started = false;
        this.game_over = false;
    }
    /**
     * If game is over, resets the game. If game is not started than starts the game
     * @returns True is reset or start successfully happened
     */
    userStartOrReset() {
        if (this.game_started && !this.game_over)
            return false;
        if (!this.game_started) {
            // TODO ensure map is reset etc.
            // start the game
            this.game_started = true;
            this.startGame(this.SPEED_MILISEC);
        }
        else if (this.game_over) {
            this.resetGame();
        }
        return true;
    }
    registerKeyboardEvents() {
        document.addEventListener('keydown', e => {
            if (e.key == "Enter") {
                this.userStartOrReset();
                return;
            }
            this.players.forEach(p => {
                p.tryKeyControl(e.key);
            });
        });
    }
}
class DirectionQueue {
    constructor(first_direction) {
        this.queue = [first_direction];
    }
    next() {
        if (this.queue.length > 1) {
            return this.queue.shift();
        }
        else {
            return this.queue[0];
        }
    }
    push_back(dir) {
        // check opposites
        let opposite = function (d) {
            switch (d) {
                case Direction.Up:
                    return Direction.Down;
                case Direction.Down:
                    return Direction.Up;
                case Direction.Right:
                    return Direction.Left;
                case Direction.Left:
                    return Direction.Right;
            }
        };
        // check if direction is not opposite to the last command
        if (this.queue[this.queue.length - 1] == opposite(dir))
            return; // Invalid direction, cannot put to queue
        this.queue.push(dir);
    }
}
