import { ToonShader } from "./toon_shader";
import { PixelShader } from "./pixel_shader";
import { VignetteShader } from "./vignette_shader";
// import { FilmShader } from './film_shader';
// import { AfterImageShader } from './after_image_shader';
// import { LutShader } from './lut_shader';
// import { BloomShader } from './bloom';

import { LutShader } from "./lut_shader";
import { Assets } from "@pixi/assets";
import { Texture } from "pixi.js-legacy";
import { HueSaturationShader } from "./hue_saturation_shader";
import { BloomShader } from "./bloom";
import { FilmShader } from "./film_shader";

let lutTextureNo = 0;

let data, main;
class PostProcessing {
	constructor(scene) {
		data = app.data;
		main = app.main;

		this.scene = scene;
	}

	init() {
		data = app.data;
		main = app.main;

		let passes = [];
		this.passes = passes;

		let ppData = data.pfPostprocessData;

		function findPass(name) {
			return passes.find((a) => a.name == name);
		}

		window.pfUpdatePostProcessValues = (newData) => {
			this.enabled = newData.enable;

			for (let prop in newData) {
				let dt = newData[prop];
				if (!dt || dt.enable === undefined) continue;

				if (prop == "general") {
					app.stopUpdate = dt.pauseGame;
					continue;
				}

				// let pass = findPass(prop);
				let passString = prop + "Pass";
				let pass = this[passString];
				if (!pass) continue;
				pass.enabled = dt.enable;

				// if (!this.enabled) {
				// 	pass.active = this.enabled;
				// }

				pass.updateValues && pass.updateValues(dt);
			}
		};

		if (!ppData) {
			return;
		}

		this.time = 0;

		let gearboxMode = ppData.gearboxMode;
		let toonData = ppData.toon;
		let lutData = ppData.lut;
		let unrealBloomData = ppData.unreal_bloom;
		let vignetteData = ppData.vignette;
		let colorData = ppData.colorEdit;
		let pixelateData = ppData.pixelate;
		let filmData = ppData.film;
		let afterImageData = ppData.afterImage;
		// let bokehPassData = ppData.bokeh;
		// let motionPassData = ppData.motionBlur;

		this.enabled = ppData.enable;

		// ///LUT SHADER
		if (lutData.enable || gearboxMode) {
			this.initLUT(lutData.texture, lutData.lutPower);
		}

		// ///COLOR EDIT
		if (colorData.enable || gearboxMode) {
			this.initColorEdit(colorData.hue, colorData.saturation);
		}
		// ///PIXELATE SHADER
		if (pixelateData.enable || gearboxMode) {
			this.initPixelate(pixelateData.pixelSize);
		}

		// ///UNREAL BLOOM SHADER
		if (unrealBloomData.enable || gearboxMode) {
			this.initBloom(unrealBloomData.exposure, unrealBloomData.bloomStrength, unrealBloomData.bloomThreshold, unrealBloomData.bloomRadius);
		}

		///TOON SHADER
		if (toonData.enable || gearboxMode) {
			this.initToonShader(toonData.outlineColor, toonData.edgeSens);
		}

		// ///FILM SHADER
		if (filmData.enable || gearboxMode) {
			this.initFilmShader(filmData.nIntensity, filmData.sIntensity, filmData.sCount, filmData.grayscale);
		}
		// ///AFTER IMAGE
		// this.initAfterImagePass(afterImageData.damp);

		// ///VIGNETTE SHADER
		if (vignetteData.enable || gearboxMode) {
			this.initVignette(vignetteData.offset, vignetteData.color, vignetteData.animateSpeed, vignetteData.animateRatio);
		}

		// if(ppData.fxaa.enable || gearboxMode){
		// 	this.initFXAA();
		// }

		////MOTION BLUR
		// if(motionPassData.enable || gearboxMode){
		// 	this.initMotionPass(motionPassData.smearIntensity);
		// }

		// ////BOKEH PASS
		// if(bokehPassData.enable || gearboxMode){
		// 	this.initBokeh(bokehPassData.focus, bokehPassData.aperture, bokehPassData.maxblur);
		// }

		for (let pass of this.passes) {
			if (pass.name == "render" || pass.name == "lut_nearest") continue;
			let passData = ppData[pass.name];
			pass.enabled = passData.enable;
		}
	}

	// /////LUT
	initLUT(textureSrc, lutPower) {
		this.lutPass = new LutShader();

		this.scene.filters = this.scene.filters || [];
		this.scene.filters.push(this.lutPass);

		this.lutPass.updateValues = (dt) => {
			let name = "lut" + lutTextureNo;
			lutTextureNo++;
			Assets.add(name, dt.texture);
			Assets.load(name).then(() => {
				let texture = Texture.from(name);
				this.lutPass.lutMap = texture.baseTexture;
			});

			this.lutPass.lutPower = dt.lutPower;
		};

		this.lutPass.updateValues({
			texture: textureSrc,
			lutPower,
		});
	}

	// /////BLOOM
	initBloom(intensity = 0.5) {
		this.unreal_bloomPass = new BloomShader();
		this.unreal_bloomPass.intensity = intensity;

		this.scene.filters = this.scene.filters || [];
		this.scene.filters.push(this.unreal_bloomPass);

		this.unreal_bloomPass.updateValues = (dt) => {
			this.unreal_bloomPass.intensity = dt.exposure;
		};
	}

