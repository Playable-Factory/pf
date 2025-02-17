

var DistanceBetweenPoints = require('../../math/distance/DistanceBetweenPoints');
var GetEaseFunction = require('../../tweens/builders/GetEaseFunction');
var Point = require('../point/Point');


var GetEasedPoints = function (line, ease, quantity, collinearThreshold, easeParams)
{
    if (collinearThreshold === undefined) { collinearThreshold = 0; }
    if (easeParams === undefined) { easeParams = []; }

    var results = [];

    var x1 = line.x1;
    var y1 = line.y1;

    var spaceX = line.x2 - x1;
    var spaceY = line.y2 - y1;

    var easeFunc = GetEaseFunction(ease, easeParams);

    var i;
    var v;
    var q = quantity - 1;

    for (i = 0; i < q; i++)
    {
        v = easeFunc(i / q);

        results.push(new Point(x1 + (spaceX * v), y1 + (spaceY * v)));
    }

    //  Always include the end of the line
    v = easeFunc(1);

    results.push(new Point(x1 + (spaceX * v), y1 + (spaceY * v)));

    //  Remove collinear parts
    if (collinearThreshold > 0)
    {
        var prevPoint = results[0];

        //  Store the new results here
        var sortedResults = [ prevPoint ];

        for (i = 1; i < results.length - 1; i++)
        {
            var point = results[i];

            if (DistanceBetweenPoints(prevPoint, point) >= collinearThreshold)
            {
                sortedResults.push(point);
                prevPoint = point;
            }
        }

        //  Top and tail
        var endPoint = results[results.length - 1];

        if (DistanceBetweenPoints(prevPoint, endPoint) < collinearThreshold)
        {
            sortedResults.pop();
        }

        sortedResults.push(endPoint);

        return sortedResults;
    }
    else
    {
        return results;
    }
};

module.exports = GetEasedPoints;
