

var Rectangle = require('./Rectangle');
var Intersects = require('../intersects/RectangleToRectangle');


var Intersection = function (rectA, rectB, out)
{
    if (out === undefined) { out = new Rectangle(); }

    if (Intersects(rectA, rectB))
    {
        out.x = Math.max(rectA.x, rectB.x);
        out.y = Math.max(rectA.y, rectB.y);
        out.width = Math.min(rectA.right, rectB.right) - out.x;
        out.height = Math.min(rectA.bottom, rectB.bottom) - out.y;
    }
    else
    {
        out.setEmpty();
    }

    return out;
};

module.exports = Intersection;
