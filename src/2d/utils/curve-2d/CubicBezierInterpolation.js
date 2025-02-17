


function P0(t, p) {
	var k = 1 - t;

	return k * k * k * p;
}


function P1(t, p) {
	var k = 1 - t;

	return 3 * k * k * t * p;
}


function P2(t, p) {
	return 3 * (1 - t) * t * t * p;
}


function P3(t, p) {
	return t * t * t * p;
}


var CubicBezierInterpolation = function (t, p0, p1, p2, p3) {
	return P0(t, p0) + P1(t, p1) + P2(t, p2) + P3(t, p3);
};

module.exports = CubicBezierInterpolation;
