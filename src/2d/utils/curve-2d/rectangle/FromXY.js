

var Rectangle = require('./Rectangle');


var FromXY = function (x1, y1, x2, y2, out)
{
    if (out === undefined) { out = new Rectangle(); }

    return out.setTo(
        Math.min(x1, x2),
        Math.min(y1, y2),
        Math.abs(x1 - x2),
        Math.abs(y1 - y2)
    );
};

module.exports = FromXY;
