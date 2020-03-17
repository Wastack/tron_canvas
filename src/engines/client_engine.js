var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 1] = "Up";
    Direction[Direction["Down"] = 2] = "Down";
    Direction[Direction["Left"] = 3] = "Left";
    Direction[Direction["Right"] = 4] = "Right";
})(Direction || (Direction = {}));
function advancePlayer(p) {
    if (!p.is_alive)
        return;
    p.history.push(p.position);
    switch (p.direction) {
        case Direction.Up:
            p.position.y -= 1;
            break;
        case Direction.Down:
            p.position.y += 1;
            break;
        case Direction.Left:
            p.position.x -= 1;
            break;
        case Direction.Right:
            p.position.x += 1;
            break;
    }
}
var ClientEngine = /** @class */ (function () {
    function ClientEngine(players, gameMap, gameSize) {
        this.players = players;
        this.game_map = gameMap;
        this.game_size = gameSize;
    }
    /**
     * Execute a turn in game. It should be called only after every other change has been acknowledged.
     */
    ClientEngine.prototype.elapseTime = function () {
        var _this = this;
        this.players.forEach(function (p) {
            advancePlayer(p);
            // draw new position
            _this.game_map.drawBlock(p.position.x, p.position.y, p.color);
        });
    };
    return ClientEngine;
}());
