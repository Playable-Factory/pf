import { Vector2 } from "three";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { Pass } from "three/examples/jsm/postprocessing/Pass.js";

import { CopyShader } from "three/examples/jsm/shaders/CopyShader.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";
import { LuminosityShader } from "three/examples/jsm/shaders/LuminosityShader.js";
import { SobelOperatorShader } from "three/examples/jsm/shaders/SobelOperatorShader.js";
// import { PixelShader } from 'three/examples/jsm/shaders/PixelShader.js';
import { PixelShader } from "./PixelShader";
import { FilmShader } from "three/examples/jsm/shaders/FilmShader.js";
import { HueSaturationShader } from "three/examples/jsm/shaders/HueSaturationShader.js";
import { BokehShader } from "three/examples/jsm/shaders/BokehShader.js";

import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { SSAOPass } from "three/examples/jsm/postprocessing/SSAOPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { AfterimagePass } from "three/examples/jsm/postprocessing/AfterimagePass.js";
import { BokehPass } from "three/examples/jsm/postprocessing/BokehPass.js";

// import {ToonShader} from './toon_shader/toon_shader';
import { ToonShader2 } from "./toon_shader/toon_shader2";
import { VignetteShader } from "./vignette_colored";
// import { OutlinePass } from './outline_pass';
// import { MotionBlurPass } from './motion_blur/MotionBlurPass';

import { RGBAFormat, DataTexture, LinearFilter, NearestFilter, Color } from "three";

// import * as Nodes from 'three/examples/jsm/nodes/Nodes.js';
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader";
import globals from "../../../../../globals";
import { OutlinePass } from "./outline_pass";

// #if process.pfData.enableEffekseer
import EffekHelper from "../effek_1.7/effekHelper";
// #endif

let data, main;
class PostProcessing {
	constructor() {
		data = app.data;
		main = app.main;

		prepareLutTextures();
	}

