class GameObject {
	constructor(pixiObj, x= 0, y =0) {
		this.pixiObj = pixiObj;

        this.setOrigin(0.5, 0.5);
        this.setPosition(x, y);
	}

    addChild(child){
        if(!child.pixiObj){
            console.warn("Child does not have a pixi object");
            return;
        }
        this.pixiObj.addChild(child.pixiObj);
    }

    removeChild(child){
        if(!child.pixiObj){
            console.warn("Child does not have a pixi object");
            return;
        }
        this.pixiObj.removeChild(child.pixiObj);
    }

    remove(){
        this.pixiObj.parent.remove(this.pixiObj);
    }

    get parent(){
        return this.pixiObj.parent;
    }

    set visible(value){
        this.pixiObj.visible = value;
    }

    get visible(){
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

    set scale(value){
        this.pixiObj.scale.x = value;
        this.pixiObj.scale.y = value;
    }

    get scale(){
        return this.pixiObj.scale;
    }

    //HELPER FUNCTIONS
	setAlpha(value) {
		this.pixiObj.alpha = value;

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

	setRotation(value) {
		this.pixiObj.rotation = value;

		return this;
	}

	setSkew(x, y) {
		this.pixiObj.skew.set(x, y);

		return this;
	}

	setOrigin(x, y) {
        if(y === undefined){
            y = x;
        }
		let temp = this.pixiObj.anchor ? this.pixiObj.anchor : this.pixiObj.pivot;
		temp.set(x, y);

		return this;
	}

    destroy(){
        this.pixiObj.destroy();
    }

    //TOP BOTTOM LEFT RIGHT GETTERS AND SETTERS
    get top(){
        let temp = this.pixiObj.anchor ? this.pixiObj.anchor : this.pixiObj.pivot;
        return this.pixiObj.y - this.pixiObj.height * temp.y;
    }

    get bottom(){
        let temp = this.pixiObj.anchor ? this.pixiObj.anchor : this.pixiObj.pivot;
        return this.pixiObj.y + this.pixiObj.height * (1 - temp.y);
    }

    get left(){
        let temp = this.pixiObj.anchor ? this.pixiObj.anchor : this.pixiObj.pivot;
        return this.pixiObj.x - this.pixiObj.width * temp.x;
    }

    get right(){
        let temp = this.pixiObj.anchor ? this.pixiObj.anchor : this.pixiObj.pivot;
        return this.pixiObj.x + this.pixiObj.width * (1 - temp.x);
    }

    //TOP BOTTOM LEFT RIGHT SETTERS
    set top(value){
        let temp = this.pixiObj.anchor ? this.pixiObj.anchor : this.pixiObj.pivot;
        this.pixiObj.y = value + this.pixiObj.height * temp.y;
    }

    set bottom(value){
        let temp = this.pixiObj.anchor ? this.pixiObj.anchor : this.pixiObj.pivot;
        this.pixiObj.y = value - this.pixiObj.height * (1 - temp.y);
    }

    set left(value){
        let temp = this.pixiObj.anchor ? this.pixiObj.anchor : this.pixiObj.pivot;
        this.pixiObj.x = value + this.pixiObj.width * temp.x;
    }

    set right(value){
        let temp = this.pixiObj.anchor ? this.pixiObj.anchor : this.pixiObj.pivot;
        this.pixiObj.x = value - this.pixiObj.width * (1 - temp.x);
    }

    


}

export default GameObject;
