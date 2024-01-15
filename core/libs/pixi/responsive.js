import globals from "../../../globals";

class Responsive {
	constructor() { }

	resize(app, iw, ih) {
		var gameWidth = app.renderer.options.width;
		var gameHeight = app.renderer.options.height;

		var scale = Math.min(iw / gameWidth, ih / gameHeight) + 0.00005;

		var width = iw / scale;
		var height = ih / scale;

		app.stage.lastWidth = width;
		app.stage.lastHeight = height;

		// app.renderer.view.style["-ms-transform"] = "scale(" + scale + ")";
		// app.renderer.view.style["-webkit-transform"] = "scale3d(" + scale + ", 1)";
		// app.renderer.view.style["-moz-transform"] = "scale(" + scale + ")";
		// app.renderer.view.style["-o-transform"] = "scale(" + scale + ")";
		// app.renderer.view.style.transform = "scale(" + scale + ")";
		// app.renderer.view.style.transformOrigin = "top left";

		app.renderer.view.setAttribute(
			"style",
			" -ms-transform: scale(" +
			scale +
			"); -webkit-transform: scale3d(" +
			scale +
			", 1);" +
			" -moz-transform: scale(" +
			scale +
			"); -o-transform: scale(" +
			scale +
			"); transform: scale(" +
			scale +
			");" +
			" transform-origin: top left;" +
			" z-index: 2;"
		);

		/* app.renderer.view.style.width = iw + "px";
			app.renderer.view.style.height = ih + "px"; */

		app.renderer.resize(width, height);

		app.renderer.view.style.maxWidth = width;
		app.renderer.view.style.maxHeight = height; //comment for inmobi

		return { width, height };
	}

	resizeObjects(w, h) {
		let app = globals.pixiApp;

		const objects = [];
		this.getAllGameObjects(app.stage, objects);

		globals.pixiScenes.forEach((scene) => {
			scene.baseWidth = w;
			scene.baseHeight = h;
		});

		for (var obj of objects) {
			if (obj.data && obj.data.hasLandscapeTexture) {
				console.log(obj.data);
				if (w > h) {
					obj.texture = PIXI.utils.TextureCache[obj.data.landscapeTexture.uuid];
				} else {
					obj.texture = PIXI.utils.TextureCache[obj.data.texture.uuid];
				}
			}

			let refs = ["left", "right", "top", "bottom"];
			refs.forEach((ref) => {
				const refObj = obj[ref + "Ref"];
				if (refObj && !refObj.destroyed) {
					refObj.onResizeCallback(refObj.parent.lastWidth || refObj.parent.baseWidth, refObj.parent.lastHeight || refObj.parent.baseHeight);
				}
			});

			if (obj.onResizeCallback) {
				if (!obj.parent) continue;
				obj.onResizeCallback(obj.parent.lastWidth || obj.parent.baseWidth, obj.parent.lastHeight || obj.parent.baseHeight);

				obj.base = {
					x: obj.x,
					y: obj.y,
					scale: {
						x: obj.scale.x,
						y: obj.scale.y,
					},
				};

				if (obj.dynamicTweens && obj.dynamicTweens.length) {
					obj.dynamicTweens.forEach((animation) => {
						const tween = animation.tween;

						if (!tween.isCompleted) {
							animation.getStart(obj);
							tween.invalidate();
						}
					});
				}
			}
		}
	}

	getAllGameObjects(container, resultArray) {
		container.children.forEach((child) => {
			resultArray.push(child);
			if (child.children && child.children.length > 0) {
				this.getAllGameObjects(child, resultArray);
			}
		});
	}
}

export default Responsive;
