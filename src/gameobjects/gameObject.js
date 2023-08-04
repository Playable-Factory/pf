class GameObject {
	constructor(pixiObj, x = 0, y = 0) {
		this.pixiObj = pixiObj;

		this.baseWidth = this.pixiObj.width;
		this.baseHeight = this.pixiObj.height;

		this.setOrigin(0.5, 0.5);
		this.setPosition(x, y);

		this.setPivot = this.setOrigin;
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
	///TINT
	get blendMode() {
		return this.pixiObj.blendMode;
	}

	set blendMode(value) {
		this.pixiObj.blendMode = value;
	}
	///SCALE
	set scale(value) {
		this.pixiObj.scale.x = value;
		this.pixiObj.scale.y = value;
	}

	get scale() {
		return this.pixiObj.scale.x;
	}
	///SKEW
	set skew(value) {
		this.pixiObj.skew.x = value;
		this.pixiObj.skew.y = value;
	}

	get skew() {
		return this.pixiObj.skew.x;
	}

	//HELPER FUNCTIONS
	setAlpha(value) {
		this.pixiObj.alpha = value;
		return this;
	}
	setTint(value) {
		this.pixiObj.tint = value;
		return this;
	}
	setBlendMode(value) {
		this.pixiObj.blendMode = value;
		return this;
	}

	setPosition(x, y) {
		this.pixiObj.x = x;
		this.pixiObj.y = y;
	}

	setScale(x, y) {
		if (y === undefined) {
			y = x;
		}
		this.pixiObj.scale.set(x, y);
		return this;
	}

	setSkew(x, y) {
		if (y === undefined) {
			y = x;
		}
		this.pixiObj.skew.set(x, y);
		return this;
	}

	setRotation(value) {
		this.pixiObj.rotation = value;

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

	///TO SUPPORT PIXI CODES
	scale = {
		set: (x, y) => {
			this.setScale(x, y);
		},
		get: () => {
			return this.pixiObj.scale.x;
		},
	};

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
}

export default GameObject;
