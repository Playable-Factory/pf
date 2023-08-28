

var GetAspectRatio = require('./GetAspectRatio');


var FitInside = function (target, source)
{
    var ratio = GetAspectRatio(target);

    if (ratio < GetAspectRatio(source))
    {
        //  Taller than Wide
        target.setSize(source.height * ratio, source.height);
    }
    else
    {
        //  Wider than Tall
        target.setSize(source.width, source.width / ratio);
    }

    return target.setPosition(
        source.centerX - (target.width / 2),
        source.centerY - (target.height / 2)
    );
};

module.exports = FitInside;
