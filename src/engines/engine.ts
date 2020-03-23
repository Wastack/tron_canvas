import { GameMap } from "../canvas.js"
import { Size, Color, Position } from "../utils.js"

export enum Direction {
    Up = 1,
    Down,
    Left,
    Right
}

export class Player {
    color: Color  // it is also a unique ID
    direction: Direction
    position: Position
    is_dead: boolean = false
    history: Position[] = []

    constructor(color: Color, direction: Direction, position: Position) {
        this.color = color
        this.direction = direction
        this.position = position
    }
}

export class Engine {
    protected players: Player[]
    protected game_size: Size
    protected game_map: GameMap

    constructor(players: Player[], gameMap: GameMap, gameSize: Size) {
        this.players = players
        this.game_map = gameMap
        this.game_size = gameSize
    }

    protected static nextPosition(p: Player): Position {
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

    protected static advancePlayer(p: Player) {
        if (p.is_dead)
            return
        p.history.push(p.position)

        // update position
        p.position = Engine.nextPosition(p)
    }
    /**
     * Execute a turn in game. It should be called only after every other change has been acknowledged.
     */
    protected elapseTime() {
        this.players.forEach(p => {
            Engine.advancePlayer(p)
            // draw new position
            this.game_map.drawBlock(p.position.x, p.position.y, p.color)
        })
    }
}