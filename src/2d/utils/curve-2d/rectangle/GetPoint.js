

var Perimeter = require('./Perimeter');
var Point = require('../point/Point');


var GetPoint = function (rectangle, position, out)
{
    if (out === undefined) { out = new Point(); }

    if (position <= 0 || position >= 1)
    {
        out.x = rectangle.x;
        out.y = rectangle.y;

        return out;
    }

    var p = Perimeter(rectangle) * position;

    if (position > 0.5)
    {
        p -= (rectangle.width + rectangle.height);

        if (p <= rectangle.width)
        {
            //  Face 3
            out.x = rectangle.right - p;
            out.y = rectangle.bottom;
        }
        else
        {
            //  Face 4
            out.x = rectangle.x;
            out.y = rectangle.bottom - (p - rectangle.width);
        }
    }
    else if (p <= rectangle.width)
    {
        //  Face 1
        out.x = rectangle.x + p;
        out.y = rectangle.y;
    }
    else
    {
        //  Face 2
        out.x = rectangle.right;
        out.y = rectangle.y + (p - rectangle.width);
    }

    return out;
};

module.exports = GetPoint;