	init() {
		data = app.data;
		main = app.main;

		let composer = new EffectComposer(main.renderer);
		this.composer = composer;
		const renderPass = new RenderPass(main.scene, app.main.camera);
		renderPass.name = "render";
		composer.addPass(renderPass);

		// #if process.pfData.enableEffekseer
		const effekseerPass = new EffekseerRenderPass(main.scene, main.camera, EffekHelper.context);
		effekseerPass.name = "effekseer";
		composer.addPass(effekseerPass);
		// #endif

		let gammaCorrectionPass = new ShaderPass(GammaCorrectionShader);
		gammaCorrectionPass.name = "gamma";
		composer.addPass(gammaCorrectionPass);

		// #if process.pfData.enableEffekseer
		//	gammaCorrectionPass.needsSwap = false;
		// #endif

		if (data.enableOutline) {
			this.initOutline();
		}

		let ppData = data.pfPostprocessData;

		function findPass(name) {
			return composer.passes.find((a) => a.name == name);
		}

		window.pfUpdatePostProcessValues = (newData) => {
			this.enabled = newData.enable;

			for (let prop in newData) {
				let dt = newData[prop];
				if (!dt || dt.enable === undefined) continue;

				if (prop == "general") {
					app.ambientLight.intensity = dt.ambientIntensity;
					app.dirLight.intensity = dt.dirIntensity;
					app.stopUpdate = dt.pauseGame;
					continue;
				}

				let pass = findPass(prop);
				if (!pass) continue;
				pass.enabled = dt.enable;
				pass.updateValues && pass.updateValues(dt);
			}
		};

		if (!ppData) {
			return;
		}

		app.composer = composer;

		this.time = 0;

		let gearboxMode = ppData.gearboxMode;
		let toonData = ppData.toon;
		// let toonData2 = ppData.toon2;
		let lutData = ppData.lut;
		let unrealBloomData = ppData.unreal_bloom;
		let vignetteData = ppData.vignette;
		let colorData = ppData.colorEdit;
		let pixelateData = ppData.pixelate;
		let filmData = ppData.film;
		let afterImageData = ppData.afterImage;
		let bokehPassData = ppData.bokeh;
		let motionPassData = ppData.motionBlur;

		ppData.grayscale = ppData.grayscale || {};

		let grayscaleEnabled = ppData.grayscale.enable || ppData.lut.enable;

		this.enabled = ppData.enable;

		// ///TOON SHADER - 2
		// if(toonData2.enable || gearboxMode){
		// 	this.initToonShader2(new Color(toonData2.outlineColor), toonData2.edgeSens);
		// }

		///GRAYSCALE SHADER
		if (grayscaleEnabled || gearboxMode) {
			// this.initGrayscaleShader();
		}

		///LUT SHADER
		if (lutData.enable || gearboxMode) {
			this.initLUT(lutData.texName, lutData.lutPower);
		}

		///COLOR EDIT
		if (colorData.enable || gearboxMode) {
			this.initColorEdit(colorData.hue, colorData.saturation);
		}

		///PIXELATE SHADER
		if (pixelateData.enable || gearboxMode) {
			this.initPixelate(pixelateData.pixelSize);
		}

		///UNREAL BLOOM SHADER
		if (unrealBloomData.enable || gearboxMode) {
			this.initBloom(unrealBloomData.exposure, unrealBloomData.bloomStrength, unrealBloomData.bloomThreshold, unrealBloomData.bloomRadius);
		}

		///TOON SHADER
		if (toonData.enable || gearboxMode) {
			this.initToonShader(new Color(toonData.outlineColor), toonData.edgeSens);
		}

		///FILM SHADER
		if (filmData.enable || gearboxMode) {
			this.initFilmShader(filmData.nIntensity, filmData.sIntensity, filmData.sCount, filmData.grayscale);
		}

		///AFTER IMAGE
		if (afterImageData.enable || gearboxMode) {
			this.initAfterImagePass(afterImageData.damp);
		}

		///VIGNETTE SHADER
		if (vignetteData.enable || gearboxMode) {
			this.initVignette(vignetteData.offset, vignetteData.color, vignetteData.animateSpeed, vignetteData.animateRatio);
		}

		if (ppData.fxaa.enable || gearboxMode) {
			this.initFXAA();
		}

		////MOTION BLUR
		// if(motionPassData.enable || gearboxMode){
		// 	this.initMotionPass(motionPassData.smearIntensity);
		// }

		// ////BOKEH PASS
		// if(bokehPassData.enable || gearboxMode){
		// 	this.initBokeh(bokehPassData.focus, bokehPassData.aperture, bokehPassData.maxblur);
		// }

		if (gearboxMode) {
			for (let pass of composer.passes) {
				if (pass.name == "render" || pass.name == "lut_nearest" || pass.name == "gamma" || pass.name == "effekseer") continue;
				let passData = ppData[pass.name];
				if (!passData) continue;
				pass.enabled = passData.enable || false;
			}
		}

		// let asd = new ShaderPass(BokehShader);
		// asd.material.uniforms.tColor = main.storage.getItem('texture', 'sea');
		// asd.material.uniforms.tDepth = main.storage.getItem('texture', 'sea');

		// let outlinePass = new OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), main.scene, main.camera );
		// composer.addPass( outlinePass );
		// this.outlinePass = outlinePass;
		// // this.initSSAO();

		// setTimeout(()=>{
		//   let list = [];
		//   main.scene.traverse(child=>{
		//     if(child.material){
		//       list.push(child);
		//     }
		//   });
		//   outlinePass.selectedObjects = list;
		// }, 2000);
	}

	///MOTION BLUR
	initMotionPass(smearIntensity) {
		const motionPass = new MotionBlurPass(main.scene, main.camera, {
			samples: 7,
			expandGeometry: 0,
			interpolateGeometry: 1,
			// How intensely to blur the models
			smearIntensity,
			// Whether or not to blur transparent objects
			blurTransparent: false,
			// Whether or not to account for camera motion in the blur
			renderCameraBlur: true,
		});

		this.composer.addPass(motionPass);

		motionPass.name = "motionBlur";
	}

	///BOKEH
	initBokeh(focus, aperture, maxblur) {
		const bokehPass = new BokehPass(main.scene, main.camera, {
			focus: 1.0,
			aperture: 0.001,
			maxblur: 0.01,

			width: app.canvasWidth,
			height: app.canvasHeight,
		});

		this.composer.addPass(bokehPass);

		bokehPass.name = "bokeh";

		return;
		const bokehPass2 = new BokehPass(main.scene, main.camera, {
			focus: 1,
			aperture: 1,
			maxblur: 0.1,

			width: app.canvasWidth,
			height: app.canvasHeight,
		});

		this.composer.addPass(bokehPass);

		this.bokehPass = bokehPass;

		bokehPass.name = "unreal_bloom";

		bokehPass.updateValues = (dt) => {
			bokehPass.uniforms.focus.value = dt.focus;
			bokehPass.uniforms.focus.aperture = dt.aperture;
			bokehPass.uniforms.focus.maxblur = dt.maxblur;
		};
	}