	// /////AFTER IMAGE
	initAfterImagePass(damp) {
		return;
		// globals.phaserScene.renderer.pipelines.addPostPipeline("afterImage", AfterImageShader);
		// globals.phaserScene.cameras.main.setPostPipeline("afterImage");

		// this.afterImagePass = globals.phaserScene.cameras.main.postPipelines[globals.phaserScene.cameras.main.postPipelines.length - 1];
		// this.passes.push(this.afterImagePass);

		// damp && (this.afterImagePass.damp = damp);

		// this.afterImagePass.updateValues = (dt) => {
		// 	this.afterImagePass.damp = dt.damp;
		// };
	}

	// /////FILM SHADER
	initFilmShader(nIntensity, sIntensity, sCount, grayscale) {
		this.filmPass = new FilmShader();
		this.filmPass.nIntensity = nIntensity;
		this.filmPass.sIntensity = sIntensity;
		this.filmPass.sCount = sCount;
		this.filmPass.grayscale = grayscale;

		this.scene.filters = this.scene.filters || [];
		this.scene.filters.push(this.filmPass);

		this.filmPass.updateValues = (dt) => {
			this.filmPass.nIntensity = dt.nIntensity;
		};
	}

	// /////PIXELATE
	initPixelate(pixelSize) {
		this.pixelatePass = new PixelShader();
		this.pixelatePass.pixelSize = pixelSize;

		this.scene.filters = this.scene.filters || [];
		this.scene.filters.push(this.pixelatePass);

		this.pixelatePass.updateValues = (dt) => {
			this.pixelatePass.pixelSize = dt.pixelSize;
		};
	}

	// /////HUE SATURATION
	initColorEdit(hue, saturation) {
		this.colorEditPass = new HueSaturationShader();
		this.colorEditPass.hue = hue;
		this.colorEditPass.saturation = saturation;

		this.colorEditPass.updateValues = (dt) => {
			this.colorEditPass.hue = dt.hue;
			this.colorEditPass.saturation = dt.saturation;
		};

		this.scene.filters = this.scene.filters || [];
		this.scene.filters.push(this.colorEditPass);
	}

	// /////VIGNETTE
	initVignette(offset, color, animateSpeed, animateRatio) {
		this.vignettePass = new VignetteShader();
		this.vignettePass.offset = offset;
		this.vignettePass.color = color;
		this.vignettePass.animateSpeed = animateSpeed * 0.1;
		this.vignettePass.animateRatio = animateRatio;

		this.vignettePass.updateValues = (dt) => {
			this.vignettePass.offset = dt.offset;
			this.vignettePass.color = dt.color;
			this.vignettePass.animateSpeed = dt.animateSpeed * 0.1;
			this.vignettePass.animateRatio = dt.animateRatio;
		};

		this.scene.filters = this.scene.filters || [];
		this.scene.filters.push(this.vignettePass);
	}

	// }
	/////TOON SHADER
	initToonShader(outlineColor, edgeSens = 0.5) {
		let toonPass = new ToonShader();
		this.toonPass = toonPass;
		this.toonPass.outlineColor = outlineColor;
		this.toonPass.edgeSens = edgeSens;

		this.scene.filters = this.scene.filters || [];
		this.scene.filters.push(this.toonPass);
		this.toonPass.updateValues = (dt) => {
			this.toonPass.outlineColor = dt.outlineColor;
			this.toonPass.edgeSens = dt.edgeSens;
		};
	}

	// render() {
	// 	this.composer.render();
	// }

	update(time, delta) {
		this.time += delta;

		if (this.filmPass) {
			this.filmPass.time = this.time;
			// this.filmPass.material.uniforms.time.value = this.time;
		}

		if (this.vignettePass) {
			this.vignettePass.time = this.time;
			// this.vignettePass.material.uniforms.time.value = this.time;
		}
	}

	resize(w, h) {
		if (this.toonPass) {
			this.toonPass.uRes = { x: w, y: h };
		}
		if (this.pixelatePass) {
			this.pixelatePass.uRes = { x: w, y: h };
		}
		// if(!this.composer)return;
		// this.composer.setSize(w, h);
		// if(this.toonPass){
		// 	this.toonPass.resolution = {x: w, y: h};
		//     this.toonShader.uniforms[ 'resolution' ].value.x = w;
		//     this.toonShader.uniforms[ 'resolution' ].value.y = h;
		// }
		// if(this.sobelShader){
		//     this.sobelShader.uniforms[ 'resolution' ].value.x = w;
		//     this.sobelShader.uniforms[ 'resolution' ].value.y = h;
		// }
		// if(this.pixelatePass){
		//     this.pixelatePass.uniforms[ 'resolution' ].value.x = w;
		//     this.pixelatePass.uniforms[ 'resolution' ].value.y = h;
		// }
		// if(this.fxaaPass){
		//     this.fxaaPass.material.uniforms[ 'resolution' ].value.x = 1/w;
		//     this.fxaaPass.material.uniforms[ 'resolution' ].value.y = 1/h;
		// }
		// if(this.ssaoPass){
		//     this.ssaoPass.width = w;
		//     this.ssaoPass.height = h;
		// }
		// if(this.nodepost){
		// 	this.nodepost.setSize(w, h);
		// }
	}
}

export default PostProcessing;
