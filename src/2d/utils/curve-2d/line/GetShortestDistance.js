


var GetShortestDistance = function (line, point)
{
    var x1 = line.x1;
    var y1 = line.y1;

    var x2 = line.x2;
    var y2 = line.y2;

    var L2 = (((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)));

    if (L2 === 0)
    {
        return false;
    }

    var s = (((y1 - point.y) * (x2 - x1)) - ((x1 - point.x) * (y2 - y1))) / L2;

    return Math.abs(s) * Math.sqrt(L2);
};

module.exports = GetShortestDistance;