	/////LUT
	initLUT(name, lutPower) {
		const lutShader = {
			uniforms: {
				tDiffuse: { value: null },
				lutMap: { value: null },
				lutMapSize: { value: 1 },
				lutPower: { value: lutPower },
			},
			vertexShader: `
              varying vec2 vUv;
              void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
              }
            `,
			fragmentShader: `
              #include <common>
        
              #define FILTER_LUT true
        
              uniform sampler2D tDiffuse;
              uniform sampler2D lutMap;
              uniform float lutMapSize;
              uniform float lutPower;
        
              varying vec2 vUv;
        
              vec4 sampleAs3DTexture(sampler2D tex, vec3 texCoord, float size) {
                float sliceSize = 1.0 / size;                  // space of 1 slice
                float slicePixelSize = sliceSize / size;       // space of 1 pixel
                float width = size - 1.0;
                float sliceInnerSize = slicePixelSize * width; // space of size pixels
                float zSlice0 = floor( texCoord.z * width);
                float zSlice1 = min( zSlice0 + 1.0, width);
                float xOffset = slicePixelSize * 0.5 + texCoord.x * sliceInnerSize;
                float yRange = (texCoord.y * width + 0.5) / size;
                float s0 = xOffset + (zSlice0 * sliceSize);
        
                #ifdef FILTER_LUT
        
                  float s1 = xOffset + (zSlice1 * sliceSize);
                  vec4 slice0Color = texture2D(tex, vec2(s0, yRange));
                  vec4 slice1Color = texture2D(tex, vec2(s1, yRange));
                  float zOffset = mod(texCoord.z * width, 1.0);
                  return mix(slice0Color, slice1Color, zOffset);
        
                #else
        
                  return texture2D(tex, vec2( s0, yRange));
        
                #endif
              }
        
              void main() {
                vec4 originalColor = texture2D(tDiffuse, vUv);
                vec4 luttedColor = sampleAs3DTexture(lutMap, originalColor.xyz, lutMapSize);
                gl_FragColor = mix(originalColor, luttedColor, lutPower);
                // gl_FragColor = sampleAs3DTexture(lutMap, originalColor.xyz, lutMapSize);
              }
            `,
		};

		const lutNearestShader = {
			uniforms: { ...lutShader.uniforms },
			vertexShader: lutShader.vertexShader,
			fragmentShader: lutShader.fragmentShader.replace("#define FILTER_LUT", "//"),
		};

		const effectLUT = new ShaderPass(lutShader);
		effectLUT.renderToScreen = true;
		const effectLUTNearest = new ShaderPass(lutNearestShader);
		effectLUTNearest.renderToScreen = true;

		this.composer.addPass(effectLUT);
		this.composer.addPass(effectLUTNearest);

		let lutInfo = lutTextures["def"];

		const effect = lutInfo.filter ? effectLUT : effectLUTNearest;
		effectLUT.enabled = lutInfo.filter;
		effectLUTNearest.enabled = !lutInfo.filter;

		const lutTexture = lutInfo.texture;
		effect.uniforms.lutMap.value = lutTexture;
		effect.uniforms.lutMapSize.value = lutInfo.size;

		effectLUT.name = "lut";
		effectLUTNearest.name = "lut_nearest";

		effectLUT.updateValues = (dt) => {
			// effect.uniforms.lutMap.value = lutTextures[dt.texName].texture;
			effect.uniforms.lutPower.value = dt.lutPower;

			prepareLutTexture(dt.texture, (texture) => {
				effect.uniforms.lutMap.value = texture;
			});
			// vignettePass.material.uniforms[ 'offset' ].value = dt.offset;
			// vignettePass.material.uniforms[ 'darkness' ].value = dt.darkness;
		};
	}

