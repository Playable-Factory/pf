

var Length = require('./Length');


var Extend = function (line, left, right)
{
    if (right === undefined) { right = left; }

    var length = Length(line);

    var slopX = line.x2 - line.x1;
    var slopY = line.y2 - line.y1;

    if (left)
    {
        line.x1 = line.x1 - slopX / length * left;
        line.y1 = line.y1 - slopY / length * left;
    }

    if (right)
    {
        line.x2 = line.x2 + slopX / length * right;
        line.y2 = line.y2 + slopY / length * right;
    }

    return line;
};

module.exports = Extend;
