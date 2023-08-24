class Scale {
	constructor(gameObject) {
		this.gameObject = gameObject;
	}

	set(x, y) {
		this.gameObject.setScale(x, y);
	}

	get() {
		return this.gameObject.scale;
	}

	set x(value) {
		this.gameObject.scaleX = value;
	}

	get x() {
		return this.gameObject.scaleX;
	}

	set y(value) {
		this.gameObject.scaleY = value;
	}

	get y() {
		return this.gameObject.scaleY;
	}
}

export default Scale;