	/////BLOOM
	initBloom(exposure = 1, bloomStrength = 0.25, bloomThreshold = 0, bloomRadius = 0) {
		const params = {
			exposure,
			bloomStrength,
			bloomThreshold,
			bloomRadius,
		};

		const bloomPass = new UnrealBloomPass(new Vector2(app.w, app.h), 1.5, 0.4, 0.85);
		bloomPass.exposure = params.exposure;
		bloomPass.threshold = params.bloomThreshold;
		bloomPass.strength = params.bloomStrength;
		bloomPass.radius = params.bloomRadius;

		this.bloomPass = bloomPass;

		this.composer.addPass(bloomPass);

		bloomPass.name = "unreal_bloom";

		bloomPass.updateValues = (dt) => {
			bloomPass.exposure = dt.exposure;
			bloomPass.threshold = dt.bloomThreshold;
			bloomPass.strength = dt.bloomStrength;
			bloomPass.radius = dt.bloomRadius;
		};
	}

	/////SSAO
	initSSAO() {
		let width = app.canvasWidth || window.innerWidth;
		let height = app.canvasHeight || window.innerHeight;
		const ssaoPass = new SSAOPass(main.scene, main.camera, width, height);
		ssaoPass.kernelRadius = 16;
		ssaoPass.minDistance = 0.0001;
		ssaoPass.maxDistance = 100;

		this.ssaoPass = ssaoPass;

		// ssaoPass.output = parseInt( SSAOPass.OUTPUT.SSAO );

		this.composer.addPass(ssaoPass);

		ssaoPass.name = "ssao";
	}

	/////FXAA
	initFXAA() {
		let fxaaPass = new ShaderPass(FXAAShader);
		this.composer.addPass(fxaaPass);

		this.fxaaPass = fxaaPass;
		fxaaPass.name = "fxaa";
	}

	/////AFTER IMAGE
	initAfterImagePass(damp) {
		let afterImagePass = new AfterimagePass();
		afterImagePass.shader.uniforms.damp.value = damp;

		this.composer.addPass(afterImagePass);
		this.afterImagePass = afterImagePass;

		afterImagePass.name = "afterImage";

		afterImagePass.updateValues = (dt) => {
			afterImagePass.shader.uniforms.damp.value = dt.damp;
		};
	}

	/////FILM SHADER
	initFilmShader(nIntensity, sIntensity, sCount, grayscale) {
		let filmPass = new ShaderPass(FilmShader);

		filmPass.material.uniforms["nIntensity"].value = nIntensity;
		filmPass.material.uniforms["sIntensity"].value = 0;
		filmPass.material.uniforms["sCount"].value = 0.5;
		filmPass.material.uniforms["grayscale"].value = 0.9;

		this.composer.addPass(filmPass);

		this.filmPass = filmPass;

		filmPass.name = "film";

		filmPass.updateValues = (dt) => {
			filmPass.material.uniforms["nIntensity"].value = dt.nIntensity;
			// filmPass.material.uniforms[ 'sIntensity' ].value = dt.sIntensity;
			// filmPass.material.uniforms[ 'sCount' ].value = dt.sCount;
			// filmPass.material.uniforms[ 'grayscale' ].value = dt.grayscale;
		};
	}

	/////PIXELATE
	initPixelate(pixelSize) {
		let pixelatePass = new ShaderPass(PixelShader);

		pixelatePass.material.uniforms["resolution"].value = new Vector2(1000, 1000);
		pixelatePass.material.uniforms["pixelSize"].value = pixelSize;

		this.composer.addPass(pixelatePass);
		this.pixelatePass = pixelatePass;
		pixelatePass.name = "pixelate";

		pixelatePass.updateValues = (dt) => {
			pixelatePass.material.uniforms["pixelSize"].value = dt.pixelSize;
		};
	}

	/////HUE SATURATION
	initColorEdit(hue, saturation) {
		let hueSaturationPass = new ShaderPass(HueSaturationShader);

		hueSaturationPass.material.uniforms["hue"].value = hue;
		hueSaturationPass.material.uniforms["saturation"].value = saturation;

		this.composer.addPass(hueSaturationPass);
		this.hueSaturationPass = hueSaturationPass;
		hueSaturationPass.name = "colorEdit";

		hueSaturationPass.updateValues = (dt) => {
			hueSaturationPass.material.uniforms["hue"].value = dt.hue;
			hueSaturationPass.material.uniforms["saturation"].value = dt.saturation;
		};
	}

