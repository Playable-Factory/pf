class ResizeManager {
	constructor(scene) {
		
		this.scene = scene;
		this.objects = [];
	}

	add(
		object = {},
		resizeFunction = () => {
			return false;
		}
	)
	{
		this.objects.push(object);
		object.resize = resizeFunction;
		object.resize(this.scene.lastWidth, this.scene.lastHeight);
	}

	remove(object = {}) {
		let objects = this.objects;
		let objectIndex = objects.indexOf(object);
		if (objectIndex === -1) return;
		objects.splice(objectIndex, 1);
	}

	resize(w = 0, h = 0) {
		if (!w) w = this.scene.lastWidth;
		if (!h) h = this.scene.lastHeight;

		this.objects.forEach((object) => {
			object.resize && object.resize(w, h);
		
		});
	}

	reset() {
		for (let o of this.objects) {
			o.resize = null;
		}

		this.objects = [];
	}
}

export default ResizeManager;
