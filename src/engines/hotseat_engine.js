var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Engine, Direction, Player } from "./engine.js";
var LocalPlayer = /** @class */ (function (_super) {
    __extends(LocalPlayer, _super);
    function LocalPlayer(color, direction, position) {
        var _this = _super.call(this, color, direction, position) || this;
        _this.direction_queue = new DirectionQueue(direction);
        return _this;
    }
    return LocalPlayer;
}(Player));
var HotSeatEngine = /** @class */ (function (_super) {
    __extends(HotSeatEngine, _super);
    function HotSeatEngine(gameMap, gameSize) {
        var _this = _super.call(this, [], gameMap, gameSize) || this;
        _this.game_started = false;
        _this.game_over = false;
        _this.timer_id = 0;
        _this.SPEED_MILISEC = 50;
        _this.resetGame();
        return _this;
    }
    HotSeatEngine.prototype.startGame = function (speed) {
        var _this = this;
        this.timer_id = setInterval(function () { return _this.elapseTimeWithCheck(); }, speed);
    };
    HotSeatEngine.prototype.elapseTimeWithCheck = function () {
        var _this = this;
        // assign new directions
        this.players.forEach(function (p) {
            p.direction = p.direction_queue.next();
        });
        this.elapseTime();
        // check if somebody died
        this.players.forEach(function (p) {
            // Check collide with wall
            if (p.position.y < 0 || p.position.x < 0 ||
                p.position.x >= _this.game_size.width || p.position.y >= _this.game_size.height) {
                p.is_dead = true;
            }
            // Check collide with players' history and head
            _this.players.forEach(function (o) {
                o.history.forEach(function (pos) {
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
        var alive_count = 0;
        this.players.forEach(function (p) {
            if (!p.is_dead)
                alive_count++;
        });
        if (alive_count < 2) {
            this.game_over = true;
            clearInterval(this.timer_id);
        }
    };
    HotSeatEngine.prototype.resetGame = function () {
        var _this = this;
        var pos1x = Math.floor(this.game_size.width / 4);
        var pos1y = Math.floor(this.game_size.height / 4);
        var pos2x = Math.floor(this.game_size.width * (3 / 4));
        var pos2y = Math.floor(this.game_size.height * (3 / 4));
        this.players = [
            new LocalPlayer("#FF0000", Direction.Right, { x: pos1x, y: pos1y }),
            new LocalPlayer("#00FF00", Direction.Left, { x: pos2x, y: pos2y })
        ];
        this.game_map.clearMap();
        this.players.forEach(function (p) {
            _this.game_map.drawBlock(p.position.x, p.position.y, p.color);
        });
        this.game_started = false;
        this.game_over = false;
    };
    /**
     * If game is over, resets the game. If game is not started than starts the game
     * @returns True is reset or start successfully happened
     */
    HotSeatEngine.prototype.userStartOrReset = function () {
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
    };
    HotSeatEngine.prototype.registerKeyboardEvents = function () {
        var _this = this;
        document.addEventListener('keydown', function (e) {
            switch (e.key) {
                case "Enter":
                    _this.userStartOrReset();
                    break;
                case "ArrowDown":
                    _this.players[0].direction_queue.push_back(Direction.Down);
                    break;
                case "ArrowUp":
                    _this.players[0].direction_queue.push_back(Direction.Up);
                    break;
                case "ArrowLeft":
                    _this.players[0].direction_queue.push_back(Direction.Left);
                    break;
                case "ArrowRight":
                    _this.players[0].direction_queue.push_back(Direction.Right);
                    break;
                case "w":
                case "W":
                    _this.players[1].direction_queue.push_back(Direction.Up);
                    break;
                case "a":
                case "A":
                    _this.players[1].direction_queue.push_back(Direction.Left);
                    break;
                case "S":
                case "s":
                    _this.players[1].direction_queue.push_back(Direction.Down);
                    break;
                case "D":
                case "d":
                    _this.players[1].direction_queue.push_back(Direction.Right);
                    break;
            }
        });
    };
    return HotSeatEngine;
}(Engine));
export { HotSeatEngine };
var DirectionQueue = /** @class */ (function () {
    function DirectionQueue(first_direction) {
        this.queue = [first_direction];
    }
    DirectionQueue.prototype.next = function () {
        if (this.queue.length > 1) {
            return this.queue.shift();
        }
        else {
            return this.queue[0];
        }
    };
    DirectionQueue.prototype.push_back = function (dir) {
        // check opposites
        var opposite = function (d) {
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
    };
    return DirectionQueue;
}());