	/////VIGNETTE
	initVignette(offset, color, animateSpeed, animateRatio) {
		let vignettePass = new ShaderPass(VignetteShader);

		vignettePass.material.uniforms["offset"].value = offset;
		vignettePass.material.uniforms["color"].value.set(color);
		vignettePass.material.uniforms["animateSpeed"].value = animateSpeed;
		vignettePass.material.uniforms["animateRatio"].value = animateRatio;

		this.composer.addPass(vignettePass);
		this.vignettePass = vignettePass;
		vignettePass.name = "vignette";

		vignettePass.updateValues = (dt) => {
			vignettePass.material.uniforms["offset"].value = dt.offset;
			vignettePass.material.uniforms["color"].value.set(dt.color);
			vignettePass.material.uniforms["animateSpeed"].value = dt.animateSpeed;
			vignettePass.material.uniforms["animateRatio"].value = dt.animateRatio;
		};
	}

	/////SOBEL
	initSobelShader() {
		let sobelShader = new ShaderPass(SobelOperatorShader);
		this.composer.addPass(sobelShader);

		this.sobelShader = sobelShader;

		sobelShader.name = "sobel";
	}

	/////GRAYSCALE
	initGrayscaleShader() {
		let grayShader = new ShaderPass(LuminosityShader);
		this.composer.addPass(grayShader);

		grayShader.name = "grayscale";
	}

	/////TOON SHADER - OLD
	// initToonShader2(outlineColor, edgeSens = 0.5, magnitude = 0.5){
	//     let toonShader = new ShaderPass( ToonShader );
	//     this.composer.addPass(toonShader);

	//     this.toonShader = toonShader;

	//     outlineColor && toonShader.uniforms.outlineColor.value.copy(outlineColor);
	//     toonShader.uniforms.edgeSens.value = edgeSens;
	//     toonShader.uniforms.magnitude.value = magnitude;

	// 	toonShader.name = 'toon';

	// 	toonShader.updateValues = (dt) => {
	// 		toonShader.uniforms.outlineColor.value.set(dt.outlineColor);
	// 		toonShader.uniforms.edgeSens.value = dt.edgeSens;
	// 		toonShader.uniforms.magnitude.value = dt.magnitude;
	// 	}

	// }
	/////TOON SHADER
	initToonShader(outlineColor, edgeSens = 0.5) {
		let toonShader = new ShaderPass(ToonShader2);
		this.composer.addPass(toonShader);

		this.toonShader2 = toonShader;

		outlineColor && toonShader.uniforms.outlineColor.value.copy(outlineColor);
		toonShader.uniforms.edgeSens.value = edgeSens;

		toonShader.name = "toon";

		toonShader.updateValues = (dt) => {
			toonShader.uniforms.outlineColor.value.set(dt.outlineColor);
			toonShader.uniforms.edgeSens.value = dt.edgeSens;
		};
	}

	initOutline() {
		let outlinedObjects = [];
		// let params = {
		//   edgeStrength: 10.0,
		//   edgeGlow: 0.0,
		//   edgeThickness: 10.0,
		//   pulsePeriod: 0,
		//   visibleEdgeColor: "#ff0000",
		//   hiddenEdgeColor: "#ff0000",
		// };
		let outlinePass = new OutlinePass(new Vector2(1000, 1000), globals.threeScene, globals.threeCamera, outlinedObjects);
		globals.outlinePass = outlinePass;
		outlinePass.visibleEdgeColor.set("#000000");
		outlinePass.hiddenEdgeColor.set("#FFFFFF");
		outlinePass.edgeThickness = 0.1;
		outlinePass.edgeStrength = 10;
		outlinePass.edgeGlow = 0;
		outlinePass.pulsePeriod = 0;
		outlinePass.name = "outline";

		this.composer.addPass(outlinePass);
	}

	render() {
		this.composer.render();

		//this.nodepost.render(main.scene, main.camera, this.frame);
	}

	update(ratio, delta) {
		this.time += delta;

		if (this.filmPass) {
			this.filmPass.material.uniforms.time.value = this.time;
		}

		if (this.vignettePass) {
			this.vignettePass.material.uniforms.time.value = this.time;
		}
	}

