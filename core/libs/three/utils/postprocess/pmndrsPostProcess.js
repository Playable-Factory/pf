import { BlendFunction, BloomEffect, DepthOfFieldEffect, EffectComposer, EffectPass, OutlineEffect, RenderPass, SMAAEffect, SelectiveBloomEffect } from "postprocessing";
import globals from "../../../../../globals";
import DatGUIHelper from "../../../../../game/helpers/general/datguiHelper";

let main;
export default class PmndrsPostprocess {
	constructor() {
		main = app.main;
	}

	reset() {
		if (!this.composer) return;

		this.composer.passes.forEach((pass) => {
			if (pass.camera) {
				pass.camera = app.main.camera;
			}
		});
	}

	init() {
		main = app.main;

		let composer = new EffectComposer(main.renderer);
		this.composer = composer;
		composer.addPass(new RenderPass(main.scene, main.camera));

		//let bloom = this.initBloom();
		//globals.bloom = bloom;

		/* if (globals.data.outlineEnabled) {
			let outline = this.initOutline();
			const outlinePass = new EffectPass(main.camera, outline);
			composer.addPass(outlinePass);
			globals.outline = outline;
		} */

		//let dof = this.initDof();

		//const effectPass = new EffectPass(main.camera, bloom);
		//composer.addPass(effectPass);

		this.enabled = true;

		setTimeout(() => {
			//this.bloomOptions(bloom);
			//	this.dofOptions(dof);
		}, 1000);
	}

	initOutline() {
		const outlineEffect = new OutlineEffect(main.scene, main.camera, {
			blendFunction: BlendFunction.SCREEN,
			edgeStrength: 2.5,
			pulseSpeed: 0.0,
			visibleEdgeColor: globals.data.outlineColor,
			hiddenEdgeColor: globals.data.outlineHiddenColor,
			height: 480,
			blur: false,
			xRay: true,
		});

		return outlineEffect;
	}

	initDof() {
		const depthOfFieldEffect = new DepthOfFieldEffect(main.camera, {
			focusDistance: 0.0,
			focalLength: 0.1479,
			bokehScale: 4.157,
			height: 256,
		});

		return depthOfFieldEffect;
	}

	dofOptions(effect) {
		const cocMaterial = effect.circleOfConfusionMaterial;

		const params = {
			coc: {
				focus: cocMaterial.uniforms.focusDistance.value,
				"focal length": cocMaterial.uniforms.focalLength.value,
				"edge blur kernel": effect.blurPass.kernelSize,
			},
			"bokeh scale": effect.bokehScale,
		};

		let KernelSize = {
			VERY_SMALL: 0,
			SMALL: 1,
			MEDIUM: 2,
			LARGE: 3,
			VERY_LARGE: 4,
			HUGE: 5,
		};

		let menu = DatGUIHelper.guiman;
		let folder = menu.addFolder("Circle of Confusion");
		menu.open();

		folder.add(params.coc, "edge blur kernel", KernelSize).onChange((value) => {
			effect.blurPass.kernelSize = Number(value);
		});

		folder.add(params.coc, "focus", 0.0, 1.0, 0.001).onChange((value) => {
			cocMaterial.uniforms.focusDistance.value = value;
		});

		folder.add(params.coc, "focal length", 0.0, 1.0, 0.0001).onChange((value) => {
			cocMaterial.uniforms.focalLength.value = value;
		});
		menu.add(params, "bokeh scale", 1.0, 5.0, 0.001).onChange((value) => {
			effect.bokehScale = value;
		});
	}

	initBloom() {
		const effect = new SelectiveBloomEffect(main.scene, main.camera, {
			blendFunction: BlendFunction.ADD,
			mipmapBlur: true,
			luminanceThreshold: 0.148,
			luminanceSmoothing: 0.247,
			intensity: 5.3,
		});
		effect.mipmapBlurPass.radius = 0.66;

		//effect.inverted = true;
		return effect;
	}

	bloomOptions(_effect) {
		//const pass = this.pass;
		const effect = _effect;
		const blendMode = effect.blendMode;

		const params = {
			intensity: effect.intensity,
			radius: effect.mipmapBlurPass.radius,
			luminance: {
				filter: effect.luminancePass.enabled,
				threshold: effect.luminanceMaterial.threshold,
				smoothing: effect.luminanceMaterial.smoothing,
			},
			selection: {
				inverted: effect.inverted,
				"ignore bg": effect.ignoreBackground,
			},
			opacity: blendMode.opacity.value,
			"blend mode": blendMode.blendFunction,
		};

		let menu = DatGUIHelper.guiman;

		menu.add(params, "intensity", 0.0, 10.0, 0.01).onChange((value) => {
			effect.intensity = Number(value);
		});

		menu.add(params, "radius", 0.0, 1.0, 0.001).onChange((value) => {
			effect.mipmapBlurPass.radius = Number(value);
		});

		let folder = menu.addFolder("Luminance");

		folder.add(params.luminance, "filter").onChange((value) => {
			effect.luminancePass.enabled = value;
		});

		folder.add(params.luminance, "threshold", 0.0, 1.0, 0.001).onChange((value) => {
			effect.luminanceMaterial.threshold = Number(value);
		});

		folder.add(params.luminance, "smoothing", 0.0, 1.0, 0.001).onChange((value) => {
			effect.luminanceMaterial.smoothing = Number(value);
		});

		folder.open();
		folder = menu.addFolder("Selection");

		folder.add(params.selection, "inverted").onChange((value) => {
			effect.inverted = value;
		});

		folder.add(params.selection, "ignore bg").onChange((value) => {
			effect.ignoreBackground = value;
		});

		folder.open();

		menu.add(params, "opacity", 0.0, 1.0, 0.01).onChange((value) => {
			blendMode.opacity.value = value;
		});

		menu.add(params, "blend mode", BlendFunction).onChange((value) => {
			blendMode.setBlendFunction(Number(value));
		});

		/* menu.add(pass, "dithering").onChange((value) => {
			pass.dithering = value;
		}); */
	}

	render() {
		this.composer.render();
	}

	update() {}

	resize(w, h) {
		if (!this.composer) return;
		this.composer.setSize(w, h);
	}
}
