import { Loader } from "pixi.js-legacy";
import ResizeHelper from "./helpers/resizeHelper";
import Entity from "../../../ecs/entity";
import { v4 as uuidv4 } from "uuid";
import pf2D from "../../index";
import pfGlobals from "../../pfGlobals";
import Scene from "../../gameobjects/scene";
import Stage from "../../gameobjects/stage";

const Resources = Loader.shared.resources;

let scenes = [];
/**
 * Represents a controller for managing scenes and objects in a 2D game or application.
 */
class SceneController {
	/**
	 * Creates an instance of SceneController.
	 * @param {Stage} stage2D - The 2D stage instance.
	 * @param {Object} editorConfig - The editor configuration.
	 */
	constructor(stage2D, editorConfig) {
		this.editorConfig = editorConfig;
		this.stage2D = stage2D;
		this.stuffsMapList2D = app.globals.stuffsMapList2D;

		let pixiSceneData = this.editorConfig.sceneData2D || this.editorConfig.pixiSceneData;

		for (let sceneData of pixiSceneData) {
			let scene = this.stage2D.add.scene(sceneData.name);
			scenes.push(scene);
			scene.objects = sceneData.objects;
			scene.uuid = sceneData.uuid;
			scene.viewportData = sceneData.viewportData;
		}
		let allAnims = {};
		for (let uuid in Resources) {
			for (let animName in Resources[uuid].animations) {
				allAnims[animName] = uuid;
			}
		}
		this.allAnims = allAnims;
	}

	/**
	 * Clones a given object and its children, if any.
	 * @param {PIXI.DisplayObject} obj - The object to clone.
	 * @returns {PIXI.DisplayObject} The cloned object.
	 */
	cloneObject(obj) {
		let clone = (obj) => {
			if (obj.isEditorObject) {
				let newData = JSON.parse(JSON.stringify(obj.data));
				delete newData.parentUUID;
				newData.uuid = uuidv4();
				let newObj = this._addObject(newData);
				return newObj;
			} else {
				let newObj;
				if (obj.clone) {
					newObj = obj.clone();
				} else {
					if (obj.isSprite) {
						newObj = new Sprite.from(obj.texture);
					} else {
						console.warn("Object cannot be cloned, ask Omer to add support for it.");
					}
				}

				if (newObj) {
					newObj.x = obj.x;
					newObj.y = obj.y;
					newObj.scale.x = obj.scale.x;
					newObj.scale.y = obj.scale.y;
					newObj.rotation = obj.rotation;
					newObj.alpha = obj.alpha;
					newObj.tint = obj.tint;
					newObj.blendMode = obj.blendMode;
					newObj.visible = obj.visible;

					return newObj;
				}
			}
		};

		let traverse = (obj, parent) => {
			if (obj.children) {
				for (let child of obj.children) {
					let newObj = clone(child);
					if (newObj) {
						parent.addChild(newObj);
						traverse(child, newObj);
					}
				}
			}
		};

		let returnObj = clone(obj);
		traverse(obj, returnObj);

		return returnObj;
	}
	/**
	 * Instantiates a prefab by creating objects based on prefab data.
	 * @param {string} prefabName - The name of the prefab to instantiate.
	 * @returns {PIXI.DisplayObject} The instantiated object.
	 */
	instantiate(prefabName) {
		let traverse = (data, parent) => {
			if (data.children) {
				for (let child of data.children) {
					let obj = this._addObject(child);
					parent.addChild(obj);
					traverse(child, obj);
				}
			}
		};

		let prefabData = this.editorConfig.prefabData.find((p) => p.name === prefabName);
		if (prefabData) {
			let data = JSON.parse(JSON.stringify(prefabData));
			let obj = this._addObject(data);
			traverse(data, obj);

			return obj;
		}
	}