	resize(w, h) {
		if (!this.composer) return;
		this.composer.setSize(w, h);

		if (this.toonShader) {
			this.toonShader.uniforms["resolution"].value.x = w;
			this.toonShader.uniforms["resolution"].value.y = h;
		}
		if (this.toonShader2) {
			this.toonShader2.uniforms["resolution"].value.x = w;
			this.toonShader2.uniforms["resolution"].value.y = h;
		}

		if (this.sobelShader) {
			this.sobelShader.uniforms["resolution"].value.x = w;
			this.sobelShader.uniforms["resolution"].value.y = h;
		}

		if (this.pixelatePass) {
			this.pixelatePass.uniforms["resolution"].value.x = w;
			this.pixelatePass.uniforms["resolution"].value.y = h;
		}

		if (this.fxaaPass) {
			this.fxaaPass.material.uniforms["resolution"].value.x = 1 / w;
			this.fxaaPass.material.uniforms["resolution"].value.y = 1 / h;
		}

		if (this.ssaoPass) {
			this.ssaoPass.width = w;
			this.ssaoPass.height = h;
		}

		if (this.nodepost) {
			this.nodepost.setSize(w, h);
		}
	}

	initNodePost() {
		let screen = new Nodes.ScreenNode();

		const hue = new Nodes.FloatNode();
		const sataturation = new Nodes.FloatNode(1);
		const vibrance = new Nodes.FloatNode();
		const brightness = new Nodes.FloatNode(0);
		const contrast = new Nodes.FloatNode(1);

		const hueNode = new Nodes.ColorAdjustmentNode(screen, hue, Nodes.ColorAdjustmentNode.HUE);
		const satNode = new Nodes.ColorAdjustmentNode(hueNode, sataturation, Nodes.ColorAdjustmentNode.SATURATION);
		const vibranceNode = new Nodes.ColorAdjustmentNode(satNode, vibrance, Nodes.ColorAdjustmentNode.VIBRANCE);
		const brightnessNode = new Nodes.ColorAdjustmentNode(vibranceNode, brightness, Nodes.ColorAdjustmentNode.BRIGHTNESS);
		const contrastNode = new Nodes.ColorAdjustmentNode(brightnessNode, contrast, Nodes.ColorAdjustmentNode.CONTRAST);

		let nodepost = new Nodes.NodePostProcessing(main.renderer);
		nodepost.output = contrastNode;

		this.nodepost = nodepost;
		this.frame = new Nodes.NodeFrame();
	}
}

export default PostProcessing;

class EffekseerRenderPass extends Pass {
	constructor(scene, camera, context) {
		super();
		this.scene = scene;
		this.camera = camera;
		this.context = context;
		this.needsSwap = false;
	}
	render(renderer, writeBuffer, readBuffer /*, deltaTime, maskActive */) {
		renderer.setRenderTarget(this.renderToScreen ? null : readBuffer);
		this.context.setProjectionMatrix(app.main.camera.projectionMatrix.elements);
		this.context.setCameraMatrix(app.main.camera.matrixWorldInverse.elements);
		this.context.draw();
	}
}

const makeIdentityLutTexture = (function () {
	const identityLUT = new Uint8Array([
		0,
		0,
		0,
		255, // black
		255,
		0,
		0,
		255, // red
		0,
		0,
		255,
		255, // blue
		255,
		0,
		255,
		255, // magenta
		0,
		255,
		0,
		255, // green
		255,
		255,
		0,
		255, // yellow
		0,
		255,
		255,
		255, // cyan
		255,
		255,
		255,
		255, // white
	]);

	return function (filter) {
		const texture = new DataTexture(identityLUT, 4, 2, RGBAFormat);
		texture.minFilter = filter;
		texture.magFilter = filter;
		texture.needsUpdate = true;
		texture.flipY = false;
		return texture;
	};
})();

const ctx = document.createElement("canvas").getContext("2d");

let lutTextures = {};

function prepareLutTexture(base64, callback) {
	let img = new Image();

	let info = {
		filter: true,
		img,
		name: "asd",
		size: 8,
	};

	const texture = makeIdentityLutTexture(info.filter ? LinearFilter : NearestFilter);

	img.onload = () => {
		const lutSize = info.size;
		const width = lutSize * lutSize;
		const height = lutSize;
		info.size = lutSize;
		ctx.canvas.width = width;
		ctx.canvas.height = height;
		ctx.drawImage(img, 0, 0);
		const imageData = ctx.getImageData(0, 0, width, height);

		texture.image.data = new Uint8Array(imageData.data.buffer);
		texture.image.width = width;
		texture.image.height = height;
		texture.needsUpdate = true;

		info.texture = texture;

		callback(texture);
	};
	img.src = base64;
}

