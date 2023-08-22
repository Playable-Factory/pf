import GameObject from "./gameObject";
import pfGlobals from "../pfGlobals";
import objectTypes from "./objectTypes";

class AnimatedSprite extends GameObject {
	constructor(x, y, animKey, autoplay = true, loop = false) {
		let atlasUUID = pfGlobals.allAnims[animKey];
		if (!atlasUUID) {
			console.warn("Animation not found: " + animKey);
		}

		let textures = pfGlobals.Resources[atlasUUID].animations[animKey];
		let pixiObj = new PIXI.AnimatedSprite(textures);
		super(pixiObj, x, y);
		this.animKey = animKey;

		pixiObj.gameObject = this;
		autoplay && this.play(null, loop);

		this.isAnimatedSprite = true;
		this.type = objectTypes.ANIMATED_SPRITE;
	}

	//TEXTURE
	play(animKey, loop) {
		if (animKey) {
			let atlasUUID = pfGlobals.allAnims[animKey];
			this.pixiObj.textures = pfGlobals.Resources[atlasUUID].animations[animKey];

			this.baseWidth = this.pixiObj.texture.orig.width;
			this.baseHeight = this.pixiObj.texture.orig.height;
			this.animKey = animKey;
		}

		this.pixiObj.play();
		this.pixiObj.loop = loop;
	}

	stop() {
		this.pixiObj.stop();
	}

	gotoAndPlay(frameNumber) {
		this.pixiObj.gotoAndPlay(frameNumber);
	}

	gotoAndStop(frameNumber) {
		this.pixiObj.gotoAndStop(frameNumber);
	}

	//TIMESCALE
	set animationSpeed(value) {
		this.pixiObj.animationSpeed = value;
	}
	get animationSpeed() {
		return this.pixiObj.animationSpeed;
	}
	setAnimationSpeed(value) {
		this.pixiObj.animationSpeed = value;
	}

	//LOOP
	set loop(value) {
		this.pixiObj.loop = value;
	}
	get loop() {
		return this.pixiObj.loop;
	}
	setLoop(value) {
		this.pixiObj.loop = value;
	}

	get isPlaying() {
		return this.pixiObj.playing;
	}

	//CURRENT FRAME
	set currentFrame(value) {
		this.pixiObj.currentFrame = value;
	}
	get currentFrame() {
		return this.pixiObj.currentFrame;
	}

	get totalFrames() {
		return this.pixiObj.totalFrames;
	}

	///ANIMATION EVENTS
	set onComplete(value) {
		this.pixiObj.onComplete = value;
	}
	get onComplete() {
		return this.pixiObj.onComplete;
	}
	set onFrameChange(value) {
		this.pixiObj.onFrameChange = value;
	}
	get onFrameChange() {
		return this.pixiObj.onFrameChange;
	}
	set onLoop(value) {
		this.pixiObj.onLoop = value;
	}
	get onLoop() {
		return this.pixiObj.onLoop;
	}
}

export default AnimatedSprite;
