

var Rectangle = require('./Rectangle');


var Union = function (rectA, rectB, out)
{
    if (out === undefined) { out = new Rectangle(); }

    //  Cache vars so we can use one of the input rects as the output rect
    var x = Math.min(rectA.x, rectB.x);
    var y = Math.min(rectA.y, rectB.y);
    var w = Math.max(rectA.right, rectB.right) - x;
    var h = Math.max(rectA.bottom, rectB.bottom) - y;

    return out.setTo(x, y, w, h);
};

module.exports = Union;
