import { Engine, Direction, Player } from "./engine.js"
import { GameMap } from "../canvas.js"
import { Size, Color, Position } from "../utils.js"

class LocalPlayer extends Player {
    direction_queue: DirectionQueue
    
    constructor(color: Color, direction: Direction, position: Position) {
        super(color, direction, position)
        this.direction_queue = new DirectionQueue(direction)
    }
}

export class HotSeatEngine extends Engine {
    game_started: boolean = false
    game_over: boolean = false
    timer_id: number = 0
    readonly SPEED_MILISEC = 50

    constructor(gameMap: GameMap, gameSize: Size) {
        super([], gameMap, gameSize)
        this.resetGame()
    }

    startGame(speed: number) {
        this.timer_id = setInterval(() => this.elapseTimeWithCheck(), speed)
    }

    elapseTimeWithCheck() {
        // assign new directions
        (<LocalPlayer[]> this.players).forEach(p => {
            p.direction = p.direction_queue.next()
        })

        this.players.forEach(p => {
            let next_pos = Engine.nextPosition(p)
            // Check collide with wall
            if (next_pos.y < 0 || next_pos.x < 0 ||
                next_pos.x >= this.game_size.width || next_pos.y >= this.game_size.height) {
                p.is_dead = true
            }
            // Check collide with players' history and head
            this.players.forEach(o => {
                o.history.forEach(pos => {
                    if (pos.x == next_pos.x && pos.y == next_pos.y) {
                        p.is_dead = true
                    }
                })
                if (o.color == p.color)
                    return  // same player, head is same
                // check colliding with head
                // both players should die
                if (o.position.x == next_pos.x && o.position.y == next_pos.y) {
                    p.is_dead = true
                    o.is_dead = true
                }
            })
        })
        let alive_count = 0
        this.players.forEach(p => {
            if (!p.is_dead)
                alive_count++;
        });
        if (alive_count < 2) {
            this.game_over = true
            clearInterval(this.timer_id)
        }
        this.elapseTime()

    }

    resetGame() {
        let pos1x = Math.floor(this.game_size.width / 4)
        let pos1y = Math.floor(this.game_size.height / 4)
        let pos2x = Math.floor(this.game_size.width * (3 / 4))
        let pos2y = Math.floor(this.game_size.height * (3 / 4))
        this.players = [
            new LocalPlayer("#FF0000", Direction.Right, { x: pos1x, y: pos1y }),
            new LocalPlayer("#00FF00", Direction.Left, { x: pos2x, y: pos2y })
        ]

        this.game_map.clearMap()
        this.players.forEach(p => {
            this.game_map.drawBlock(p.position.x, p.position.y, p.color)
        })
        this.game_started = false
        this.game_over = false
    }

    /**
     * If game is over, resets the game. If game is not started than starts the game
     * @returns True is reset or start successfully happened
     */
    userStartOrReset(): boolean {
        if (this.game_started && !this.game_over)
            return false
        if (!this.game_started) {
            // TODO ensure map is reset etc.
            // start the game
            this.game_started = true
            this.startGame(this.SPEED_MILISEC)
        } else if (this.game_over) {
            this.resetGame()
        }
        return true
    }


    registerKeyboardEvents() {
        document.addEventListener('keydown', e => {
            switch (e.key) {
                case "Enter":
                    this.userStartOrReset();
                    break;
                case "ArrowDown":
                    (<LocalPlayer> this.players[0]).direction_queue.push_back(Direction.Down)
                    break;
                case "ArrowUp":
                    (<LocalPlayer> this.players[0]).direction_queue.push_back(Direction.Up)
                    break;
                case "ArrowLeft":
                    (<LocalPlayer> this.players[0]).direction_queue.push_back(Direction.Left)
                    break;
                case "ArrowRight":
                    (<LocalPlayer> this.players[0]).direction_queue.push_back(Direction.Right)
                    break;
                case "w":
                case "W":
                    (<LocalPlayer> this.players[1]).direction_queue.push_back(Direction.Up)
                    break;
                case "a":
                case "A":
                    (<LocalPlayer> this.players[1]).direction_queue.push_back(Direction.Left)
                    break;
                case "S":
                case "s":
                    (<LocalPlayer> this.players[1]).direction_queue.push_back(Direction.Down)
                    break;
                case "D":
                case "d":
                    (<LocalPlayer> this.players[1]).direction_queue.push_back(Direction.Right)
                    break;
            }
        })
    }
}

class DirectionQueue {
    queue: Direction[]

    constructor(first_direction: Direction) {
        this.queue = [first_direction]
    }

    next(): Direction {
        if(this.queue.length > 1) {
            return this.queue.shift()!!;
        } else {
            return this.queue[0]
        }
    }

    push_back(dir: Direction) {
        // check opposites
        let opposite = function (d: Direction) {
            switch (d) {
                case Direction.Up:
                    return Direction.Down
                case Direction.Down:
                    return Direction.Up
                case Direction.Right:
                    return Direction.Left
                case Direction.Left:
                    return Direction.Right
            }
        }
        // check if direction is not opposite to the last command
        if(this.queue[this.queue.length-1] == opposite(dir))
            return  // Invalid direction, cannot put to queue
        this.queue.push(dir)
    }
}