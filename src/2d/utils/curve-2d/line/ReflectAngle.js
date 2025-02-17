

var Angle = require('./Angle');
var NormalAngle = require('./NormalAngle');


var ReflectAngle = function (lineA, lineB)
{
    return (2 * NormalAngle(lineB) - Math.PI - Angle(lineA));
};

module.exports = ReflectAngle;
