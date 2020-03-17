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
export var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 1] = "Up";
    Direction[Direction["Down"] = 2] = "Down";
    Direction[Direction["Left"] = 3] = "Left";
    Direction[Direction["Right"] = 4] = "Right";
})(Direction || (Direction = {}));
var Player = /** @class */ (function () {
    function Player(color, direction, position) {
        this.is_dead = false;
        this.history = [];
        this.color = color;
        this.direction = direction;
        this.position = position;
    }
    return Player;
}());
export { Player };
var Engine = /** @class */ (function () {
    function Engine(players, gameMap, gameSize) {
        this.players = players;
        this.game_map = gameMap;
        this.game_size = gameSize;
    }
    Engine.nextPosition = function (p) {
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
    };
    Engine.advancePlayer = function (p) {
        if (p.is_dead)
            return;
        p.history.push(p.position);
        // update position
        p.position = Engine.nextPosition(p);
    };
    /**
     * Execute a turn in game. It should be called only after every other change has been acknowledged.
     */
    Engine.prototype.elapseTime = function () {
        var _this = this;
        this.players.forEach(function (p) {
            Engine.advancePlayer(p);
            // draw new position
            _this.game_map.drawBlock(p.position.x, p.position.y, p.color);
        });
    };
    return Engine;
}());
export { Engine };
var ClientEngine = /** @class */ (function (_super) {
    __extends(ClientEngine, _super);
    function ClientEngine() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ClientEngine.prototype.applyChangetoPlayer = function (color, dir, is_dead) {
        this.players.forEach(function (p) {
            if (p.color == color.toUpperCase()) {
                if (dir != null)
                    p.direction = dir;
                if (is_dead != null)
                    p.is_dead = is_dead;
            }
        });
    };
    return ClientEngine;
}(Engine));
