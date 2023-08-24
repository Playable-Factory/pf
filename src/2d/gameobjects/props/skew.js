class Skew {
	constructor(gameObject) {
		this.gameObject = gameObject;
	}

	set(x, y) {
		this.gameObject.setSkew(x, y);
	}

	get() {
		return this.gameObject.skew;
	}

	set x(value) {
		this.gameObject.skewX = value;
	}

	get x() {
		return this.gameObject.skewX;
	}

	set y(value) {
		this.gameObject.skewY = value;
	}

	get y() {
		return this.gameObject.skewY;
	}
}

export default Skew;
