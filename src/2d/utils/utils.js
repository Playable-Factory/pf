import SpriteMask from "./spriteMask";
// import { Curves, Math } from "phaser";
import QuadraticBezier from "./curve-2d/QuadraticBezierCurve";
import Vector2 from "./curve-2d/Vector2";
import gsap, { Power0 } from "gsap";
import pf2D from "pf.js/src/2d";

/**
 * Utility class containing various helper methods.
 */
class Utils {
	/**
	 * Create a Utils instance.
	 * @param {PIXI.Container} pixiScene - The PIXI scene.
	 */
	constructor(pixiScene) {
		this.scene = pixiScene;
	}
	/**
	 * Apply a sprite mask to a sprite.
	 * @param {PIXI.Sprite} sprite - The sprite to apply the mask to.
	 * @param {PIXI.Sprite} mask - The sprite mask to apply.
	 * @param {boolean} invertAlpha - Whether to invert the alpha of the mask.
	 */
	spriteMask(sprite, mask, invertAlpha) {
		new SpriteMask(sprite, mask, invertAlpha);
	}
	/**
	 * Create a curve animation.
	 * @param {Object} startPoint - The start point of the curve.
	 * @param {Object} endPoint - The end point of the curve.
	 * @param {Object} controlPoint - The control point of the curve.
	 * @param {boolean} enableDebug - Whether to enable debug graphics.
	 * @param {number} duration - The duration of the animation.
	 * @param {Function} callback - The callback function for each animation step.
	 */
	curve(startPoint, endPoint, controlPoint, enableDebug = false) {
		let path = { t: 0, vec: new Vector2() };

		var sp = new Vector2(startPoint.x, startPoint.y);
		var ep = new Vector2(endPoint.x, endPoint.y);
		var cp = new Vector2(controlPoint.x, controlPoint.y);
		let curve = new QuadraticBezier(sp, cp, ep);

		if (enableDebug) {
			console.log(curve);
			let graphics = pf2D.add.graphics();
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
