import globals from "../../../globals";

class Responsive {
	constructor(config) {
		this.config = config;
	}

	resize(iw, ih) {
		let camera = globals.threeCamera;
		let renderer = globals.threeRenderer;
		let canvas = globals.threeRenderer.domElement;

		let config = this.config;
		let resolution = config.resolution || 1;
		let scale = 1 / resolution;

		let canvasWidth, canvasHeight;

		if (config.maxDimension && iw * resolution > config.maxDimension && ih * resolution > config.maxDimension) {
			var maxWidth = config.maxDimension;

			scale = Math.min(iw / maxWidth, ih / maxWidth) + 0.0015;
			resolution = 1;

			canvasWidth = Math.ceil(iw / scale);
			canvasHeight = Math.ceil(ih / scale);
		} else {
			canvasWidth = iw * resolution;
			canvasHeight = ih * resolution;
		}

		// canvas.style["-ms-transform"] = "scale(" + scale + ")";
		// canvas.style["-webkit-transform"] = "scale3d(" + scale + ", 1)";
		// canvas.style["-moz-transform"] = "scale(" + scale + ")";
		// canvas.style["-o-transform"] = "scale(" + scale + ")";
		// canvas.style.transform = "scale(" + scale + ")";
		// canvas.style.transformOrigin = "top left";

		canvas.setAttribute(
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
				" transform-origin: top left;"
		);

		let rw = iw;
		let rh = ih;

		// document.body.style.maxWidth = iw + "px";
		// document.body.style.maxHeight = ih + "px";

		let styleWidth = canvasWidth + "px";
		let styleHeight = canvasHeight + "px";

		canvas.style.maxWidth = styleWidth;
		canvas.style.maxHeight = styleHeight;
		// canvas.style.width = styleWidth;
		// canvas.style.height = styleHeight;

		var aspect = canvasWidth / canvasHeight;
		camera.aspect = aspect;
		camera.updateProjectionMatrix();
		renderer.setSize(canvasWidth, canvasHeight);

		app.canvasWidth = canvasWidth;
		app.canvasHeight = canvasHeight;

		return { width: canvasWidth, height: canvasHeight };
	}
}

export default Responsive;
