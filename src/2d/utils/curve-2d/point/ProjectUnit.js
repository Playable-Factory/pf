

var Point = require('./Point');


var ProjectUnit = function (pointA, pointB, out)
{
    if (out === undefined) { out = new Point(); }

    var amt = ((pointA.x * pointB.x) + (pointA.y * pointB.y));

    if (amt !== 0)
    {
        out.x = amt * pointB.x;
        out.y = amt * pointB.y;
    }

    return out;
};

module.exports = ProjectUnit;
