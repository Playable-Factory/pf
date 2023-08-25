import { gsap } from "gsap";
import { Assets } from "@pixi/assets";
import Text from "pf.js/src/2d/gameobjects/text";
import Graphics from "pf.js/src/2d/gameobjects/graphics";
import Sprite from "pf.js/src/2d/gameobjects/sprite";
import Container from "pf.js/src/2d/gameobjects/container";
import TilingSprite from "pf.js/src/2d/gameobjects/tilingSprite";

// const { Container, Graphics, Text, Sprite, Texture, TilingSprite, utils } = require("pixi.js-legacy");
// const TextureCache = utils.TextureCache;

class Banner extends Container {
	constructor(scene, data) {
		super();
		this.scene = scene;
		scene.addChild(this);
		this.zIndex = 1000;

		let config = {
			enable: data.bannerEnable,
			width: data.bannerWidthRatio,
			height: data.bannerHeightRatio,
			alpha: data.bannerAlpha,
			textAlpha: data.bannerTextAlpha,
			offsetY: data.bannerOffsetYRatio,
			borderRadius: data.bannerBorderRadius,

			bgType: data.bannerBgType,
			bgColor: data.bannerBgColor,
			bgGradientColorTop: data.bannerBgGradientColorTop,
			bgGradientColorBottom: data.bannerBgGradientColorBottom,
			bgImage: data.bannerBgImage,

			text: data.bannerText,
			textColor: data.bannerTextColor,
			textFont: data.bannerTextFont,
		};

		this.config = config;

		this.initBg(config);

		let text = new Text(config.text, {
			fontFamily: config.textFont,
			fontSize: 50,
			fill: config.textColor,
			align: "center",
		});
		text.baseWidth = text.width;
		text.baseHeight = text.height;
		text.anchor.set(0.5);
		this.addChild(text);
		this.text = text;

		this.bg.alpha = config.alpha;
		text.alpha = config.textAlpha;

		this.onResizeCallback = (w, h) => {
			let bg = this.bg;
			let bgW = w * config.width * 0.01;
			let bgH = h * config.height * 0.01;
			let borderRadius = bgH * config.borderRadius * 0.01;

			bg.redraw(bgW, bgH, borderRadius);

			let textScale = Math.min((bgW * 0.9) / text.baseWidth, (bgH * 0.8) / text.baseHeight);
			text.scale.set(textScale);
			text.y = bgH / 2;

			this.x = w / 2;
			this.y = h * config.offsetY * 0.01;
		};
		this.onResizeCallback(scene.lastWidth, scene.lastHeight);

		this.initEvents();
		this.visible = config.enable;
	}

	initEvents() {
		let scene = this.scene;
		let eventList = [
			{
				name: "bannerEnable",
				callback: (value) => {
					this.config.enable = value;
					this.visible = value;
				},
			},
			{
				name: "bannerWidthRatio",
				callback: (value) => {
					this.config.width = value;
					this.onResizeCallback(scene.lastWidth, scene.lastHeight);
				},
			},
			{
				name: "bannerHeightRatio",
				callback: (value) => {
					this.config.height = value;
					this.onResizeCallback(scene.lastWidth, scene.lastHeight);
				},
			},
			{
				name: "bannerOffsetYRatio",
				callback: (value) => {
					this.config.offsetY = value;
					this.onResizeCallback(scene.lastWidth, scene.lastHeight);
				},
			},
			{
				name: "bannerBorderRadius",
				callback: (value) => {
					this.config.borderRadius = value;
					this.onResizeCallback(scene.lastWidth, scene.lastHeight);
				},
			},
			{
				name: "bannerAlpha",
				callback: (value) => {
					this.config.alpha = value;
					this.bg.alpha = value;
				},
			},
			//BG RELATED
			{
				name: "bannerBgType",
				callback: (value) => {
					this.config.bgType = value;
					if (this.curBgType != value) {
						this.initBg(this.config);
					}
					this.onResizeCallback(scene.lastWidth, scene.lastHeight);
				},
			},
			{
				name: "bannerBgColor",
				callback: (value) => {
					this.config.bgColor = value;
					this.onResizeCallback(scene.lastWidth, scene.lastHeight);
				},
			},
			{
				name: "bannerBgGradientColorTop",
				callback: (value) => {
					this.config.bgGradientColorTop = value;
					this.onResizeCallback(scene.lastWidth, scene.lastHeight);
				},
			},
			{
				name: "bannerBgImage",
				callback: (value) => {
					this.config.bgImage = value;
					Assets.unload("bannerBgImage");
					Assets.add("bannerBgImage", value);
					Assets.load("bannerBgImage").then(() => {
						this.initBg(this.config);
						this.onResizeCallback(scene.lastWidth, scene.lastHeight);
					});
				},
			},
			///TEXT
			{
				name: "bannerText",
				callback: (value) => {
					let text = this.text;

					this.config.text = value;
					let tempScale = text.scale.x;
					text.scale.set(1);
					text.baseWidth = text.width;
					text.baseHeight = text.height;
					text.text = value;
					text.scale.set(tempScale);

					this.onResizeCallback(scene.lastWidth, scene.lastHeight);
				},
			},
			{
				name: "bannerTextColor",
				callback: (value) => {
					this.config.textColor = value;
					this.text.style.fill = value;
				},
			},
			{
				name: "bannerTextAlpha",
				callback: (value) => {
					this.config.textAlpha = value;
					this.text.alpha = value;
				},
			},
		];

		eventList.forEach((event) => {
			let name = "pf_" + event.name;
			window.addEventListener(name, (e) => {
				let value = e.detail.value;
				event.callback(value);
			});
		});
		// window.addEventListener("pf_bannerEnable", (e) => {
		// 	let originY = e.detail.value;

		// 	if (joystickHand) {
		// 		joystickHand.setOrigin(joystickHand.originX, originY);
		// 	}
		// });
	}

