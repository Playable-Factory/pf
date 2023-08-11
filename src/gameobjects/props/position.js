class Position {
	constructor(gameObject) {
		this.gameObject = gameObject;
	}

	set(x, y) {
		this.gameObject.setPosition(x, y);
	}

	get() {
		return this.gameObject.position;
	}

	set x(value) {
		this.gameObject.positionX = value;
	}

	get x() {
		return this.gameObject.positionX;
	}

	set y(value) {
		this.gameObject.positionY = value;
	}

	get y() {
		return this.gameObject.positionY;
	}
}

export default Position;
