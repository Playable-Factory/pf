

var GetMagnitude = require('./GetMagnitude');


var SetMagnitude = function (point, magnitude)
{
    if (point.x !== 0 || point.y !== 0)
    {
        var m = GetMagnitude(point);

        point.x /= m;
        point.y /= m;
    }

    point.x *= magnitude;
    point.y *= magnitude;

    return point;
};

module.exports = SetMagnitude;
