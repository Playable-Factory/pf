

var CenterOn = require('./CenterOn');


var Inflate = function (rect, x, y)
{
    var cx = rect.centerX;
    var cy = rect.centerY;

    rect.setSize(rect.width + (x * 2), rect.height + (y * 2));

    return CenterOn(rect, cx, cy);
};

module.exports = Inflate;