	/**
	 * Creates and adds a PIXI.js display object based on the provided data.
	 * @param {Object} data - The object data used for creating the display object.
	 * @returns {PIXI.DisplayObject} The created display object.
	 * @private
	 */
	_addObject(data) {
		let obj;

		if (data.type == "container") {
			obj = this.stage2D.add.container(0, 0);
			obj.setOrigin(data.pivot.x, data.pivot.y);
			// obj = new PIXI.Container();
			// obj.pivot.set(data.pivot.x, data.pivot.y);
		} else if (data.type == "sprite") {
			//PORTRAIT
			if (data.texture) {
				if (data.texture.isUploadable && app.data[data.texture.uploadableName]) {
					data.texture.uuid = data.texture.uploadableName;
				} else if (data.texture.useFromStuffs) {
					let uuid = data.texture.stuffsValue;
					let textureKey = this.stuffsMapList2D[uuid];
					data.texture.uuid = textureKey;
				}
			}
			//LANDSCAPE
			if (data.landscapeTexture) {
				if (data.landscapeTexture.isUploadable && app.data[data.landscapeTexture.uploadableName]) {
					data.landscapeTexture.uuid = data.landscapeTexture.uploadableName;
				} else if (data.landscapeTexture.useFromStuffs) {
					let uuid = data.landscapeTexture.stuffsValue;
					let textureKey = this.stuffsMapList2D[uuid];
					data.landscapeTexture.uuid = textureKey;
				}
			}

			obj = this.stage2D.add.sprite(0, 0, data?.texture?.uuid);
			obj.setOrigin(data.anchor.x, data.anchor.y).setSkew(data.skew.x, data.skew.y);
		} else if (data.type == "spine") {
			let loop = data.loop === undefined ? true : data.loop;
			obj = this.stage2D.add.spine(0, 0, data.texture.uuid, data.skinKey, data.animationKey, loop);
			obj.timeScale = data.animationSpeed;
			obj.setOrigin(data.pivot.x, data.pivot.y);
		} else if (data.type == "particle") {
			obj = this.stage2D.add.particleEmitter(0, 0, data.particleData);
			obj.setOrigin(data.pivot.x, data.pivot.y);

			obj.setSpawnPos(data.width * 0.5, data.height * 0.5);
			obj.setEmit(data.playAtStart);
		} else if (data.type == "animatedSprite") {
			obj = this.stage2D.add.animatedSprite(0, 0, data.animationKey, data.autoPlay, data.loop);
			obj.animationSpeed = data.animationSpeed;
			obj.setOrigin(data.anchor.x, data.anchor.y);
			obj.setSkew(data.skew.x, data.skew.y);
		} else if (data.type == "graphics") {
			obj = this.stage2D.add.graphics(0, 0);

			let rawFillColor = data.fill;
			let fillColor = RGBToHex(rawFillColor[0], rawFillColor[1], rawFillColor[2]);

			let rawLineColor = data.lineColor;
			let lineColor = RGBToHex(rawLineColor[0], rawLineColor[1], rawLineColor[2]);

			if (data.hasLineStyle) {
				obj.lineStyle(data.lineWidth, lineColor, data.lineAlpha);
			}

			obj.beginFill(fillColor, data.fillAlpha);

			if (data.shapeType == "rectangle") {
				if (data.isRoundedRect) {
					obj.drawRoundedRect(0, 0, data.width, data.height, data.borderRadius);
				} else {
					obj.drawRect(0, 0, data.width, data.height);
				}
			} else if (data.shapeType == "circle") {
				obj.drawCircle(0, 0, data.radius);
			} else if (data.shapeType == "ellipse") {
				obj.drawEllipse(0, 0, data.width, data.height);
			}

			obj.endFill();

			obj.setOrigin(data.pivot.x, data.pivot.y);
		} else if (data.type == "text") {
			var style = {
				fontFamily: data.fontFamily,
				fontSize: data.fontSize,
				// fontStyle: "italic",
				// fontWeight: "bold",
				fill: data.fill,
				stroke: RGBToHex(data.stroke[0], data.stroke[1], data.stroke[2]),
				strokeThickness: data.strokeThickness,
				dropShadow: data.dropShadow,
				dropShadowColor: RGBToHex(data.dropShadowColor[0], data.dropShadowColor[1], data.dropShadowColor[2]),
				dropShadowBlur: data.dropShadowBlur,
				dropShadowAngle: data.dropShadowAngle,
				dropShadowDistance: data.dropShadowDistance,
				wordWrap: data.wordWrap,
				wordWrapWidth: data.wordWrapWidth,
				letterSpacing: data.letterSpacing,
				padding: data.padding,
				breakWords: data.breakWords,
				align: data.align,
				lineHeight: data.lineHeight,
				leading: data.leading,
				lineJoin: "round",
			};

			obj = this.stage2D.add.text(0, 0, data.text, style);
			obj.resolution = data.resolution;
			obj.setOrigin(data.anchor.x, data.anchor.y);
		} else if (data.type == "nineslice") {
			obj = this.stage2D.add.nineslice(0, 0, data.texture.uuid, data.origWidth, data.origHeight, data.leftWidth, data.rightWidth, data.topHeight, data.bottomHeight);
			obj.setOrigin(data.pivot.x, data.pivot.y);
		}

		if (!obj) return;
		obj.isEditorObject = true;

		if (data.tint) {
			obj.tint = RGBToHex(data.tint[0], data.tint[1], data.tint[2]);
		}

		obj.visible = data.enabled;
		obj.alpha = data.alpha === undefined ? data.opacity : data.alpha;
		obj.x = data.position.x;
		obj.y = data.position.y;
		obj.scale.set(data.scale.x, data.scale.y);
		obj.angle = data.angle || 0;
		obj.exclude = data.exclude;
		obj.blendMode = data.blendMode || 0;
		obj.sortableChildren = data.sortableChildren || false;
		obj.zIndex = data.zIndex || 0;

		obj.uuid = data.uuid;
		obj.sceneUUID = data.sceneUUID;
		obj.parentUUID = data.parentUUID;
		obj.data = data;
		obj.name = data.name;
		// obj.baseWidth = data.baseWidth;
		// obj.baseHeight = data.baseHeight;
		obj.refObjects = [];
		for (let scene of scenes) {
			if (scene.uuid == data.sceneUUID) {
				obj.sceneRef = scene;
				break;
			}
		}

		let stage2D = this.stage2D;

		if (obj.data.parentUUID) {
			const parent = stage2D.children.find((a) => a.uuid == obj.data.parentUUID);
			if (parent) {
				parent.addChild(obj);
			}
		} else {
			if (this.curScene.viewportData && this.curScene.viewportData.enabled) {
				this.pixiViewport.addChild(obj);
			} else {
				// let pixiObj = obj.pixiObj || obj;
				stage2D.addChild(obj);
			}
		}

		let objs = this.getAllChilds(obj);

		objs.forEach((obj, index) => {
			let data = obj.data;
			if (data && (data.resizeData || data.staticTransformData)) {
				obj.onResizeCallback = function (w, h) {
					if (!w) {
						w = stage2D.lastWidth;
					}
					if (!h) {
						h = stage2D.lastHeight;
					}
					if (this.refObjects) {
						for (let refObj of this.refObjects) {
							refObj.onResizeCallback(w, h);
						}
					}

					if (data.resizeData) {
						let dt = stage2D.lastWidth > stage2D.lastHeight ? data.resizeData.landscape : data.resizeData.portrait;

						let orientation = "";
						if (stage2D.lastWidth > stage2D.lastHeight) {
							if (dt.enabled) {
								orientation = "landscape";
							} else {
								orientation = "portrait";
							}
						} else {
							orientation = "portrait";
						}

						let scale = ResizeHelper.getScale(obj, orientation);
						this.scale.set(scale.x, scale.y);

						let position = ResizeHelper.getPosition(obj, orientation);
						this.position.set(position.x, position.y);
					} else if (data.staticTransformData) {
						let dt = stage2D.lastWidth > stage2D.lastHeight ? data.staticTransformData.landscape : data.staticTransformData.portrait;

						let orientation = "";
						if (stage2D.lastWidth > stage2D.lastHeight) {
							if (dt.enabled) {
								orientation = "landscape";
							} else {
								orientation = "portrait";
							}
						} else {
							orientation = "portrait";
						}
						const orientedData = data.staticTransformData[orientation];
						this.x = orientedData.x;
						this.y = orientedData.y;
						this.scale.set(orientedData.scaleX, orientedData.scaleY);
						this.angle = orientedData.angle;
						this.alpha = orientedData.alpha;
						this.skew.set(orientedData.skewX, orientedData.skewY);
					}
				};
			}
		});

		if (data.scriptList && data.scriptList.length > 0) {
			obj.entity = new Entity(obj);

			for (let scriptData of data.scriptList) {
				let scripts = this.editorConfig.assetsData.assets.script;
				let script = Object.values(scripts).find((a) => a.uuid == scriptData);
				if (!script) {
					console.log("Script not found: " + scriptData);
					continue;
				}

				let varData = script.data.variableDataList[data.uuid]?.variableData || [];

				let loadedScript;

				// #if process.pfData.isDevelepoment
				// loadedScript = require("../../../../../../assets" + script.path);
				// loadedScript = require("../../../../assets" + script.path);
				// #endif

				if (app.scriptsData) {
					loadedScript = app.scriptsData[script.uuid];
				}

				// #if !process.pfData.isDevelepoment
				// loadedScript = app.scriptsData[script.uuid];
				// #endif

				loadedScript = loadedScript.default || loadedScript;

				let code = new loadedScript();
				code._initDefault(obj, varData, this);
				obj.entity.addComponent(code, code._className);
			}
		}

		return obj;
	}