function prepareLutTextures() {
	let lutTexturesSrc = {
		def:
			app.data.pfPostprocessData.lut.texture ||
			"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAICAYAAABJYvnfAAAACXBIWXMAAAABAAAAAQBPJcTWAAAAJHpUWHRDcmVhdG9yAAAImXNMyU9KVXBMK0ktUnBNS0tNLikGAEF6Bs5qehXFAAABhUlEQVRIiY1VQZIDIQhkHaiK85vN5/c9yQscL9G57B4UBQaTPVkJLdjdwHz9xPhbNoIaEPisgaBs7fxOzxErgeDcEF6BoI74o+NNjo2gBIR7ekLp+CLyMo7z157f4tr9mU+fBPf0aPfEf7PGtX41OTBThDIeLoD9zHTrv0njAkLZENp9eU/iEA6KSkCLyxxf5Dj6+85FjgOjIm5xM66J85uQC1hlGWALVOPiqgDjWQDGW1y7b/NOghlvilAVJgwDTPfJs8Xx0qWjA7QAukWaA7tLvOE6QYc458kYXeJKIIc44xLtLvHRAUsBZv7ViJdAgOwAJ6wB4SXmOJN2YDrhO6DE3BCSInjFZTEiXg6uL7tI4pjgKd8tzDpUfileiyM7yDP9Xweswmq2zIx75MaIqR1xXYYH7W8Favf98WSB5m67ckB3RlwHRGs7Ba7ifXZALlmvfYu4P78Oup01QW+JmyVvxMREUWxO3wGPuHTAjsU7gexnNCmHNW4t0MSvBGBc4vhiSf4BdqMHFr4bgpcAAAAASUVORK5CYII=",
		// '01_duo_blue-red': require('./lut_textures/01_duo_blue-red.png'),
		// '02_red_night': require('./lut_textures/02_red_night.png'),
		// '03_old_times': require('./lut_textures/03_old_times.png'),
		// '04_teal_and_orange': require('./lut_textures/04_teal_and_orange.png'),
		// '05_duo_orange-blue': require('./lut_textures/05_duo_orange-blue.png'),
		// '06_duo_yellow-blue': require('./lut_textures/06_duo_yellow-blue.png'),
		// '07_night_vision': require('./lut_textures/07_night_vision.png'),
		// '10_sepia': require('./lut_textures/10_sepia.png'),
		// '15_bw_silvertone': require('./lut_textures/15_bw_silvertone.png'),
		// '16_alien_movie': require('./lut_textures/16_alien_movie.png'),
		// '19_napalm': require('./lut_textures/19_napalm.png'),
		// '20_oh_brother': require('./lut_textures/20_oh_brother.png'),
	};

	if (!lutTexturesSrc.def) return;

	for (let prop in lutTexturesSrc) {
		let img = new Image();

		let info = {
			filter: true,
			img,
			name: prop,
			size: 8,
		};

		lutTextures[prop] = info;

		const texture = makeIdentityLutTexture(info.filter ? LinearFilter : NearestFilter);

		img.onload = () => {
			const lutSize = info.size;
			const width = lutSize * lutSize;
			const height = lutSize;
			info.size = lutSize;
			ctx.canvas.width = width;
			ctx.canvas.height = height;
			ctx.drawImage(img, 0, 0);
			const imageData = ctx.getImageData(0, 0, width, height);

			texture.image.data = new Uint8Array(imageData.data.buffer);
			texture.image.width = width;
			texture.image.height = height;
			texture.needsUpdate = true;

			info.texture = texture;

			return;
			const identityLUT = new Uint8Array([
				0,
				0,
				0,
				255, // black
				255,
				0,
				0,
				255, // red
				0,
				0,
				255,
				255, // blue
				255,
				0,
				255,
				255, // magenta
				0,
				255,
				0,
				255, // green
				255,
				255,
				0,
				255, // yellow
				0,
				255,
				255,
				255, // cyan
				255,
				255,
				255,
				255, // white
			]);

			// const texture = new THREE.DataTexture(identityLUT, 4, 2, THREE.RGBAFormat);
			// texture.minFilter = THREE.LinearFilter;
			// texture.magFilter = THREE.LinearFilter;
			// texture.needsUpdate = true;
			// texture.flipY = false;

			info.texture = texture;
		};
		img.src = lutTexturesSrc[prop];
	}
}