	initBg(config) {
		if (this.bg) {
			this.bg.destroy();
		}
		let bg;
		this.curBgType = config.bgType;

		if (config.bgType == 0) {
			bg = new Graphics();
			bg.redraw = (bgW, bgH, borderRadius) => {
				bg.clear();
				let color = Number(config.bgColor.replace("#", "0x"));
				bg.beginFill(color);
				bg.drawRoundedRect(0, 0, bgW, bgH, borderRadius);
				bg.endFill();
				bg.pivot.set(bgW / 2, 0);
			};
		} else if (config.bgType == 1) {
			const canvas = document.createElement("canvas");
			canvas.width = 256;
			canvas.height = 64;
			// document.body.appendChild(canvas);
			// canvas.style.zIndex = 99;

			const ctx = canvas.getContext("2d");
			bg = new Sprite(Texture.from(canvas));

			// use canvas2d API to create gradient
			bg.redraw = (bgW, bgH, borderRadius) => {
				bgH = bgH || 20;
				canvas.width = bgW;
				canvas.height = bgH;
				ctx.clearRect(0, 0, canvas.width, canvas.height);

				const grd = ctx.createLinearGradient(0, 0, 0, bgH);
				grd.addColorStop(0, config.bgGradientColorTop);
				grd.addColorStop(1, config.bgGradientColorBottom);

				ctx.fillStyle = grd;
				ctx.fillRect(0, 0, bgW, bgH);
				ctx.globalCompositeOperation = "destination-in";
				// ctx.fillRect(0, 0, bgW * 0.5, bgH);
				roundRect(ctx, 0, 0, bgW, bgH, borderRadius, true, false);
				bg.texture.update();
			};

			bg.anchor.set(0.5, 0);
		} else if (config.bgType == 2) {
			let texture = Assets.cache.has("bannerBgImage") ? Assets.get("bannerBgImage") : Texture.WHITE;

			bg = new TilingSprite(texture, 256, 256);
			bg.anchor.set(0.5, 0);

			let maskRect = new Graphics();
			this.addChild(maskRect);

			maskRect.isMask = true;
			bg.mask = maskRect;

			bg.redraw = (bgW, bgH, borderRadius) => {
				maskRect.clear();
				maskRect.beginFill(0xff0000);
				maskRect.drawRoundedRect(0, 0, bgW, bgH, borderRadius);
				maskRect.endFill();
				maskRect.pivot.set(bgW / 2, 0);

				bg.width = bgW;
				bg.height = bgH;
			};
		}

		this.addChild(bg);
		this.bg = bg;
		return bg;
	}

	show() {
		this.visible = true;
		this.alpha = 0;
		gsap.killTweensOf(this);
		gsap.to(this, { alpha: 1, duration: 0.5 });
	}

	hide(isQuick = false) {
		if (isQuick) {
			gsap.killTweensOf(this);
			this.visible = false;
			return;
		}
		gsap.killTweensOf(this);
		gsap.to(this, {
			alpha: 0,
			duration: 0.5,
			onComplete: () => {
				this.visible = false;
			},
		});
	}
}

export default Banner;

function roundRect(ctx, x, y, width, height, radius = 5, fill = false, stroke = true) {
	if (typeof radius === "number") {
		radius = { tl: radius, tr: radius, br: radius, bl: radius };
	} else {
		radius = { ...{ tl: 0, tr: 0, br: 0, bl: 0 }, ...radius };
	}
	ctx.beginPath();
	ctx.moveTo(x + radius.tl, y);
	ctx.lineTo(x + width - radius.tr, y);
	ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
	ctx.lineTo(x + width, y + height - radius.br);
	ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
	ctx.lineTo(x + radius.bl, y + height);
	ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
	ctx.lineTo(x, y + radius.tl);
	ctx.quadraticCurveTo(x, y, x + radius.tl, y);
	ctx.closePath();
	if (fill) {
		ctx.fill();
	}
	if (stroke) {
		ctx.stroke();
	}
}

// // Now you can just call
// var ctx = document.getElementById("rounded-rect").getContext("2d");
// // Draw using default border radius,
// // stroke it but no fill (function's default values)
// roundRect(ctx, 5, 5, 50, 50);
// // To change the color on the rectangle, just manipulate the context
// ctx.strokeStyle = "rgb(255, 0, 0)";
// ctx.fillStyle = "rgba(255, 255, 0, .5)";
// roundRect(ctx, 100, 5, 100, 100, 20, true);
// // Manipulate it again
// ctx.strokeStyle = "#0f0";
// ctx.fillStyle = "#ddd";
// // Different radii for each corner, others default to 0
