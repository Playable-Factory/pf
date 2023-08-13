import gx from "pf.js/src";
import objectTypes from "pf.js/src/gameobjects/objectTypes";
import Position from "pf.js/src/gameobjects/props/position";
import Scale from "pf.js/src/gameobjects/props/scale";
import Skew from "pf.js/src/gameobjects/props/skew";
import pfGlobals from "pf.js/src/pfGlobals";
import { ColorOverlayFilter } from "pixi-filters";

class GameObject {
	constructor(pixiObj, x = 0, y = 0) {
		this.pixiObj = pixiObj;

		this.baseWidth = this.pixiObj.width;
		this.baseHeight = this.pixiObj.height;

		this.setOrigin(0.5, 0.5);
		this.setPosition(x, y);

		this.setPivot = this.setOrigin;

		this.eventListeners = {};
	}

	addChild(child) {
		if (!child.pixiObj) {
			console.warn("Child does not have a pixi object");
			return;
		}
		this.pixiObj.addChild(child.pixiObj);
	}

	removeChild(child) {
		if (!child.pixiObj) {
			console.warn("Child does not have a pixi object");
			return;
		}
		this.pixiObj.removeChild(child.pixiObj);
	}

	remove() {
		this.pixiObj.parent.remove(this.pixiObj);
	}

	get children() {
		return this.pixiObj.children;
	}

	get parent() {
		return this.pixiObj.parent;
	}

	set visible(value) {
		this.pixiObj.visible = value;
	}

	get visible() {
		return this.pixiObj.visible;
	}

	set x(value) {
		this.pixiObj.x = value;
	}

	get x() {
		return this.pixiObj.x;
	}

	set y(value) {
		this.pixiObj.y = value;
	}

	get y() {
		return this.pixiObj.y;
	}

	///ROTATION
	set rotation(value) {
		this.pixiObj.rotation = value;
	}

	get rotation() {
		return this.pixiObj.rotation;
	}

	///ALPHA
	get alpha() {
		return this.pixiObj.alpha;
	}

	set alpha(value) {
		this.pixiObj.alpha = value;
	}
	///TINT
	get tint() {
		return this.pixiObj.tint;
	}

	set tint(value) {
		this.pixiObj.tint = value;
	}
	setTint(value) {
		this.pixiObj.tint = value;
		return this;
	}
	setTintFill(value) {
		let filter = new ColorOverlayFilter(value, 1);
		this.pixiObj.filters = [filter];
	}

	//FILTERS
	get filters() {
		return this.pixiObj.filters;
	}
	set filters(value) {
		this.pixiObj.filters = value;
	}

	///BLENDMODE
	get blendMode() {
		return this.pixiObj.blendMode;
	}

	set blendMode(value) {
		this.pixiObj.blendMode = value;
	}

	///SCALE///
	_scale = new Scale(this);

	set scale(value) {
		this.pixiObj.scale.x = value;
		this.pixiObj.scale.y = value;
	}

	get scale() {
		return this._scale;
	}

	set scaleX(value) {
		this.pixiObj.scale.x = value;
	}

	get scaleX() {
		return this.pixiObj.scale.x;
	}

	set scaleY(value) {
		this.pixiObj.scale.y = value;
	}

	get scaleY() {
		return this.pixiObj.scale.y;
	}

	setScale(x, y) {
		if (y === undefined) {
			y = x;
		}
		this.pixiObj.scale.set(x, y);
		return this;
	}

	///SKEW///
	_skew = new Skew(this);

	set skew(value) {
		this.pixiObj.skew.x = value;
		this.pixiObj.skew.y = value;
	}

	get skew() {
		return this._skew;
	}

	set skewX(value) {
		this.pixiObj.skew.x = value;
	}

	get skewX() {
		return this.pixiObj.skew.x;
	}

	set skewY(value) {
		this.pixiObj.skew.y = value;
	}

	get skewY() {
		return this.pixiObj.skew.y;
	}

	setSkew(x, y) {
		if (y === undefined) {
			y = x;
		}
		this.pixiObj.skew.set(x, y);
		return this;
	}

	///POSITION///
	_position = new Position(this);

	set position(value) {
		this.pixiObj.x = value;
		this.pixiObj.y = value;
	}

	get position() {
		return this._position;
	}

	set positionX(value) {
		this.pixiObj.x = value;
	}

	get positionX() {
		return this.pixiObj.x;
	}

	set positionY(value) {
		this.pixiObj.position.y = value;
	}

