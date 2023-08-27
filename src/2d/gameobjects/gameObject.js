// import gx from "pf.js/src";
import objectTypes from "./objectTypes";
import Position from "./props/position";
import Scale from "./props/scale";
import Skew from "./props/skew";
import pfGlobals from "../pfGlobals";
import { ColorOverlayFilter } from "pixi-filters";

import * as PIXI from "pixi.js-legacy";
/**
 * Base class for game objects.
 *
 * @class GameObject
 */
class GameObject {
	/**
	 * Creates an instance of GameObject.
	 *
	 * @constructor
	 * @param {PIXI.DisplayObject} pixiObj - The PIXI display object associated with this game object.
	 * @param {number} [x=0] - X position of the game object.
	 * @param {number} [y=0] - Y position of the game object.
	 */
	constructor(pixiObj, x = 0, y = 0) {
		/**
		 * The PIXI display object associated with this game object.
		 * @type {PIXI.DisplayObject}
		 */
		this.pixiObj = pixiObj;

		/**
		 * The anchor point of the PIXI object.
		 * @type {PIXI.Point|null}
		 */
		this.anchor = !pixiObj.anchor ? null : undefined;

		/**
		 * The pivot point of the PIXI object.
		 * @type {PIXI.Point|null}
		 */
		this.pivot = !pixiObj.pivot ? null : undefined;

		/**
		 * The base width of the PIXI object.
		 * @type {number}
		 */
		this.baseWidth = this.pixiObj.width;

		/**
		 * The base height of the PIXI object.
		 * @type {number}
		 */
		this.baseHeight = this.pixiObj.height;

		/**
		 * Event listeners attached to the game object.
		 * @type {Object.<string, Function[]>}
		 */
		this.eventListeners = {};

		// Set the default origin and position
		this.setOrigin(0.5, 0.5);
		this.setPosition(x, y);

		// Alias for setOrigin
		this.setPivot = this.setOrigin;
	}

	/**
	 * Adds a child PIXI display object to the current game object.
	 *
	 * @method addChild
	 * @param {GameObject} child - The child game object to add.
	 */
	addChild(child) {
		const hasPixiObject = !!child.pixiObj;

		if (!hasPixiObject) {
			console.warn("Child does not have a pixi object");
			return;
		}

		this.pixiObj.addChild(child.pixiObj);
	}

	/**
	 * Removes a child PIXI display object from the current game object.
	 *
	 * @method removeChild
	 * @param {GameObject} child - The child game object to remove.
	 */
	removeChild(child) {
		const hasPixiObject = !!child.pixiObj;

		if (!hasPixiObject) {
			console.warn("Child does not have a pixi object");
			return;
		}

		this.pixiObj.removeChild(child.pixiObj);
	}

	/**
	 * Attaches a child game object to the current game object and repositions it to match world position.
	 *
	 * @method attach
	 * @param {GameObject} child - The child game object to attach.
	 */
	attach(child) {
		const worldPosition = child.getGlobalPosition();

		// Adds the child game object and repositions it to match the world position
		this.addChild(child);
		const newPosition = this.toLocal(worldPosition);
		child.setPosition(newPosition.x, newPosition.y);
	}

	/**
	 * Removes the current game object from its parent.
	 *
	 * @method remove
	 */
	remove() {
		this.pixiObj.parent.remove(this.pixiObj);
	}

	/**
	 * Returns an array of child GameObjects associated with this GameObject.
	 * @return {GameObject[]}
	 */
	get children() {
		return this.pixiObj.children.map((child) => child.gameObject);
	}

	/**
	 * Returns the parent GameObject of this GameObject.
	 * @return {GameObject}
	 */
	get parent() {
		return this.pixiObj.parent.gameObject;
	}

	/**
	 * Sets the visibility of the GameObject.
	 * @param {boolean} value
	 */
	set visible(value) {
		this.pixiObj.visible = value;
	}

	/**
	 * Returns the visibility status of the GameObject.
	 * @return {boolean}
	 */
	get visible() {
		return this.pixiObj.visible;
	}

	/**
	 * Sets the x-coordinate of the GameObject.
	 * @param {number} value
	 */
	set x(value) {
		this.pixiObj.x = value;
	}

	/**
	 * Returns the x-coordinate of the GameObject.
	 * @return {number}
	 */
	get x() {
		return this.pixiObj.x;
	}

	/**
	 * Sets the y-coordinate of the GameObject.
	 * @param {number} value
	 */
	set y(value) {
		this.pixiObj.y = value;
	}

	/**
	 * Returns the y-coordinate of the GameObject.
	 * @return {number}
	 */
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
	setRotation(value) {
		this.pixiObj.rotation = value;

		return this;
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

	toLocal(position) {
		return this.pixiObj.toLocal(position);
	}

	getGlobalPosition() {
		return this.pixiObj.getGlobalPosition();
	}

	getLocalPosition() {
		return this.pixiObj.getLocalPosition();
	}

	getWorldPosition() {
		return this.pixiObj.getGlobalPosition();
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
	setAngle(value) {
		this.pixiObj.angle = value;
		return this;
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

	setOrigin(x, y) {
		if (y === undefined) {
			y = x;
		}

		if (this.pixiObj.anchor) {
			this.pixiObj.anchor.set(x, y);
		} else {
			this.pixiObj.pivot.set(this.width * x, this.height * y);
		}
		// let temp = this.pixiObj.anchor ? this.pixiObj.anchor : this.pixiObj.pivot;
		// temp.set(x, y);

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

	///CLONE
	clone() {
		let clone = (obj) => {
			let type = obj.type;
			let newObj = null;

			if (type == objectTypes.SPRITE) {
				newObj = pfGlobals.gx.add.sprite(obj.x, obj.y, obj.textureName);
			} else if (type == objectTypes.TEXT) {
				newObj = pfGlobals.gx.add.text(obj.x, obj.y, obj.text, obj.style);
			} else if (type == objectTypes.ANIMATED_SPRITE) {
				newObj = pfGlobals.gx.add.animatedSprite(obj.x, obj.y, obj.animKey, obj.isPlaying, obj.loop);
				newObj.animationSpeed = obj.animationSpeed;
			} else if (type == objectTypes.SPINE) {
				newObj = pfGlobals.gx.add.spine(obj.x, obj.y, obj.spineName, obj.skinName, obj.animName, obj.loop);
			} else if (type == objectTypes.CONTAINER) {
				newObj = pfGlobals.gx.add.container(obj.x, obj.y);
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
