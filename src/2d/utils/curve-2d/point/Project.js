

var Point = require('./Point');
var GetMagnitudeSq = require('./GetMagnitudeSq');


var Project = function (pointA, pointB, out)
{
    if (out === undefined) { out = new Point(); }

    var dot = ((pointA.x * pointB.x) + (pointA.y * pointB.y));
    var amt = dot / GetMagnitudeSq(pointB);

    if (amt !== 0)
    {
        out.x = amt * pointB.x;
        out.y = amt * pointB.y;
    }

    return out;
};

module.exports = Project;
