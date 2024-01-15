import gsap from "gsap";
import { Container, DisplayObject, Point, Sprite, Text, TextMetrics } from "pixi.js-legacy";
//import ResizeHelper from "../../../game/pixi/editor/helpers/resizeHelper";
import globals from "../../../globals";
// import { getProject, types } from "@theatre/core";
import sceneController from "../../../game/pixi/editor/sceneController";
import ResizeHelper from "../../../game/pixi/editor/helpers/resizeHelper";

export default class HelperPrototypes {
	constructor() {
		Container.prototype.calculateBounds = function () {
			this._bounds.clear();
			this._calculateBounds();
			for (var i = 0; i < this.children.length; i++) {
				var child = this.children[i];
				if (!child.visible || !child.renderable || child.exclude || child.constructor.name == "Particle") {
					continue;
				}
				child.calculateBounds();
				// TODO: filter+mask, need to mask both somehow
				if (child._mask) {
					var maskObject = child._mask.maskObject || child._mask;
					maskObject.calculateBounds();
					this._bounds.addBoundsMask(child._bounds, maskObject._bounds);
				} else if (child.filterArea) {
					this._bounds.addBoundsArea(child._bounds, child.filterArea);
				} else {
					this._bounds.addBounds(child._bounds);
				}
			}
			this._bounds.updateID = this._boundsID;
		};

		// override destroy prototype
		const tempDestroy = DisplayObject.prototype.destroy;
		DisplayObject.prototype.destroy = function (_options) {
			tempDestroy.call(this, _options);
			sceneController.removeObject(this);
		};

		// override texture prototype
		const tempTextureSetter = Object.getOwnPropertyDescriptor(Sprite.prototype, "texture").set;
		const newTextureSetter = function (value) {
			tempTextureSetter.call(this, value);

			if (this.data) {
				ResizeHelper.setBaseWidthHeight(this);
			}
			if (this.parent && this.parent.data && this.parent.data.type == "container") {
				ResizeHelper.recalculateContainerBounds(this.parent);
			}
		};
		Object.defineProperty(Sprite.prototype, "texture", {
			set: newTextureSetter,
		});

		// override updateText prototype
		const tempUpdateText = Text.prototype.updateText;
		Text.prototype.updateText = function (respectDirty) {
			if (!this.dirty && respectDirty) {
				return;
			}

			tempUpdateText.call(this, respectDirty);

			if (this.parent && this.parent.data && this.data && this.data.resizeData) {
				this.onResizeCallback(this.parent.lastWidth || this.parent.baseWidth, this.parent.lastHeight || this.parent.baseHeight);
			}
		};

		// // override updateText prototype
		// const tempTextSetter = Object.getOwnPropertyDescriptor(Text.prototype, "text").set;
		// const newTextSetter = function (value) {
		// 	tempTextSetter.call(this, value);
		// 	console.log("newTextSetter");
		// };
		// Object.defineProperty(Text.prototype, "text", {
		// 	set: newTextSetter,
		// });

		Object.defineProperty(DisplayObject.prototype, "dynamicTweens", {
			value: [],
			writable: false,
		});

		Object.defineProperty(DisplayObject.prototype, "dependencies", {
			value: [],
			writable: false,
		});

		// Object.defineProperty(DisplayObject.prototype, "baseWidth", {
		//     get: function () {
		//         if (this.data) {
		//             return ResizeHelper.setBaseWidthHeight(this).baseWidth;
		//         } else {
		//             return this.texture ? this.texture.orig.width : null;
		//         }
		//     },
		//     set: function (value) {
		//         this.width = value;
		//     }
		// });

		// Object.defineProperty(DisplayObject.prototype, "baseHeight", {
		//     get: function () {
		//         if (this.data) {
		//             return ResizeHelper.setBaseWidthHeight(this).baseHeight;
		//         } else {
		//             return this.texture ? this.texture.orig.height : null;
		//         }
		//     },
		//     set: function (value) {
		//         this.height = value;
		//     }
		// });

		DisplayObject.prototype.getSpace = function (leftObj, rightObj, topObj, botObj) {
			let lo;
			if (!leftObj || !leftObj.parent) {
				lo = {
					x: 0,
					width: 0,
					anchor: { x: 0 },
				};
			} else {
				lo = leftObj;
			}

			let ro;
			if (!rightObj || !rightObj.parent) {
				ro = {
					x: globals.pixiScene.lastWidth,
					width: 0,
					anchor: { x: 0 },
				};
			} else {
				ro = rightObj;
			}

			let to;
			if (!topObj || !topObj.parent) {
				to = {
					y: 0,
					height: 0,
					anchor: { y: 0 },
				};
			} else {
				to = topObj;
			}

			let bo;
			if (!botObj || !botObj.parent) {
				bo = {
					y: globals.pixiScene.lastHeight,
					height: 0,
					anchor: { y: 0 },
				};
			} else {
				bo = botObj;
			}

			this.space = {
				width: ro.x - ro.anchor.x * ro.width - (lo.x + (1 - lo.anchor.x) * lo.width),
				height: bo.y - bo.anchor.y * bo.height - (to.y + (1 - to.anchor.y) * to.height),
			};
			return this.space;
		};

		DisplayObject.prototype.getSize = function () {
			const size = {};
			if (this.style) {
				// text
				const metrics = TextMetrics.measureText(this.text, this.style);
				size.width = metrics.width;
				size.height = metrics.height;
			} else if (this.bounds) {
				// container
				size.width = this.bounds.width;
				size.height = this.bounds.height;
			} else if (this.skeleton) {
				// spine
				if (!this.skeleton.findSlot("bounds")) {
					throw new Error("No slot named 'bounds' found in skeleton");
				}
				var vertices = this.skeleton.findSlot("bounds").attachment.vertices;
				size = new PIXI.Rectangle(vertices[0], vertices[1], vertices[4] - vertices[0], vertices[5] - vertices[1]);
			} else if (this.textWidth) {
				// bitmap text
				this.updateTransform();
				size.width = this.textWidth;
				size.height = this.textHeight;
			} else {
				// image
				size.width = this.baseWidth;
				size.height = this.baseHeight;
			}

			return size;
		};

		DisplayObject.prototype.getScale = function (wRatio, hRatio, scaleType = "min", refObj = globals.pixiScene) {
			let width, height;

			if (refObj == globals.pixiScene) {
				width = globals.pixiScene.lastWidth;
				height = globals.pixiScene.lastHeight;
			} else {
				width = refObj.width;
				height = refObj.height;
			}

			const size = this.getSize();

			if (scaleType == "stretch") {
				return {
					x: (width * wRatio) / size.width,
					y: (height * hRatio) / size.height,
				};
			} else {
				return Math[scaleType == "max" ? "max" : "min"]((width * wRatio) / size.width, (height * hRatio) / size.height);
			}
		};

		DisplayObject.prototype.getX = function (obj, location, offset = 0, offsetRef = globals.pixiScene) {
			let offsetX = 0;
			if (!offsetRef.parent) {
				offsetX = offset * globals.pixiScene.lastWidth;
			} else {
				offsetX = offset * offsetRef.width;
			}

			let x = 0;
			if (location == "left") {
				x = obj.x - obj.anchor.x * obj.width - this.width * (1 - this.anchor.x);
			} else if (location == "right") {
				x = obj.x + (1 - obj.anchor.x) * obj.width + this.width * this.anchor.x;
			} else if (location == "center") {
				x = obj.x - (0.5 - obj.anchor.x) * obj.width;
			}

			x += offsetX;
			return x;
		};

		DisplayObject.prototype.getY = function (obj, location, offset = 0, offsetRef = globals.pixiScene) {
			let offsetY = 0;
			if (!offsetRef.parent) {
				offsetY = offset * globals.pixiScene.lastHeight;
			} else {
				offsetY = offset * offsetRef.height;
			}

			let y = 0;
			if (location == "top") {
				y = obj.y - obj.anchor.y * obj.height - this.height * (1 - this.anchor.y);
			} else if (location == "bottom") {
				y = obj.y + (1 - obj.anchor.y) * obj.height + this.height * this.anchor.y;
			} else if (location == "center") {
				y = obj.y + (0.5 - obj.anchor.y) * obj.height;
			}

			y += offsetY;
			return y;
		};

		DisplayObject.prototype.setInitials = function () {
			const size = this.getSize();
			this.base = {
				x: this.x,
				y: this.y,
				scale: {
					x: this.scale.x,
					y: this.scale.y,
				},
			};

			if (size && size.width) {
				this.base.width = size.width;
			}

			if (size && size.height) {
				this.base.height = size.height;
			}

			if (this._boundsRect) {
				// for container
				this.base.width = this._boundsRect.width;
				this.base.height = this._boundsRect.height;
			}

			this.base = {
				x: this.x,
				y: this.y,
				scale: {
					x: this.scale.x,
					y: this.scale.y,
				},
			};
		};

		// DisplayObject.prototype.onResizeCallback = function (w = globals.pixiScene.lastWidth, h = globals.pixiScene.lastHeight) {
		// 	if (!this.getResize) return;

		// 	if (this.dependencies.length) {
		// 		this.dependencies.forEach((d) => {
		// 			d.onResizeCallback(w, h);
		// 		});
		// 	}

		// 	const { x, y, scale } = this.getResize(w, h);
		// 	this.scale.set(scale.x ? scale.x : scale, scale.y ? scale.y : scale);

		// 	if (this._boundsRect) {
		// 		// for container
		// 		this.pivot.set((this.bounds.x + this.bounds.width + this.bounds.x) * 0.5, (this.bounds.y + this.bounds.height + this.bounds.y) * 0.5);
		// 	}

		// 	this.x = x;
		// 	this.y = y;
		// 	this.setInitials();
		// };

		DisplayObject.prototype.addTweens = function () {
			this.tweens = {
				play: (key, config) => {
					if (gsap.effects[this.data.uuid + "_" + key]) {
						gsap.effects[this.data.uuid + "_" + key](this, config);
					} else {
						console.warn("Animation " + key + " not found");
					}
				},
			};

			if (!this.data.tweenData || !this.data.tweenData.tweens) {
				return;
			}

			this.data.tweenData.tweens.forEach((anim) => {
				const defaultConfig = {};
				const positionConfig = {};
				const scaleConfig = {};
				const angleConfig = {};
				const tintConfig = {};
				const alphaConfig = {};

				for (let prop in anim.props) {
					let tweenData = anim.props[prop];
					//console.log(tweenData, "!!!!!");
					if (prop == "general") {
						defaultConfig.key = tweenData.key;
						defaultConfig.duration = tweenData.duration;
						defaultConfig.delay = tweenData.delay;
						defaultConfig.repeat = tweenData.repeat;
						defaultConfig.yoyo = tweenData.yoyo;
						defaultConfig.ease = tweenData.ease;
					} else if (prop == "position") {
						if (tweenData.type == "static") {
							positionConfig.getPos = () => {
								return {
									startX: tweenData.static.startX,
									endX: tweenData.static.endX,
									startY: tweenData.static.startY,
									endY: tweenData.static.endY,
								};
							};
							positionConfig.endX = () => positionConfig.getPos().endX;
							positionConfig.endY = () => positionConfig.getPos().endY;
							tweenData.static.enableStartX ? (positionConfig.startX = () => positionConfig.getPos().startX) : (positionConfig.startX = null);
							tweenData.static.enableStartY ? (positionConfig.startY = () => positionConfig.getPos().startY) : (positionConfig.startY = null);

							if (tweenData.static.enableX) {
								positionConfig.startX = positionConfig.startX;
								positionConfig.endX = positionConfig.endX;
							} else {
								positionConfig.startX = null;
								positionConfig.endX = null;
							}

							if (tweenData.static.enableY) {
								positionConfig.startY = positionConfig.startY;
								positionConfig.endY = positionConfig.endY;
							} else {
								positionConfig.startY = null;
								positionConfig.endY = null;
							}
						} else if (tweenData.type == "relative") {
							const refStartX = tweenData.relative.refStartX;
							const refEndX = tweenData.relative.refEndX;
							const refStartY = tweenData.relative.refStartY;
							const refEndY = tweenData.relative.refEndY;

							let fromObjStart = null;
							let fromObjEnd = null;

							const getPos = (ref) => {
								let fromObj, width, height;

								if (ref == "scene") {
									fromObj = pixiGlobals.viewport;
									width = pixiGlobals.viewport.worldWidth;
									height = pixiGlobals.viewport.worldHeight;
								} else if (ref == "parent") {
									fromObj = this.parent;
									if (this.parent) {
										if (this.parent == pixiGlobals.viewport) {
											width = pixiGlobals.viewport.worldWidth;
											height = pixiGlobals.viewport.worldHeight;
										} else {
											width = this.parent.data.baseWidth;
											height = this.parent.data.baseHeight;
										}
									}
								} else if (ref == "self") {
									fromObj = this;
									width = this.data.baseWidth;
									height = this.data.baseHeight;
								}

								return { fromObj, width, height };
							};

							positionConfig.getPos = () => {
								const { fromObj: fromObjStart, width: widthStart, height: heightStart } = getPos(refStartX);
								const { fromObj: fromObjEnd, width: widthEnd, height: heightEnd } = getPos(refEndX);
								const { fromObj: fromObjStartY, width: widthStartY, height: heightStartY } = getPos(refStartY);
								const { fromObj: fromObjEndY, width: widthEndY, height: heightEndY } = getPos(refEndY);

								let targetPos = {
									startX: null,
									endX: null,
									startY: null,
									endY: null,
								};

								if (tweenData.relative.enableStartX) {
									targetPos.startX = this.parent.toLocal(new Point(widthStart * tweenData.relative.startX, this.position.y), fromObjStart).x;
								}
								targetPos.endX = this.parent.toLocal(new Point(widthEnd * tweenData.relative.endX, this.position.y), fromObjEnd).x;

								if (tweenData.relative.enableStartY) {
									targetPos.startY = this.parent.toLocal(new Point(this.position.x, heightStartY * tweenData.relative.startY), fromObjStartY).y;
								}
								targetPos.endY = this.parent.toLocal(new Point(this.position.x, heightEndY * tweenData.relative.endY), fromObjEndY).y;
								return targetPos;
							};

							if (tweenData.relative.enableX) {
								positionConfig.startX = () => positionConfig.getPos().startX;
								positionConfig.endX = () => positionConfig.getPos().endX;
							} else {
								positionConfig.startX = null;
								positionConfig.endX = null;
							}

							if (tweenData.relative.enableY) {
								positionConfig.startY = () => positionConfig.getPos().startY;
								positionConfig.endY = () => positionConfig.getPos().endY;
							} else {
								positionConfig.startY = null;
								positionConfig.endY = null;
							}
						}
						if (tweenData.overrideGeneralProps) {
							positionConfig.duration = tweenData.duration;
							positionConfig.delay = tweenData.delay;
							positionConfig.repeat = tweenData.repeat;
							positionConfig.yoyo = tweenData.yoyo;
							positionConfig.ease = tweenData.ease;
						}
					} else if (prop == "scale") {
						if (tweenData.type == "static") {
							scaleConfig.getScale = () => {
								return {
									startX: tweenData.static.startX,
									endX: tweenData.static.endX,
									startY: tweenData.static.startY,
									endY: tweenData.static.endY,
								};
							};
							if (tweenData.static.enableStartX) {
								tweenData.static.enableX ? (scaleConfig.startX = () => scaleConfig.getScale().startX) : (scaleConfig.startX = null);
							}
							tweenData.static.enableX ? (scaleConfig.endX = () => scaleConfig.getScale().endX) : (scaleConfig.endX = null);

							if (tweenData.static.enableStartY) {
								tweenData.static.enableY ? (scaleConfig.startY = () => scaleConfig.getScale().startY) : (scaleConfig.startY = null);
							}
							tweenData.static.enableY ? (scaleConfig.endY = () => scaleConfig.getScale().endY) : (scaleConfig.endY = null);

							scaleConfig.scaleScalar = tweenData.static.scaleScalar;
						} else if (tweenData.type == "relative") {
							const refStartX = tweenData.relative.refStartX;
							const refEndX = tweenData.relative.refEndX;
							const refStartY = tweenData.relative.refStartY;
							const refEndY = tweenData.relative.refEndY;

							scaleConfig.refStartX = refStartX;
							scaleConfig.refEndX = refEndX;
							scaleConfig.refStartY = refStartY;
							scaleConfig.refEndY = refEndY;

							scaleConfig.getScale = (ref) => {
								let scale = {};

								let width = 0;
								let height = 0;
								let objGlobalScale = getGlobalScale(this);
								let parentGlobalScale;
								if (ref == "scene") {
									width = globals.pixiScene.lastWidth;
									height = globals.pixiScene.lastHeight;
									parentGlobalScale = getGlobalScale(globals.pixiScene);
								} else if (ref == "parent") {
									width = this.parent.data ? this.parent.data.baseWidth : globals.pixiScene.lastWidth;
									height = this.parent.data ? this.parent.data.baseHeight : globals.pixiScene.lastHeight;
									parentGlobalScale = getGlobalScale(this.parent);
								} else if (ref == "self") {
									width = this.data.baseWidth;
									height = this.data.baseHeight;
									parentGlobalScale = getGlobalScale(this);
								}

								let objSizeOnGlobal = {
									w: this.data.baseWidth * objGlobalScale.x,
									h: this.data.baseHeight * objGlobalScale.y,
								};

								let parentSizeOnGlobal = {
									w: width * parentGlobalScale.x,
									h: height * parentGlobalScale.y,
								};

								scale.startX = ((parentSizeOnGlobal.w * tweenData.relative.startX) / objSizeOnGlobal.w) * this.scale.x;
								scale.endX = ((parentSizeOnGlobal.w * tweenData.relative.endX) / objSizeOnGlobal.w) * this.scale.x;
								scale.startY = ((parentSizeOnGlobal.h * tweenData.relative.startY) / objSizeOnGlobal.h) * this.scale.y;
								scale.endY = ((parentSizeOnGlobal.h * tweenData.relative.endY) / objSizeOnGlobal.h) * this.scale.y;

								return scale;
							};

							if (tweenData.relative.enableStartX) {
								tweenData.relative.enableX ? (scaleConfig.startX = scaleConfig.getScale(refStartX).startX) : (scaleConfig.startX = null);
							}
							tweenData.relative.enableX ? (scaleConfig.endX = scaleConfig.getScale(refEndX).endX) : (scaleConfig.endX = null);

							if (tweenData.relative.enableStartY) {
								tweenData.relative.enableY ? (scaleConfig.startY = scaleConfig.getScale(refStartY).startY) : (scaleConfig.startY = null);
							}
							tweenData.relative.enableY ? (scaleConfig.endY = scaleConfig.getScale(refEndY).endY) : (scaleConfig.endY = null);

							scaleConfig.scaleScalar = tweenData.relative.scaleScalar;
						}

						if (tweenData.overrideGeneralProps) {
							scaleConfig.duration = tweenData.duration;
							scaleConfig.delay = tweenData.delay;
							scaleConfig.repeat = tweenData.repeat;
							scaleConfig.yoyo = tweenData.yoyo;
							scaleConfig.ease = tweenData.ease;
						}
					} else if (prop == "angle") {
						angleConfig.angle = tweenData.angle;

						if (tweenData.overrideGeneralProps) {
							angleConfig.duration = tweenData.duration;
							angleConfig.delay = tweenData.delay;
							angleConfig.repeat = tweenData.repeat;
							angleConfig.yoyo = tweenData.yoyo;
							angleConfig.ease = tweenData.ease;
						}
					} else if (prop == "tint") {
						tintConfig.tint = tweenData.tint;

						if (tweenData.overrideGeneralProps) {
							tintConfig.duration = tweenData.duration;
							tintConfig.delay = tweenData.delay;
							tintConfig.repeat = tweenData.repeat;
							tintConfig.yoyo = tweenData.yoyo;
							tintConfig.ease = tweenData.ease;
						}
					} else if (prop == "alpha") {
						alphaConfig.alpha = tweenData.alpha;

						if (tweenData.overrideGeneralProps) {
							alphaConfig.duration = tweenData.duration;
							alphaConfig.delay = tweenData.delay;
							alphaConfig.repeat = tweenData.repeat;
							alphaConfig.yoyo = tweenData.yoyo;
							alphaConfig.ease = tweenData.ease;
						}
					}
				}

				gsap.registerEffect({
					name: this.data.uuid + "_" + anim.props.general.key,
					effect: (targets, config) => {
						let hasPosStartX, hasPosStartY, hasScaleX, hasScaleY, hasAngle, hasTint, hasAlpha;

						const pixiConfigPosition = {};
						const pixiConfigScale = {};

						if (positionConfig.endX != null) {
							if (positionConfig.startX != null) {
								hasPosStartX = true;
							}
							pixiConfigPosition.x = () => positionConfig.endX();
						}

						if (positionConfig.endY != null) {
							if (positionConfig.startY != null) {
								hasPosStartY = true;
							}
							pixiConfigPosition.y = () => positionConfig.endY();
						}

						if (scaleConfig.endX != null) {
							hasScaleX = true;
							pixiConfigScale.scaleX = () => scaleConfig.endX();
						}

						if (scaleConfig.endY != null) {
							hasScaleY = true;
							pixiConfigScale.scaleY = () => scaleConfig.endY();
						}

						if (scaleConfig.endX != null && scaleConfig.endY != null) {
							delete pixiConfigScale.scaleX;
							delete pixiConfigScale.scaleY;
							if (scaleConfig.scaleScalar == "min") {
								pixiConfigScale.scale = () => Math.min(scaleConfig.endX(), scaleConfig.endY());
							} else if (scaleConfig.scaleScalar == "max") {
								pixiConfigScale.scale = () => Math.max(scaleConfig.endX(), scaleConfig.endY());
							} else if (scaleConfig.scaleScalar == "stretch") {
								pixiConfigScale.scaleX = () => scaleConfig.endX();
								pixiConfigScale.scaleY = () => scaleConfig.endY();
							}
						}

						let getStart = () => {
							let scale, position;

							if (hasPosStartX) {
								if (positionConfig.startX != null) {
									this.x = positionConfig.startX();
								} else {
									if (this.data.resizeData) {
										this.onResizeCallback(globals.pixiScene.lastWidth, globals.pixiScene.lastHeight);
									} else {
										this.x = this.data.position.x;
									}
								}
							}

							if (hasPosStartY) {
								if (positionConfig.startY != null) {
									this.y = positionConfig.startY();
								} else {
									if (this.data.resizeData) {
										this.onResizeCallback(globals.pixiScene.lastWidth, globals.pixiScene.lastHeight);
									} else {
										this.y = this.data.position.y;
									}
								}
							}

							if (hasScaleX) {
								if (scaleConfig.startX != null) {
									this.scale.x = scaleConfig.startX();
								} else {
									if (this.data.resizeData) {
										this.onResizeCallback(globals.pixiScene.lastWidth, globals.pixiScene.lastHeight);
									} else {
										this.scale.x = this.data.scale.x;
									}
								}
							}

							if (hasScaleY) {
								if (scaleConfig.startY != null) {
									this.scale.y = scaleConfig.startY();
								} else {
									if (this.data.resizeData) {
										this.onResizeCallback(globals.pixiScene.lastWidth, globals.pixiScene.lastHeight);
									} else {
										this.scale.y = this.data.scale.y;
									}
								}
							}

							if (hasAngle) {
								this.angle = this.data.angle;
							}

							if (hasTint) {
								this.tint = this.data.tint;
							}

							if (hasAlpha) {
								this.alpha = this.data.alpha;
							}
						};
						getStart();

						const tl = gsap.timeline({
							onComplete: () => {
								//this.updateData();
								tl.isCompleted = true;
								let ind = this.dynamicTweens.indexOf(tl);
								if (ind != -1) {
									this.dynamicTweens.splice(ind, 1);
								}

								config.onComplete && config.onComplete();
							},
						});
						tl.isCompleted = false;
						this.dynamicTweens.push(tl);
						tl.getStart = getStart;

						if (positionConfig.hasOwnProperty("endX") || positionConfig.hasOwnProperty("endY")) {
							tl.to(targets, {
								pixi: pixiConfigPosition,
								duration: positionConfig.duration != undefined ? positionConfig.duration : defaultConfig.duration,
								delay: positionConfig.delay != undefined ? positionConfig.delay : defaultConfig.delay,
								repeat: positionConfig.repeat != undefined ? positionConfig.repeat : defaultConfig.repeat,
								yoyo: positionConfig.yoyo != undefined ? positionConfig.yoyo : defaultConfig.yoyo,
								ease: positionConfig.ease != undefined ? positionConfig.ease : defaultConfig.ease,
							});
						}
						if (scaleConfig.hasOwnProperty("endX") || scaleConfig.hasOwnProperty("endY")) {
							tl.to(
								targets,
								{
									pixi: pixiConfigScale,
									duration: scaleConfig.duration != undefined ? scaleConfig.duration : defaultConfig.duration,
									delay: scaleConfig.delay != undefined ? scaleConfig.delay : defaultConfig.delay,
									repeat: scaleConfig.repeat != undefined ? scaleConfig.repeat : defaultConfig.repeat,
									yoyo: scaleConfig.yoyo != undefined ? scaleConfig.yoyo : defaultConfig.yoyo,
									ease: scaleConfig.ease != undefined ? scaleConfig.ease : defaultConfig.ease,
								},
								0
							);
						}
						if (angleConfig.hasOwnProperty("angle")) {
							hasAngle = true;
							tl.to(
								targets,
								{
									pixi: {
										angle: angleConfig.angle,
									},
									duration: angleConfig.duration != undefined ? angleConfig.duration : defaultConfig.duration,
									delay: angleConfig.delay != undefined ? angleConfig.delay : defaultConfig.delay,
									repeat: angleConfig.repeat != undefined ? angleConfig.repeat : defaultConfig.repeat,
									yoyo: angleConfig.yoyo != undefined ? angleConfig.yoyo : defaultConfig.yoyo,
									ease: angleConfig.ease != undefined ? angleConfig.ease : defaultConfig.ease,
								},
								0
							);
						}
						if (tintConfig.hasOwnProperty("tint")) {
							hasTint = true;
							tl.to(
								targets,
								{
									pixi: {
										tint: tintConfig.tint.replace("#", "0x"),
									},
									duration: tintConfig.duration != undefined ? tintConfig.duration : defaultConfig.duration,
									delay: tintConfig.delay != undefined ? tintConfig.delay : defaultConfig.delay,
									repeat: tintConfig.repeat != undefined ? tintConfig.repeat : defaultConfig.repeat,
									yoyo: tintConfig.yoyo != undefined ? tintConfig.yoyo : defaultConfig.yoyo,
									ease: tintConfig.ease != undefined ? tintConfig.ease : defaultConfig.ease,
								},
								0
							);
						}
						if (alphaConfig.hasOwnProperty("alpha")) {
							hasAlpha = true;
							tl.to(
								targets,
								{
									pixi: {
										alpha: alphaConfig.alpha,
									},
									duration: alphaConfig.duration != undefined ? alphaConfig.duration : defaultConfig.duration,
									delay: alphaConfig.delay != undefined ? alphaConfig.delay : defaultConfig.delay,
									repeat: alphaConfig.repeat != undefined ? alphaConfig.repeat : defaultConfig.repeat,
									yoyo: alphaConfig.yoyo != undefined ? alphaConfig.yoyo : defaultConfig.yoyo,
									ease: alphaConfig.ease != undefined ? alphaConfig.ease : defaultConfig.ease,
								},
								0
							);
						}

						return tl;
					},
					defaults: defaultConfig, //defaults get applied to any "config" object passed to the effect
					extendTimeline: true, //now you can call the effect directly on any GSAP timeline to have the result immediately inserted in the position you define (default is sequenced at the end)
				});
			});
		};

		DisplayObject.prototype.addTheatreAnimations = function () {
			if (!this.anims) {
				const defConfig = {
					iterationCount: 1,
					direction: "normal", // normal, reverse, alternate, alternateReverse
					rate: 1,
					onComplete: () => {
						console.log("DONE2!");
					},
				};
				this.anims = {
					play: (key, config = defConfig) => {
						const data = this.data.theatreData;
						const filteredSheet = data.sheets.filter((item) => item.sheetName === key)[0];
						//console.log("play", filteredSheet);

						const curProjId = filteredSheet.curProjId;
						const sheetName = filteredSheet.sheetName;
						const animData = filteredSheet.data;

						const project = getProject(curProjId, { state: animData });
						const sheet = project.sheet(sheetName);

						const theatreData = fillConfig(this);

						const theatreObj = sheet.object("Props", theatreData, { reconfigure: true });

						theatreObj.onValuesChange((newValues) => {
							setProps(this, newValues);
						});

						this.sheet = sheet;

						project.ready.then(() => {
							sheet.sequence.play(config).then(() => {
								config.onComplete();
							});
						});
					},
					pause: () => {
						this.sheet && this.sheet.sequence.pause();
					},
				};
			}

			// if (this.data.theatreData) {
			//     console.log("addTheatreAnimations", this.data.theatreData);
			//     const data = this.data.theatreData;

			//     data.sheets.forEach(item => {
			//         const curProjId = item.curProjId;
			//         const sheetName = item.sheetName;
			//         const animData = item.data;

			//         const project = getProject(curProjId, { state: animData })
			//         const sheet = project.sheet(sheetName)

			//         const theatreData = fillConfig(this);

			//         const theatreObj = sheet.object("Props", theatreData);

			//         function setProps(obj, values) {
			//             for (let prop in values) {
			//                 if (typeof values[prop] === 'object') {
			//                     setProps(obj[prop], values[prop]); // recurse
			//                 } else {
			//                     obj[prop] = values[prop];
			//                 }
			//             }
			//         }

			//         theatreObj.onValuesChange((newValues) => {
			//             setProps(this, newValues);
			//         });

			//         project.ready.then(() => {
			//             console.log("DONE!");
			//             this.anims[sheetName] = sheet.sequence.play({ iterationCount: Infinity }).then(() => {
			//                 console.log("DONE2!");
			//             });
			//         })
			//     });
			// }
		};
	}
}

