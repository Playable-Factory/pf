import SpriteMask from "./spriteMask";
// import { Curves, Math } from "phaser";
import Curve from "./curve-2d/Curve";
import QuadraticBezier from "./curve-2d/QuadraticBezierCurve";
import Vector2 from "./curve-2d/Vector2";
import gsap, { Power0 } from "gsap";
import gx from "pf.js/src/2d";

class Utils {
	constructor(pixiScene) {
		this.scene = pixiScene;
	}
	spriteMask(sprite, mask, invertAlpha) {
		new SpriteMask(sprite, mask, invertAlpha);
	}
	curve(startPoint, endPoint, controlPoint, enableDebug = false) {
		let path = { t: 0, vec: new Vector2() };

		var sp = new Vector2(startPoint.x, startPoint.y);
		var ep = new Vector2(endPoint.x, endPoint.y);
		var cp = new Vector2(controlPoint.x, controlPoint.y);
		let curve = new QuadraticBezier(sp, cp, ep);

		if (enableDebug) {
			console.log(curve);
			let graphics = gx.add.graphics();
			graphics.lineStyle(2, 0xff00ff, 1);

			let points = curve.getPoints(30);

			// graphics.beginPath();
			graphics.moveTo(points[0].x, points[0].y);
			points.forEach((point) => {
				graphics.lineTo(point.x, point.y);
			});
			// graphics.strokePath();
		}

		return path;
		gsap.to(path, {
			t: 1,
			duration,
			onUpdate: () => {
				curve.getPoint(path.t, path.vec);
				let x = path.vec.x;
				let y = path.vec.y;
				callback(x, y);
			},
			onComplete: () => {},
			ease: Power0.easeNone,
		});
	}
}
export default Utils;