	/**
	 * Recursively retrieves an array of all child objects within a given parent object.
	 * @param {PIXI.DisplayObject} parent - The parent object to retrieve children from.
	 * @returns {PIXI.DisplayObject[]} An array of child objects.
	 */
	getAllChilds(parent) {
		const objects = [];

		objects.push(parent);
		if (parent.children.length > 0) {
			for (let i = 0; i < parent.children.length; i++) {
				const child = parent.children[i];

				if (child.children.length) {
					const childObjects = this.getAllChilds(child);
					if (child != this.stage2D) {
						childObjects.push(child);
					}
					objects.push(...childObjects);
				} else {
					objects.push(child);
				}
			}
		}

		return objects;
	}

	/**
	 * Retrieves an object by its name from the specified scene or list of scenes.
	 * @param {string} name - The name of the object to retrieve.
	 * @param {Scene} [fromScene] - The scene to search for the object.
	 * @returns {PIXI.DisplayObject} The retrieved object, if found.
	 */
	getObject(name, fromScene) {
		let obj;

		let sceneList = fromScene ? [fromScene] : scenes;

		for (let scene of sceneList) {
			obj = scene.objList.find((obj) => obj.name === name);
			if (obj) break;
		}

		return obj;
	}

	/**
	 * Retrieves an object by its UUID from the specified scene or list of scenes.
	 * @param {string} uuid - The UUID of the object to retrieve.
	 * @param {Scene} [fromScene] - The scene to search for the object.
	 * @returns {PIXI.DisplayObject} The retrieved object, if found.
	 */
	getObjectByUUID(uuid, fromScene) {
		let obj;

		let sceneList = fromScene ? [fromScene] : scenes;

		for (let scene of sceneList) {
			obj = scene.objList.find((_obj) => _obj.uuid === uuid);
			if (obj) break;
		}

		return obj;
	}