	get positionY() {
		return this.pixiObj.position.y;
	}

	setPosition(x, y) {
		if (y === undefined) {
			y = x;
		}
		this.pixiObj.position.set(x, y);
		return this;
	}

	//MASK
	set mask(value) {
		this.pixiObj.mask = value;
	}
	get mask() {
		return this.pixiObj.mask;
	}
	setMask(value) {
		this.pixiObj.mask = value;
		return this;
	}
	removeMask() {
		this.pixiObj.mask = null;
		return this;
	}

	//ANGLE
	set angle(value) {
		this.pixiObj.angle = value;
	}

	get angle() {
		return this.pixiObj.angle;
	}

	//SORTABLE CHILDREN
	set sortableChildren(value) {
		this.pixiObj.sortableChildren = value;
	}
	get sortableChildren() {
		return this.pixiObj.sortableChildren;
	}

	//ZINDEX
	set zIndex(value) {
		this.pixiObj.zIndex = value;
	}
	get zIndex() {
		return this.pixiObj.zIndex;
	}

	//ORIGIN
	set origin(value) {
		this.setOrigin(value);
	}
	get origin() {
		return this.pixiObj.anchor || this.pixiObj.pivot;
	}

	set originX(value) {
		this.pixiObj.anchor ? (this.pixiObj.anchor.x = value) : (this.pixiObj.pivot.x = value);
	}
	get originX() {
		return this.pixiObj.anchor ? this.pixiObj.anchor.x : this.pixiObj.pivot.x;
	}

	set originY(value) {
		this.pixiObj.anchor ? (this.pixiObj.anchor.y = value) : (this.pixiObj.pivot.y = value);
	}
	get originY() {
		return this.pixiObj.anchor ? this.pixiObj.anchor.y : this.pixiObj.pivot.y;
	}

	//HELPER FUNCTIONS
	setAlpha(value) {
		this.pixiObj.alpha = value;
		return this;
	}
	setBlendMode(value) {
		this.pixiObj.blendMode = value;
		return this;
	}

	setRotation(value) {
		this.pixiObj.rotation = value;
		return this;
	}

	setAngle(value) {
		this.pixiObj.angle = value;
		return this;
	}

	setOrigin(x, y) {
		if (y === undefined) {
			y = x;
		}
		let temp = this.pixiObj.anchor ? this.pixiObj.anchor : this.pixiObj.pivot;
		temp.set(x, y);

		return this;
	}

	setAnchor(x, y) {
		this.setOrigin(x, y);
	}

	destroy() {
		this.pixiObj.destroy();
	}

	//TOP BOTTOM LEFT RIGHT GETTERS AND SETTERS
	get top() {
		let temp = this.pixiObj.anchor ? this.pixiObj.anchor : this.pixiObj.pivot;
		return this.pixiObj.y - this.pixiObj.height * temp.y;
	}

	get bottom() {
		let temp = this.pixiObj.anchor ? this.pixiObj.anchor : this.pixiObj.pivot;
		return this.pixiObj.y + this.pixiObj.height * (1 - temp.y);
	}

	get left() {
		let temp = this.pixiObj.anchor ? this.pixiObj.anchor : this.pixiObj.pivot;
		return this.pixiObj.x - this.pixiObj.width * temp.x;
	}

	get right() {
		let temp = this.pixiObj.anchor ? this.pixiObj.anchor : this.pixiObj.pivot;
		return this.pixiObj.x + this.pixiObj.width * (1 - temp.x);
	}

	//TOP BOTTOM LEFT RIGHT SETTERS
	set top(value) {
		let temp = this.pixiObj.anchor ? this.pixiObj.anchor : this.pixiObj.pivot;
		this.pixiObj.y = value + this.pixiObj.height * temp.y;
	}

	set bottom(value) {
		let temp = this.pixiObj.anchor ? this.pixiObj.anchor : this.pixiObj.pivot;
		this.pixiObj.y = value - this.pixiObj.height * (1 - temp.y);
	}

	set left(value) {
		let temp = this.pixiObj.anchor ? this.pixiObj.anchor : this.pixiObj.pivot;
		this.pixiObj.x = value + this.pixiObj.width * temp.x;
	}

	set right(value) {
		let temp = this.pixiObj.anchor ? this.pixiObj.anchor : this.pixiObj.pivot;
		this.pixiObj.x = value - this.pixiObj.width * (1 - temp.x);
	}

