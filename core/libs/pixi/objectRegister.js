class ObjectRegister
{
	constructor(scene) {
		this.scene = scene
		this.objects = []

	}

	add(config, ...args) {
		const scene = this.scene;
		let type = config.type
		type = type.charAt(0).toUpperCase()
			+ type.toLocaleLowerCase().substring(1)
			
		
		const temp = new PIXI[type](...args);
		
		if (temp.anchor) temp.anchor.set(0.5);

		temp.segment = config.segment;
		temp.name = config.name;
		temp.objectType = config.type;

		temp.preResizeFunctions = config.preResize || [];

		temp.getResizePos = function (w, h, object)
		{
			if (!w) w = scene.lastWidth;
			if (!h) h = scene.lastHeight;
			if(!object) object = temp;

			return config.position.bind(object)(w, h, object);
		};

		temp.getResizeScale = function (w, h, object) {
			if (!w) w = scene.lastWidth;
			if (!h) h = scene.lastHeight;
			if(!object) object = temp;

			return config.scale.bind(object)(w, h, object);

		};

		//temp.getResizeScale = config.scale;
		// temp.getResizePos = config.position;

		temp.postResizeFunctions = config.postResize || [];

		if (config.init) {
			temp.init = config.init;
			temp.init(temp);
		}

		if (temp.getResizeScale && temp.getResizePos) {
			scene.resizeManager.add(temp, function (w, h) {
				if (!w) w = scene.lastWidth;
				if (!h) h = scene.lastHeight;

				this.preResizeFunctions.forEach(function (f) {
					return f(this);
				}, this);
				const { scaleX, scaleY } = this.getResizeScale(w, h, this);
				this.resizeScale = Math.min(scaleX, scaleY);
				this.scale.set(scaleX, scaleY);
				const { x, y } = this.getResizePos(w, h, this);
				this.position.set(x, y);
				this.postResizeFunctions.forEach(function (f) {
					return f(this);
				}, this);
			});
		} else if (temp.getResizeScale && !temp.getResizePos) {
			scene.resizeManager.add(temp, function (w, h) {
				this.preResizeFunctions.forEach(function (f) {
					return f(this);
				}, this);
				const { scaleX, scaleY } = this.getResizeScale(w, h, this);
				this.resizeScale = Math.min(scaleX, scaleY);
				this.scale.set(scaleX, scaleY);
				this.postResizeFunctions.forEach(function (f) {
					return f(this);
				}, this);
			});
		} else if (!temp.getResizeScale && temp.getResizePos) {
			scene.resizeManager.add(temp, function (w, h) {
				this.preResizeFunctions.forEach(function (f) {
					return f(this);
				}, this);
				const { x, y } = this.getResizePos(w, h, this	);
				this.position.set(x, y);
				this.postResizeFunctions.forEach(function (f) {
					return f(this);
				}, this);
			});
		} else {
			scene.resizeManager.add(temp, function (w, h) {
				this.preResizeFunctions.forEach(function (f) {
					return f(this);
				}, this);
				this.postResizeFunctions.forEach(function (f) {
					return f(this);
				}, this);
			});
		}

		//!if (temp.getBounds) temp.bounds = temp.getBounds();

		this.objects.push(temp);
		this.scene.addChild(temp);
		return temp;
	}

	registerObj(
		config = {
			segment: "game",
			name: "temp",
			type: "type",
			obj: {},
		}
	) {
		let temp = config.obj;
		temp.segment = config.segment;
		temp.name = config.name;
		temp.objectType = config.type;

		this.objects.push(temp);

		return temp;
	}

	getObject(segment = "game", name = "temp", isArray = false) {
		const objArr = [...this.objects].filter((o) => {
			return o.segment === segment && o.name === name;
		});
		if (!isArray) {
			return objArr[0];
		} else {
			return objArr;
		}
	}

	getSegment(segment = "game", isArray = true) {
		const objArr = [...this.objects].filter((o) => {
			return o.segment === segment;
		});
		if (!isArray) {
			return objArr[0];
		} else {
			return objArr;
		}
	}

	removeAll() {
		this.objects.forEach((obj) => {
			this.directRemove(obj);
		});

		this.objects = [];
	}

	removeSegment(segment = "game") {
		for (let t of this.getSegment(segment)) {
			this.removeObject(segment, t.name);
		}
	}

	removeObject(segment = "game", name = "temp", isArray = false) {
		const scene = this.scene;
		const objArr = this.getObject(segment, name, true);

		for (let obj of objArr) {
			scene.tweens.killTweensOf(obj);
			scene.resizeManager.remove(obj);
			if (obj.resize) delete obj.resize;
			if (obj.destroy) obj.destroy();
			this.objects = this.objects.filter((o) => {
				return o !== obj;
			});
		}
		if (!isArray) {
			return objArr[0];
		} else {
			return objArr;
		}
	}

	directRemove(obj) {
		const scene = this.scene;
		scene.tweens.killTweensOf(obj);
		scene.resizeManager.remove(obj);
		if (obj.resize) delete obj.resize;
		if (obj.destroy) obj.destroy();
		this.objects = this.objects.filter((o) => {
			return o !== obj;
		});
	}
}

export default ObjectRegister;