	/**
	 * Updates all entities within the scenes.
	 * @param {number} time - The current time.
	 * @param {number} delta - The time elapsed since the last update.
	 */
	update(time, delta) {
		for (let scene of scenes) {
			for (let i = 0; i < scene.entityList.length; i++) {
				let ent = scene.entityList[i].entity;
				ent.update(time, delta);
			}
		}
	}

	/**
	 * Resizes all entities within the scenes.
	 * @param {number} w - The new width.
	 * @param {number} h - The new height.
	 */
	resize(w, h) {
		for (let scene of scenes) {
			for (let obj of scene.entityList) {
				obj.entity.resize(w, h);
			}
		}
	}

	/**
	 * Retrieves a scene by its name.
	 * @param {string} name - The name of the scene to retrieve.
	 * @returns {Scene} The retrieved scene, if found.
	 */
	getSceneByName(name) {
		return scenes.find((scene) => scene.name === name);
	}

	/**
	 * Starts a specified scene.
	 * @param {string} name - The name of the scene to start.
	 * @param {boolean} [removeCurScene] - Whether to remove the current scene.
	 * @returns {Scene} The started scene.
	 */
	start(name, removeCurScene) {
		let scene = scenes.find((scene) => scene.name === name);
		if (!scene) {
			console.warn("Scene not found");
			return;
		}

		if (removeCurScene) {
			this._removeScene(this.curScene);
		}

		this.curScene = scene;
		console.log("Starting scene: ", this.curScene);

		if (scene.viewportData && scene.viewportData.enabled) {
			const viewportData = scene.viewportData;
			const viewport = this.stage2D.add.viewport({
				screenWidth: window.innerWidth,
				screenHeight: window.innerHeight,
				worldWidth: 0,
				worldHeight: 0,
			});

			viewport.sortableChildren = true;
			this.pixiViewport = viewport;
			pfGlobals.pixiViewport = viewport;
			scene.viewport = viewport;

			// this.stage2D.addChild(viewport);

			window.viewport = viewport;

			viewport.drag().pinch().wheel().decelerate();

			viewport.debug = this.stage2D.add.graphics(0, 0);
			viewport.debug.zIndex = 9999;
			viewport.addChild(viewport.debug);

			if (viewportData.hasDebug) {
				viewport.debug.visible = true;
			} else {
				viewport.debug.visible = false;
			}

			viewport.onResizeCallback = (w, h) => {
				viewport.screenWidth = w;
				viewport.screenHeight = h;
				viewport.worldWidth = viewportData.worldWidth;
				viewport.worldHeight = viewportData.worldHeight;

				const { worldWidth, worldHeight, hasClampEdges, clampDirection, hasClampZoom, startX, startY } = viewportData;

				if (hasClampEdges) {
					viewport.clamp({
						direction: clampDirection,
						left: 0,
						right: worldWidth,
						top: 0,
						bottom: worldHeight,
					});
				}

				if (hasClampZoom) {
					viewport.clampZoom({
						minWidth: 0,
						minHeight: 0,
						maxWidth: Math.min(worldWidth, worldHeight),
						maxHeight: Math.min(worldWidth, worldHeight),
					});
				}

				viewport.debug.clear();
				viewport.debug.lineStyle(6, 0xff9c0a, 1);
				viewport.debug.drawRect(0, 0, worldWidth, worldHeight);
			};
			viewport.onResizeCallback(this.stage2D.lastWidth, this.stage2D.lastHeight);

			viewport.moveCenter(viewportData.startX, viewportData.startY);
		}

		let uuidList = {};
		let objList = [];
		let entityList = [];

		scene.objList = objList;
		scene.entityList = entityList;

		for (let data of scene.objects) {
			let obj = this._addObject(data);
			if (obj) {
				uuidList[data.uuid] = obj;
				objList.push(obj);
			}

			if (obj.entity) {
				entityList.push(obj);
			}
		}

		for (let obj of objList) {
			if (obj.parentUUID) {
				let parent = uuidList[obj.parentUUID];
				parent.addChild(obj);
			}

			const data = obj.data;

			if (data.isMask && data.maskUUID) {
				const targetObj = objList.filter((a) => a.data.maskUUID == data.uuid)[0];
				if (targetObj) {
					if (data.type == "graphics") {
						targetObj.mask = obj;
					} else {
						pf2D.utils.spriteMask(targetObj, obj, data.invertAlpha);
						// new SpriteMask(targetObj, obj, data.invertAlpha);
					}
				}
			}

			// obj.addTweens();
			// obj.addTheatreAnimations();
		}

		this.fillPublicVariables(entityList);

		app.main.resizeNow(); // resize before scripts are initialized to get correct values

		for (let obj of [...entityList]) {
			obj.entity.awake();
		}
		for (let obj of [...entityList]) {
			obj.entity.init();
		}

		app.main.resizeNow();

		return scene;
	}

