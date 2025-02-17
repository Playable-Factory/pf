

var Point = require('../point/Point');


var GetCenter = function (rect, out)
{
    if (out === undefined) { out = new Point(); }

    out.x = rect.centerX;
    out.y = rect.centerY;

    return out;
};

module.exports = GetCenter;
