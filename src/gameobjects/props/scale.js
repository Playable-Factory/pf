// Scale.js
class Scale {
	constructor(gameObject) {
		this.gameObject = gameObject;
	}

	set(x, y) {
		this.gameObject.pixiObj.scale.x = x;
		this.gameObject.pixiObj.scale.y = y;
	}

	get() {
		return this.gameObject.pixiObj.scale.x;
	}

	set x(value) {
		this.gameObject.pixiObj.scale.x = value;
	}

	get x() {
		return this.gameObject.pixiObj.scale.x;
	}

	set y(value) {
		this.gameObject.pixiObj.scale.y = value;
	}

	get y() {
		return this.gameObject.pixiObj.scale.y;
	}
}

export default Scale;