function setProps(obj, values) {
	for (let prop in values) {
		if (typeof values[prop] === "object") {
			setProps(obj[prop], values[prop]); // recurse
		} else {
			obj[prop] = values[prop];
		}
	}
}

function fillConfig(gameObject) {
	let data = {};
	let props = [
		{ x: 0 },
		{ y: 0 },
		{
			position: { x: 0, y: 0, z: 0 },
		},
		{
			scale: { x: 1, y: 1, z: 1 },
		},
		{
			rotation: { x: 0, y: 0, z: 0 },
		},
		{ alpha: 1 },
		{ angle: 0 },
		{
			anchor: { x: 0, y: 0 },
		},
	];

	for (let i = 0; i < props.length; i++) {
		let prop = props[i];
		for (let key in prop) {
			console.log("key", key);
			switch (key) {
				case "x":
					if (gameObject.data.frameworkType == "2d" && gameObject[key]) data[key] = gameObject[key];
					break;
				case "y":
					if (gameObject.data.frameworkType == "2d" && gameObject[key]) data[key] = gameObject[key];
					break;
				case "position":
					if (gameObject.data.frameworkType == "3d" && gameObject[key]) {
						data[key] = {};
						if (gameObject[key]["x"]) data[key]["x"] = gameObject[key]["x"];
						if (gameObject[key]["y"]) data[key]["y"] = gameObject[key]["y"];
						if (gameObject[key]["z"]) data[key]["z"] = gameObject[key]["z"];
					}
					break;
				case "scale":
					if (gameObject[key]) {
						data[key] = {};
						if (gameObject[key]["x"]) data[key]["x"] = gameObject[key]["x"];
						if (gameObject[key]["y"]) data[key]["y"] = gameObject[key]["y"];
						if (gameObject[key]["z"]) data[key]["z"] = gameObject[key]["z"];
					}
					break;
				case "rotation":
					if (gameObject.data.frameworkType == "3d" && gameObject[key] != undefined && gameObject[key] != null) {
						if (typeof gameObject[key] == "object") {
							data[key] = {};
							if (gameObject[key]["x"]) data[key]["x"] = gameObject[key]["x"];
							if (gameObject[key]["y"]) data[key]["y"] = gameObject[key]["y"];
							if (gameObject[key]["z"]) data[key]["z"] = gameObject[key]["z"];
						} else {
							data[key] = gameObject[key];
						}
					}
					break;
				case "alpha":
					if (gameObject.data.frameworkType == "2d" && gameObject[key] != undefined && gameObject[key] != null) {
						data[key] = gameObject[key];
					}
					break;
				case "angle":
					if (gameObject.data.frameworkType == "2d" && gameObject[key] != undefined && gameObject[key] != null) {
						data[key] = gameObject[key];
					}
					break;
				case "anchor":
					if (gameObject.data.frameworkType == "2d" && gameObject[key]) {
						data[key] = {};
						if (gameObject[key]["x"]) data[key]["x"] = gameObject[key]["x"];
						if (gameObject[key]["y"]) data[key]["y"] = gameObject[key]["y"];
					}
					break;
				default:
					break;
			}
		}
	}

	return data;
}

function getGlobalScale(child) {
	child.onResizeCallback && child.onResizeCallback(globals.pixiScene.lastWidth, globals.pixiScene.lastHeight);
	let globalScaleX = child.scale.x;
	let globalScaleY = child.scale.y;

	let parent = child.parent;
	while (parent) {
		parent.onResizeCallback && parent.onResizeCallback(globals.pixiScene.lastWidth, globals.pixiScene.lastHeight);
		globalScaleX *= parent.scale.x;
		globalScaleY *= parent.scale.y;
		parent = parent.parent;
	}

	return { x: globalScaleX, y: globalScaleY };
}
