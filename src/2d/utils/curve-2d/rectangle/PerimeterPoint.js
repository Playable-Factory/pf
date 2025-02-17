

var Point = require('../point/Point');
var DegToRad = require('../../math/DegToRad');


var PerimeterPoint = function (rectangle, angle, out)
{
    if (out === undefined) { out = new Point(); }

    angle = DegToRad(angle);

    var s = Math.sin(angle);
    var c = Math.cos(angle);

    var dx = (c > 0) ? rectangle.width / 2 : rectangle.width / -2;
    var dy = (s > 0) ? rectangle.height / 2 : rectangle.height / -2;

    if (Math.abs(dx * s) < Math.abs(dy * c))
    {
        dy = (dx * s) / c;
    }
    else
    {
        dx = (dy * c) / s;
    }

    out.x = dx + rectangle.centerX;
    out.y = dy + rectangle.centerY;

    return out;
};

module.exports = PerimeterPoint;