	//DIMENSIONS - WIDTH
	set width(width) {
		this.pixiObj.width = width;
	}
	get width() {
		return this.baseWidth;
	}

	set displayWidth(width) {
		this.pixiObj.width = width;
	}

	get displayWidth() {
		return this.pixiObj.width;
	}

	//DIMENSIONS - HEIGHT
	set height(height) {
		this.pixiObj.height = height;
	}
	get height() {
		return this.baseHeight;
	}

	set displayHeight(height) {
		this.pixiObj.height = height;
	}

	get displayHeight() {
		return this.pixiObj.height;
	}

	cloneInternal() {}

	///CLONE
	clone() {
		// let sceneController = pfGlobals.pixiApp.sceneController;
		let clone = (obj) => {
			let type = obj.type;
			let newObj = null;

			if (type == objectTypes.SPRITE) {
				newObj = gx.add.sprite(obj.x, obj.y, obj.textureName);
			} else if (type == objectTypes.TEXT) {
				newObj = gx.add.text(obj.x, obj.y, obj.text, obj.style);
			} else if (type == objectTypes.ANIMATED_SPRITE) {
				newObj = gx.add.animatedSprite(obj.x, obj.y, obj.animKey, obj.isPlaying, obj.loop);
				newObj.animationSpeed = obj.animationSpeed;
			} else if (type == objectTypes.SPINE) {
				newObj = gx.add.spine(obj.x, obj.y, obj.spineName, obj.skinName, obj.animName, obj.loop);
			} else if (type == objectTypes.CONTAINER) {
				newObj = gx.add.container(obj.x, obj.y);
			}

			newObj.x = obj.x;
			newObj.y = obj.y;
			newObj.scale.x = obj.scale.x;
			newObj.scale.y = obj.scale.y;
			newObj.skew.x = obj.skew.x;
			newObj.skew.y = obj.skew.y;
			newObj.rotation = obj.rotation;
			newObj.alpha = obj.alpha;
			newObj.tint = obj.tint;
			newObj.blendMode = obj.blendMode;
			newObj.visible = obj.visible;
			newObj.mask = obj.mask;

			newObj.onResizeCallback = obj.onResizeCallback;

			return newObj;
		};

		let traverse = (obj, parent) => {
			if (obj.type == objectTypes.SPINE) return;
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

		let returnObj = clone(this);
		traverse(this, returnObj);

		if (this.parent) {
			console.log(returnObj);
			this.parent.addChild(returnObj);
		}

		return returnObj;
	}

	//RESIZE
	set onResize(callback) {
		this.pixiObj.onResizeCallback = callback;
	}
	get onResize() {
		return this.pixiObj.onResizeCallback;
	}
	set onResizeCallback(callback) {
		this.onResize = callback;
	}
	get onResizeCallback() {
		return this.onResize;
	}

	///TO SUPPORT PIXI CODES
	anchor = {
		set: (x, y) => {
			this.setOrigin(x, y);
		},
		get: () => {
			return this.pixiObj.anchor;
		},
	};

	pivot = {
		set: (x, y) => {
			this.setOrigin(x, y);
		},
		get: () => {
			return this.pixiObj.pivot;
		},
	};

	///EVENTS
	set buttonMode(value) {
		this.pixiObj.buttonMode = value;
	}
	get buttonMode() {
		return this.pixiObj.buttonMode;
	}
	set interactive(value) {
		this.pixiObj.interactive = value;
	}

	get interactive() {
		return this.pixiObj.interactive;
	}

	setInteractive() {
		this.interactive = true;
	}

	removeInteractive() {
		this.interactive = false;
	}

	on(event, callback) {
		if (!this.interactive) {
			this.interactive = true;
		}
		this.pixiObj.on(event, callback);

		if (!this.eventListeners[event]) {
			this.eventListeners[event] = [];
		}
		this.eventListeners[event].push(callback);
	}

	off(event, callback) {
		this.pixiObj.off(event, callback);

		let list = this.eventListeners[event];
		if (list) {
			let index = list.indexOf(callback);
			if (index > -1) {
				list.splice(index, 1);
			}
		}
	}

	removeAllListeners(event) {
		let list = [];

		if (event) {
			list = this.eventListeners[event] || [];
		} else {
			for (let key in this.eventListeners) {
				list = list.concat(this.eventListeners[key]);
			}
		}
		list.forEach((callback) => {
			this.pixiObj.off(event, callback);
		});
	}
}

export default GameObject;
