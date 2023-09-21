import objectTypes from "./objectTypes";
import Position from "./props/position";
import Scale from "./props/scale";
import Skew from "./props/skew";
import pfGlobals from "../pfGlobals";
import { ColorOverlayFilter } from "pixi-filters";

import * as PIXI from "pixi.js-legacy";
import GameObjectFactory from "./factory";

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

		if (!this.pixiObj.anchor) { 
			this.anchor = null
		}

		if (!this.pixiObj.pivot) {
			this.pivot = null;
		}
		// /**
		//  * The anchor point of the PIXI object.
		//  * @type {PIXI.Point|null}
		//  */
		// this.anchor = !pixiObj.anchor ? null : undefined;

		// /**
		//  * The pivot point of the PIXI object.
		//  * @type {PIXI.Point|null}
		//  */
		// this.pivot = !pixiObj.pivot ? null : undefined;
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

		/**
		 * Game Object Factory
		 * @type {GameObjectFactory}
		 */
		this.add = new GameObjectFactory(this);

		// Set the default origin and position
		this.setOrigin(0.5, 0.5);
		this.setPosition(x, y);

		// Alias for setOrigin
		this.setPivot = this.setOrigin;
		this.setPivot(0.5);
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
		return this.pixiObj.children.map((child) => child.gameObject).filter(e=>e);
	}

	/**
	 * Returns the parent GameObject of this GameObject.
	 * @return {GameObject}
	 */
	get parent() {
		return this.pixiObj.parent.gameObject;
	}

	getChildByName (name,deep)
	{ 

		  for (var i = 0, j = this.children.length; i < j; i++) {
        if (this.children[i].name === name) {
            return this.children[i];
        }
    }
    if (deep) {
        for (var i = 0, j = this.children.length; i < j; i++) {
            var child = this.children[i];
            if (!child.getChildByName) {
                continue;
            }
            var target = child.getChildByName(name, true);
            if (target) {
                return target;
            }
        }
    }
    return null;
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

	/**
	 * Sets the rotation angle of the GameObject.
	 * @param {number} value
	 */
	set rotation(value) {
		this.pixiObj.rotation = value;
	}

	/**
	 * Returns the rotation angle of the GameObject.
	 * @return {number}
	 */
	get rotation() {
		return this.pixiObj.rotation;
	}

	/**
	 * Sets the alpha (transparency) of the GameObject.
	 * @param {number} value
	 */
	set alpha(value) {
		this.pixiObj.alpha = value;
	}

	/**
	 * Returns the alpha (transparency) of the GameObject.
	 * @return {number}
	 */
	get alpha() {
		return this.pixiObj.alpha;
	}

	/**
	 * Sets the tint color of the GameObject.
	 * @param {number} value
	 */
	set tint(value) {
		this.pixiObj.tint = value;
	}

	/**
	 * Returns the tint color of the GameObject.
	 * @return {number}
	 */
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

	/**
	 * Sets the tint color and alpha (transparency) of the GameObject.
	 * @param {number} value - The tint color value.
	 */
	setTintFill(value) {
		let filter = new ColorOverlayFilter(value, 1);
		this.pixiObj.filters = [filter];
	}

	/**
	 * Gets the list of filters applied to the GameObject.
	 * @return {PIXI.Filter[]}
	 */
	get filters() {
		return this.pixiObj.filters;
	}

	/**
	 * Sets the list of filters to be applied to the GameObject.
	 * @param {PIXI.Filter[]} value - The list of filters.
	 */
	set filters(value) {
		this.pixiObj.filters = value;
	}

	/**
	 * Gets the blend mode of the GameObject.
	 * @return {number}
	 */
	get blendMode() {
		return this.pixiObj.blendMode;
	}

	/**
	 * Sets the blend mode of the GameObject.
	 * @param {number} value - The blend mode value.
	 */
	set blendMode(value) {
		this.pixiObj.blendMode = value;
	}
	/**
	 * Gets the type of the GameObject.
	 * @return {string}
	 *
	 **/
	_scale = new Scale(this);
	/**
	 * Gets or sets the scale of the GameObject.
	 * @type {Scale}
	 */
	get scale() {
		return this._scale;
	}

	/**
	 * Sets the scale of the GameObject.
	 * @param {number} value - The scale value to set for both X and Y axes.
	 */
	set scale(value) {
		this.pixiObj.scale.x = value;
		this.pixiObj.scale.y = value;
	}

	/**
	 * Gets the X-axis scale of the GameObject.
	 * @return {number}
	 */
	get scaleX() {
		return this.pixiObj.scale.x;
	}

	/**
	 * Sets the X-axis scale of the GameObject.
	 * @param {number} value
	 */
	set scaleX(value) {
		this.pixiObj.scale.x = value;
	}

	/**
	 * Gets the Y-axis scale of the GameObject.
	 * @return {number}
	 */
	get scaleY() {
		return this.pixiObj.scale.y;
	}

	/**
	 * Sets the Y-axis scale of the GameObject.
	 * @param {number} value
	 */
	set scaleY(value) {
		this.pixiObj.scale.y = value;
	}

	/**
	 * Sets the scale values for both X and Y axes.
	 * @param {number} x - The scale value for the X-axis.
	 * @param {number} y - The scale value for the Y-axis.
	 * @return {GameObject}
	 */
	setScale(x, y) {
		if (y === undefined) {
			y = x;
		}
		this.pixiObj.scale.set(x, y);
		return this;
	}
	_skew = new Skew(this);
	/**
	 * Gets or sets the skew of the GameObject.
	 * @type {Skew}
	 */
	get skew() {
		return this._skew;
	}

	/**
	 * Sets the skew of the GameObject.
	 * @param {number} value - The skew value to set for both X and Y axes.
	 */
	set skew(value) {
		this.pixiObj.skew.x = value;
		this.pixiObj.skew.y = value;
	}

	/**
	 * Gets the X-axis skew of the GameObject.
	 * @return {number}
	 */
	get skewX() {
		return this.pixiObj.skew.x;
	}

	/**
	 * Sets the X-axis skew of the GameObject.
	 * @param {number} value
	 */
	set skewX(value) {
		this.pixiObj.skew.x = value;
	}

	/**
	 * Gets the Y-axis skew of the GameObject.
	 * @return {number}
	 */
	get skewY() {
		return this.pixiObj.skew.y;
	}

	/**
	 * Sets the Y-axis skew of the GameObject.
	 * @param {number} value
	 */
	set skewY(value) {
		this.pixiObj.skew.y = value;
	}

	/**
	 * Sets the skew values for both X and Y axes.
	 * @param {number} x - The skew value for the X-axis.
	 * @param {number} y - The skew value for the Y-axis.
	 * @return {GameObject}
	 */
	setSkew(x, y) {
		if (y === undefined) {
			y = x;
		}
		this.pixiObj.skew.set(x, y);
		return this;
	}
	///POSITION///
	_position = new Position(this);
	/**
	 * Gets or sets the position of the GameObject.
	 * @type {Position}
	 */
	get position() {
		return this._position;
	}

	/**
	 * Sets the position of the GameObject.
	 * @param {number} value - The position value to set for both X and Y axes.
	 */
	set position(value) {
		this.pixiObj.x = value;
		this.pixiObj.y = value;
	}

	/**
	 * Gets the X-axis position of the GameObject.
	 * @return {number}
	 */
	get positionX() {
		return this.pixiObj.x;
	}

	/**
	 * Sets the X-axis position of the GameObject.
	 * @param {number} value
	 */
	set positionX(value) {
		this.pixiObj.x = value;
	}

	/**
	 * Gets the Y-axis position of the GameObject.
	 * @return {number}
	 */
	get positionY() {
		return this.pixiObj.position.y;
	}

	/**
	 * Sets the Y-axis position of the GameObject.
	 * @param {number} value
	 */
	set positionY(value) {
		this.pixiObj.position.y = value;
	}
	// set x(value) {
	// 	this.pixiObj.x = value;
	// }

	// get x ()
	// {
	// 	console.log("get x")
	// 	return this.pixiObj.x;
	// }

	// set y (value)
	// {
	// 	this.pixiObj.y = value;
	// }
	/**
	 * Sets the position values for both X and Y axes.
	 * @param {number} x - The position value for the X-axis.
	 * @param {number} y - The position value for the Y-axis.
	 * @return {GameObject}
	 */
	setPosition(x, y) {
		if (y === undefined) {
			y = x;
		}
		if (this.pixiObj.transform) {
			this.pixiObj.position.set(x, y);
		}

		return this;
	}

	/**
	 * Converts a global position to a local position within the GameObject.
	 * @param {PIXI.Point} position - The global position to convert.
	 * @return {PIXI.Point} - The local position within the GameObject.
	 */
	toLocal(position) {
		return this.pixiObj.toLocal(position);
	}

	/**
	 * Gets the global position of the GameObject.
	 * @return {PIXI.Point} - The global position.
	 */
	getGlobalPosition() {
		return this.pixiObj.getGlobalPosition();
	}

	/**
	 * Gets the local position of the GameObject.
	 * @return {PIXI.Point} - The local position.
	 */
	getLocalPosition() {
		return this.pixiObj.getLocalPosition();
	}

	/**
	 * Gets the global position of the GameObject (alias for getGlobalPosition).
	 * @return {PIXI.Point} - The global position.
	 */
	getWorldPosition() {
		return this.pixiObj.getGlobalPosition();
	}

	/**
	 * Sets a mask for the GameObject.
	 * @param {PIXI.DisplayObject} value - The mask to set.
	 */
	set mask(value) {
		this.pixiObj.mask = value;
	}

	/**
	 * Gets the mask applied to the GameObject.
	 * @return {PIXI.DisplayObject} - The mask.
	 */
	get mask() {
		return this.pixiObj.mask;
	}

	/**
	 * Sets a mask for the GameObject.
	 * @param {PIXI.DisplayObject} value - The mask to set.
	 * @return {GameObject}
	 */
	setMask(value) {
		this.pixiObj.mask = value;
		return this;
	}

	/**
	 * Removes the mask from the GameObject.
	 * @return {GameObject}
	 */
	removeMask() {
		this.pixiObj.mask = null;
		return this;
	}

	/**
	 * Sets the rotation angle of the GameObject.
	 * @param {number} value
	 */
	set angle(value) {
		this.pixiObj.angle = value;
	}

	/**
	 * Gets the rotation angle of the GameObject.
	 * @return {number}
	 */
	get angle() {
		return this.pixiObj.angle;
	}

	/**
	 * Sets the rotation angle of the GameObject.
	 * @param {number} value
	 * @return {GameObject}
	 */
	setAngle(value) {
		this.pixiObj.angle = value;
		return this;
	}

	/**
	 * Sets whether the children of the GameObject are sortable.
	 * @param {boolean} value
	 */
	set sortableChildren(value) {
		this.pixiObj.sortableChildren = value;
	}

	/**
	 * Gets whether the children of the GameObject are sortable.
	 * @return {boolean}
	 */
	get sortableChildren() {
		return this.pixiObj.sortableChildren;
	}

	/**
	 * Sets the Z-index of the GameObject.
	 * @param {number} value
	 */
	set zIndex(value) {
		this.pixiObj.zIndex = value;
	}

	/**
	 * Gets the Z-index of the GameObject.
	 * @return {number}
	 */
	get zIndex() {
		return this.pixiObj.zIndex;
	}

	/**
	 * Sets the origin point (anchor or pivot) of the GameObject.
	 * @param {number} value
	 */
	set origin(value) {
		this.setOrigin(value);
	}

	/**
	 * Gets the origin point (anchor or pivot) of the GameObject.
	 * @return {PIXI.Point|null}
	 */
	get origin() {
		return this.pixiObj.anchor || this.pixiObj.pivot;
	}

	/**
	 * Sets the X-coordinate of the origin point (anchor or pivot) of the GameObject.
	 * @param {number} value
	 */
	set originX(value) {
		this.pixiObj.anchor ? (this.pixiObj.anchor.x = value) : (this.pixiObj.pivot.x = value);
	}

	/**
	 * Gets the X-coordinate of the origin point (anchor or pivot) of the GameObject.
	 * @return {number}
	 */
	get originX() {
		return this.pixiObj.anchor ? this.pixiObj.anchor.x : this.pixiObj.pivot.x;
	}

	/**
	 * Sets the Y-coordinate of the origin point (anchor or pivot) of the GameObject.
	 * @param {number} value
	 */
	set originY(value) {
		this.pixiObj.anchor ? (this.pixiObj.anchor.y = value) : (this.pixiObj.pivot.y = value);
	}

	/**
	 * Gets the Y-coordinate of the origin point (anchor or pivot) of the GameObject.
	 * @return {number}
	 */
	get originY() {
		return this.pixiObj.anchor ? this.pixiObj.anchor.y : this.pixiObj.pivot.y;
	}

	/**
	 * Sets the alpha (transparency) of the GameObject.
	 * @param {number} value
	 * @return {GameObject}
	 */
	setAlpha(value) {
		this.pixiObj.alpha = value;
		return this;
	}

	/**
	 * Sets the blend mode of the GameObject.
	 * @param {number} value
	 */
	setBlendMode(value) {
		this.pixiObj.blendMode = value;
	}
	//! TODO:containerda hata var
	/**
	 * Sets the origin point (anchor or pivot) of the GameObject.
	 * @param {number} x - The X-coordinate of the origin point.
	 * @param {number} y - The Y-coordinate of the origin point.
	 */
	setOrigin(x, y) {
		if (y === undefined) {
			y = x;
		}

		if (this.pixiObj.anchor) {
			this.pixiObj.anchor.set(x, y);
		} else {
			this.pixiObj.pivot.set(this.width * x, this.height * y);
		}
		return this;
	}

	/**
	 * Sets the anchor point of the GameObject.
	 * @param {number} x - The X-coordinate of the anchor point.
	 * @param {number} y - The Y-coordinate of the anchor point.
	 */
	setAnchor(x, y) {
		this.setOrigin(x, y);
	}

	/**
	 * Destroys the GameObject.
	 */
	destroy() {
		this.pixiObj.destroy();
	}

	/**
	 * Gets the top position of the GameObject.
	 * @return {number}
	 */
	get top() {
		let temp = this.pixiObj.anchor ? this.pixiObj.anchor : this.pixiObj.pivot;
		return this.pixiObj.y - this.pixiObj.height * temp.y;
	}

	/**
	 * Gets the bottom position of the GameObject.
	 * @return {number}
	 */
	get bottom() {
		let temp = this.pixiObj.anchor ? this.pixiObj.anchor : this.pixiObj.pivot;
		return this.pixiObj.y + this.pixiObj.height * (1 - temp.y);
	}

	/**
	 * Gets the left position of the GameObject.
	 * @return {number}
	 */
	get left() {
		let temp = this.pixiObj.anchor ? this.pixiObj.anchor : this.pixiObj.pivot;
		return this.pixiObj.x - this.pixiObj.width * temp.x;
	}

	/**
	 * Gets the right position of the GameObject.
	 * @return {number}
	 */
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

	/**
	 * Sets the width of the GameObject.
	 * @param {number} width
	 */
	set width(width) {
		this.pixiObj.width = width;
	}

	/**
	 * Gets or sets the width of the GameObject.
	 * @type {number}
	 */
	get width() {
		return this.baseWidth;
	}

	//! TODO: displayWidth ve displayHeight yanlis olabilir
	/**
	 * Gets or sets the scaled width of the GameObject.
	 * @type {number}
	 *
	 */
	set displayWidth(width) {
		this.pixiObj.width = width;
	}

	get displayWidth() {
		return this.pixiObj.width;
	}
	/**
	 * Sets the height of the GameObject.
	 * @param {number} height
	 */
	set height(height) {
		this.pixiObj.height = height;
	}
	/**
	 * Gets or sets the height of the GameObject.
	 * @type {number}
	 */
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
				newObj = pfGlobals.pf2D.add.sprite(obj.x, obj.y, obj.textureName);
			} else if (type == objectTypes.TEXT) {
				newObj = pfGlobals.pf2D.add.text(obj.x, obj.y, obj.text, obj.style);
			} else if (type == objectTypes.ANIMATED_SPRITE) {
				newObj = pfGlobals.pf2D.add.animatedSprite(obj.x, obj.y, obj.animKey, obj.isPlaying, obj.loop);
				newObj.animationSpeed = obj.animationSpeed;
			} else if (type == objectTypes.SPINE) {
				newObj = pfGlobals.pf2D.add.spine(obj.x, obj.y, obj.spineName, obj.skinName, obj.animName, obj.loop);
			} else if (type == objectTypes.CONTAINER) {
				newObj = pfGlobals.pf2D.add.container(obj.x, obj.y);
			} else if (type == objectTypes.RECTANGLE) {
				newObj = pfGlobals.pf2D.add.rectangle(obj.x, obj.y, obj.baseWidth, obj.height, obj.color);
			} else if (type == objectTypes.CIRCLE) {
				newObj = pfGlobals.pf2D.add.circle(obj.x, obj.y, obj.radius, obj.color);
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
	/**
	 * Sets the interactive status of the GameObject.
	 * @param {boolean} value
	 */
	set interactive(value) {
		this.pixiObj.interactive = value;
	}
	/**
	 * Gets or sets the interactive status of the GameObject.
	 * @type {boolean}
	 */
	get interactive() {
		return this.pixiObj.interactive;
	}

	/**
	 * Sets the interactive status of the GameObject.
	 * @param {boolean} interactive
	 * @returns {GameObject} 
	 */
	setInteractive(interactive = true) {
		this.interactive = interactive;
		return this;
	}
	/**
	 * Sets the interactive status of the GameObject.
	 * @returns {GameObject}
	 */
	removeInteractive() {
		this.interactive = false;
		return this;
	}

	/**
	 * Adds an event listener to the GameObject.
	 *
	 * @method on
	 * @param {string} event - The event type to listen for (e.g., "click").
	 * @param {Function} callback - The function to call when the event is triggered.
	 * @param {Object} [context] - The context (this) on which the callback function will be called.
	 */
	on(event, callback, context) {
		if (!this.eventListeners[event]) {
			this.eventListeners[event] = [];
		}

		this.eventListeners[event].push({ callback, context });
		this.pixiObj.on(event, callback, context);
	}

	/**
	 * Removes an event listener from the GameObject.
	 *
	 * @method off
	 * @param {string} event - The event type to remove the listener from (e.g., "click").
	 * @param {Function} callback - The function to remove.
	 * @param {Object} [context] - The context on which the callback was registered.
	 */
	off(event, callback, context) {
		if (!this.eventListeners[event]) {
			return;
		}

		const listeners = this.eventListeners[event];
		const index = listeners.findIndex((listener) => listener.callback === callback && listener.context === context);

		if (index !== -1) {
			listeners.splice(index, 1);
		}

		this.pixiObj.off(event, callback, context);
	}

	/**
	 * Removes all event listeners from the GameObject.
	 *
	 * @method removeAllListeners
	 * @param {string} [event] - The event type to remove all listeners from. If not specified, removes all listeners for all events.
	 */
	removeAllListeners(event) {
		if (!event) {
			for (const eventType in this.eventListeners) {
				if (this.eventListeners.hasOwnProperty(eventType)) {
					this.removeAllListeners(eventType);
				}
			}
		} else {
			if (!this.eventListeners[event]) {
				return;
			}

			const listeners = this.eventListeners[event];

			for (const listener of listeners) {
				this.pixiObj.off(event, listener.callback, listener.context);
			}

			listeners.length = 0;
		}
	}

	/**
	 * Triggers an event on the GameObject.
	 *
	 * @method trigger
	 * @param {string} event - The event type to trigger.
	 * @param {Object} [data] - Additional data to pass to the event handler.
	 */
	trigger(event, data) {
		this.pixiObj.emit(event, data);
	}

	/**
	 * Triggers a custom event on the GameObject.
	 *
	 * @method triggerCustomEvent
	 * @param {string} event - The custom event type to trigger.
	 * @param {Object} [data] - Additional data to pass to the event handler.
	 */
	triggerCustomEvent(event, data) {
		this.trigger(event, data);
	}

	/**
	 * Updates the GameObject.
	 * @param {number} dt - The time elapsed in milliseconds since the last frame.
	 */
	update(dt) {
	}

	/**
	 * Called when the GameObject is added to the scene.
	 */
	onAddedToScene() {}

	/**
	 * Called when the GameObject is removed from the scene.
	 */
	onRemovedFromScene() {}
}

export default GameObject;
