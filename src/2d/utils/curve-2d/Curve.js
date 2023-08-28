

var FromPoints = require("./rectangle/FromPoints");
var Rectangle = require("./rectangle/Rectangle");
var Vector2 = require("./Vector2");


export default class Curve  {

    constructor (type)
    { 
	
		
		this.type = type;

		
		this.defaultDivisions = 5;

		
		this.arcLengthDivisions = 100;

		
		this.cacheArcLengths = [];

		
		this.needsUpdate = true;

		
		this.active = true;

		
		this._tmpVec2A = new Vector2();

		
		this._tmpVec2B = new Vector2();
	}

	
	draw (graphics, pointsTotal) {
		if (pointsTotal === undefined) {
			pointsTotal = 32;
		}

		//  So you can chain graphics calls
		return graphics.strokePoints(this.getPoints(pointsTotal));
	}

	
	getBounds (out, accuracy) {
		if (!out) {
			out = new Rectangle();
		}
		if (accuracy === undefined) {
			accuracy = 16;
		}

		var len = this.getLength();

		if (accuracy > len) {
			accuracy = len / 2;
		}

		//  The length of the curve in pixels
		//  So we'll have 1 spaced point per 'accuracy' pixels

		var spaced = Math.max(1, Math.round(len / accuracy));

		return FromPoints(this.getSpacedPoints(spaced), out);
	}

	
	getDistancePoints (distance) {
		var len = this.getLength();

		var spaced = Math.max(1, len / distance);

		return this.getSpacedPoints(spaced);
	}

	
	getEndPoint (out) {
		if (out === undefined) {
			out = new Vector2();
		}

		return this.getPointAt(1, out);
	}

	
	getLength () {
		var lengths = this.getLengths();

		return lengths[lengths.length - 1];
	}

	
	getLengths (divisions) {
		if (divisions === undefined) {
			divisions = this.arcLengthDivisions;
		}

		if (this.cacheArcLengths.length === divisions + 1 && !this.needsUpdate) {
			return this.cacheArcLengths;
		}

		this.needsUpdate = false;

		var cache = [];
		var current;
		var last = this.getPoint(0, this._tmpVec2A);
		var sum = 0;

		cache.push(0);

		for (var p = 1; p <= divisions; p++) {
			current = this.getPoint(p / divisions, this._tmpVec2B);

			sum += current.distance(last);

			cache.push(sum);

			last.copy(current);
		}

		this.cacheArcLengths = cache;

		return cache; // { sums: cache, sum:sum }; Sum is in the last element.
	}

	// Get point at relative position in curve according to arc length

	// - u [0 .. 1]

	
	getPointAt (u, out) {
		var t = this.getUtoTmapping(u);

		return this.getPoint(t, out);
	}

	// Get sequence of points using getPoint( t )

	
	getPoints (divisions, stepRate, out) {
		if (out === undefined) {
			out = [];
		}

		//  If divisions is a falsey value (false, null, 0, undefined, etc) then we calculate it based on the stepRate instead.
		if (!divisions) {
			if (!stepRate) {
				divisions = this.defaultDivisions;
			} else {
				divisions = this.getLength() / stepRate;
			}
		}

		for (var d = 0; d <= divisions; d++) {
			out.push(this.getPoint(d / divisions));
		}

		return out;
	}

	
	getRandomPoint (out) {
		if (out === undefined) {
			out = new Vector2();
		}

		return this.getPoint(Math.random(), out);
	}

	// Get sequence of points using getPointAt( u )

	
	getSpacedPoints (divisions, stepRate, out) {
		if (out === undefined) {
			out = [];
		}

		//  If divisions is a falsey value (false, null, 0, undefined, etc) then we calculate it based on the stepRate instead.
		if (!divisions) {
			if (!stepRate) {
				divisions = this.defaultDivisions;
			} else {
				divisions = this.getLength() / stepRate;
			}
		}

		for (var d = 0; d <= divisions; d++) {
			var t = this.getUtoTmapping(d / divisions, null, divisions);

			out.push(this.getPoint(t));
		}

		return out;
	}

	
	getStartPoint (out) {
		if (out === undefined) {
			out = new Vector2();
		}

		return this.getPointAt(0, out);
	}

	
	getTangent (t, out) {
		if (out === undefined) {
			out = new Vector2();
		}

		var delta = 0.0001;
		var t1 = t - delta;
		var t2 = t + delta;

		// Capping in case of danger

		if (t1 < 0) {
			t1 = 0;
		}

		if (t2 > 1) {
			t2 = 1;
		}

		this.getPoint(t1, this._tmpVec2A);
		this.getPoint(t2, out);

		return out.subtract(this._tmpVec2A).normalize();
	}

	
	getTangentAt (u, out) {
		var t = this.getUtoTmapping(u);

		return this.getTangent(t, out);
	}

	
	getTFromDistance (distance, divisions) {
		if (distance <= 0) {
			return 0;
		}

		return this.getUtoTmapping(0, distance, divisions);
	}

	
	getUtoTmapping (u, distance, divisions) {
		var arcLengths = this.getLengths(divisions);

		var i = 0;
		var il = arcLengths.length;

		var targetArcLength; // The targeted u distance value to get

		if (distance) {
			//  Cannot overshoot the curve
			targetArcLength = Math.min(distance, arcLengths[il - 1]);
		} else {
			targetArcLength = u * arcLengths[il - 1];
		}

		// binary search for the index with largest value smaller than target u distance

		var low = 0;
		var high = il - 1;
		var comparison;

		while (low <= high) {
			i = Math.floor(low + (high - low) / 2); // less likely to overflow, though probably not issue here, JS doesn't really have integers, all numbers are floats

			comparison = arcLengths[i] - targetArcLength;

			if (comparison < 0) {
				low = i + 1;
			} else if (comparison > 0) {
				high = i - 1;
			} else {
				high = i;
				break;
			}
		}

		i = high;

		if (arcLengths[i] === targetArcLength) {
			return i / (il - 1);
		}

		// we could get finer grain at lengths, or use simple interpolation between two points

		var lengthBefore = arcLengths[i];
		var lengthAfter = arcLengths[i + 1];

		var segmentLength = lengthAfter - lengthBefore;

		// determine where we are between the 'before' and 'after' points

		var segmentFraction = (targetArcLength - lengthBefore) / segmentLength;

		// add that fractional amount to t

		return (i + segmentFraction) / (il - 1);
	}

	
	updateArcLengths () {
		this.needsUpdate = true;

		this.getLengths();
	}
}

