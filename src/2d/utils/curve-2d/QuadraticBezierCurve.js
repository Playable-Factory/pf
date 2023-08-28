

import Curve from "./Curve";
var QuadraticBezierInterpolation = require("./QuadraticBezierInterpolation");
var Vector2 = require("./Vector2");


export default class QuadraticBezier extends Curve {
	constructor(p0, p1, p2) {
		super("QuadraticBezier");

		if (Array.isArray(p0)) {
			p2 = new Vector2(p0[4], p0[5]);
			p1 = new Vector2(p0[2], p0[3]);
			p0 = new Vector2(p0[0], p0[1]);
		}

		
		this.p0 = p0;

		
		this.p1 = p1;

		
		this.p2 = p2;
	}

	
	getStartPoint(out) {
		if (out === undefined) {
			out = new Vector2();
		}

		return out.copy(this.p0);
	}

	
	getResolution(divisions) {
		return divisions;
	}

	
	getPoint(t, out) {
		if (out === undefined) {
			out = new Vector2();
		}

		var p0 = this.p0;
		var p1 = this.p1;
		var p2 = this.p2;

		return out.set(QuadraticBezierInterpolation(t, p0.x, p1.x, p2.x), QuadraticBezierInterpolation(t, p0.y, p1.y, p2.y));
	}

	
	draw(graphics, pointsTotal) {
		if (pointsTotal === undefined) {
			pointsTotal = 32;
		}

		var points = this.getPoints(pointsTotal);

		graphics.beginPath();
		graphics.moveTo(this.p0.x, this.p0.y);

		for (var i = 1; i < points.length; i++) {
			graphics.lineTo(points[i].x, points[i].y);
		}

		graphics.strokePath();

		//  So you can chain graphics calls
		return graphics;
	}

	
	toJSON() {
		return {
			type: this.type,
			points: [this.p0.x, this.p0.y, this.p1.x, this.p1.y, this.p2.x, this.p2.y],
		};
	}
}


QuadraticBezier.fromJSON = function (data) {
	var points = data.points;

	var p0 = new Vector2(points[0], points[1]);
	var p1 = new Vector2(points[2], points[3]);
	var p2 = new Vector2(points[4], points[5]);

	return new QuadraticBezier(p0, p1, p2);
};

// module.exports = QuadraticBezier;