	/**
	 * Fills public variables in components of the provided entity list.
	 * @param {PIXI.DisplayObject[]} entityList - The list of entities to fill variables for.
	 */
	fillPublicVariables(entityList) {
		for (let obj of entityList) {
			obj.entity.runOnAllComponents((component) => {
				if (!component._configVarData) return;
				component._initPublicVariables();
			});
		}
	}

	/**
	 * Removes an object from the scene and related data.
	 * @param {PIXI.DisplayObject} obj - The object to remove.
	 */
	removeObject(obj) {
		let scene = obj.sceneRef;
		if (!scene) return;

		let index = scene.objList.indexOf(obj);
		if (index != -1) {
			scene.objList.splice(index, 1);
		}
		if (obj.entity) {
			obj.entity.destroy();
		}

		index = scene.entityList.indexOf(obj);
		if (index != -1) {
			scene.entityList.splice(index, 1);
		}
	}

	/**
	 * Removes a scene by its name.
	 * @param {string} name - The name of the scene to remove.
	 */
	remove(name) {
		let scene = scenes.find((scene) => scene.name === name);

		if (!scene) {
			console.warn("Scene not found");
			return;
		}

		this._removeScene(scene);
	}

	/**
	 * Removes all scenes and related data.
	 */
	removeAll() {
		scenes.forEach((scene) => {
			this._removeScene(scene);
		});
	}

	/**
	 * Removes a scene and its related data.
	 * @param {Scene} scene - The scene to remove.
	 * @private
	 */
	_removeScene(scene) {
		if (!scene) return;

		scene.objList.forEach((element) => {
			element.destroy();
			if (element.entity) {
				element.entity.destroy();
			}
		});

		scene.objList = [];
		scene.entityList = [];
	}
}

export default SceneController;

/**
 * Converts RGB color values to a hexadecimal representation.
 * @param {number} r - The red color component (0-1).
 * @param {number} g - The green color component (0-1).
 * @param {number} b - The blue color component (0-1).
 * @returns {string} The hexadecimal color representation.
 */
function RGBToHex(r, g, b) {
	r *= 255;
	g *= 255;
	b *= 255;

	r = r.toString(16);
	g = g.toString(16);
	b = b.toString(16);

	if (r.length == 1) r = "0" + r;
	if (g.length == 1) g = "0" + g;
	if (b.length == 1) b = "0" + b;

	return "0x" + r + g + b;
}
