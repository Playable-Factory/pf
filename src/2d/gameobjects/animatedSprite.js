import GameObject from "./gameObject";
import pfGlobals from "../pfGlobals";
import objectTypes from "./objectTypes";
/**
 * The AnimatedSprite class represents game objects with animated sprites.
 * This class is used to create animated objects working with PIXI.js.
 *
 * @extends GameObject
 */
class AnimatedSprite extends GameObject {
	/**
	 * Creates a new AnimatedSprite instance.
	 * @param {number} x - The X coordinate of the sprite.
	 * @param {number} y - The Y coordinate of the sprite.
	 * @param {string} animKey - The name of the animation to play.
	 * @param {boolean} [autoplay=true] - Determines if the animation should automatically start playing.
	 * @param {boolean} [loop=false] - Determines if the animation should loop.
	 */
	constructor(x, y, animKey, autoplay = true, loop = false) {
		/**
		 * The name of the animation to play.
		 * @type {string}
		 */
		this.animKey = animKey;

		// Get the UUID of the texture atlas for the animation
		let atlasUUID = pfGlobals.allAnims[animKey];

		// If the texture atlas is not found, log a warning message
		if (!atlasUUID) {
			console.warn("Animation not found: " + animKey);
		}

		// Get the textures for the animation from the texture atlas
		let textures = pfGlobals.Resources[atlasUUID].animations[animKey];

		// Create a new PIXI AnimatedSprite object with the textures
		let pixiObj = new PIXI.AnimatedSprite(textures);

		// Call the parent constructor with the PIXI AnimatedSprite object and the coordinates
		super(pixiObj, x, y);

		// Set the gameObject property of the PIXI AnimatedSprite object to this instance
		pixiObj.gameObject = this;

		// If autoplay is true, start playing the animation
		if (autoplay) {
			this.play(null, loop);
		}

		/**
		 * Determines if this object is an AnimatedSprite.
		 * @type {boolean}
		 */
		this.isAnimatedSprite = true;

		/**
		 * The type of this object.
		 * @type {objectTypes}
		 */
		this.type = objectTypes.ANIMATED_SPRITE;
	}

	/**
	 * Starts or plays the specified animation.
	 * @param {string} animKey - The name of the animation to play.
	 * @param {boolean} loop - Determines if the animation should loop.
	 */
	play(animKey, loop) {
		// If a new animation is specified, change the textures to the new animation's textures
		if (animKey) {
			let atlasUUID = pfGlobals.allAnims[animKey];
			this.pixiObj.textures = pfGlobals.Resources[atlasUUID].animations[animKey];

			// Set the base width and height of the sprite to the new texture's original width and height
			this.baseWidth = this.pixiObj.texture.orig.width;
			this.baseHeight = this.pixiObj.texture.orig.height;

			// Set the animKey property to the new animation's name
			this.animKey = animKey;
		}

		// Start playing the animation
		this.pixiObj.play();

		// Set the loop property of the animation
		this.pixiObj.loop = loop;
	}

	/**
	 * Stops the animation.
	 */
	stop() {
		this.pixiObj.stop();
	}

	/**
	 * Initiates going to and playing a specific frame.
	 * @param {number} frameNumber - The frame number to go to.
	 */
	gotoAndPlay(frameNumber) {
		this.pixiObj.gotoAndPlay(frameNumber);
	}

	/**
	 * Stops at a specific frame.
	 * @param {number} frameNumber - The frame number to stop at.
	 */
	gotoAndStop(frameNumber) {
		this.pixiObj.gotoAndStop(frameNumber);
	}

	/**
	 * Sets the animation speed.
	 * @param {number} value - The new animation speed.
	 */
	set animationSpeed(value) {
		this.pixiObj.animationSpeed = value;
	}

	/**
	 * Gets the animation speed.
	 * @returns {number} The animation speed.
	 */
	get animationSpeed() {
		return this.pixiObj.animationSpeed;
	}

	/**
	 * Sets the animation speed (alternative method).
	 * @param {number} value - The new animation speed.
	 */
	setAnimationSpeed(value) {
		this.pixiObj.animationSpeed = value;
	}

	/**
	 * Sets the loop mode.
	 * @param {boolean} value - The new loop value.
	 */
	set loop(value) {
		this.pixiObj.loop = value;
	}

	/**
	 * Gets the loop mode.
	 * @returns {boolean} The loop value.
	 */
	get loop() {
		return this.pixiObj.loop;
	}

	/**
	 * Sets the loop mode (alternative method).
	 * @param {boolean} value - The new loop value.
	 */
	setLoop(value) {
		this.pixiObj.loop = value;
	}

	/**
	 * Checks if the animation is currently playing.
	 * @returns {boolean} True if the animation is playing, otherwise false.
	 */
	get isPlaying() {
		return this.pixiObj.playing;
	}

	/**
	 * Sets the current frame number.
	 * @param {number} value - The new frame number.
	 */
	set currentFrame(value) {
		this.pixiObj.currentFrame = value;
	}

	/**
	 * Gets the current frame number.
	 * @returns {number} The current frame number.
	 */
	get currentFrame() {
		return this.pixiObj.currentFrame;
	}

	/**
	 * Gets the total number of frames.
	 * @returns {number} The total number of frames.
	 */
	get totalFrames() {
		return this.pixiObj.totalFrames;
	}

	/**
	 * Sets the function to run when the animation completes.
	 * @param {Function} value - The function to run on completion.
	 */
	set onComplete(value) {
		this.pixiObj.onComplete = value;
	}

	/**
	 * Gets the function to run when the animation completes.
	 * @returns {Function} The function to run on completion.
	 */
	get onComplete() {
		return this.pixiObj.onComplete;
	}

	/**
	 * Sets the function to run when the frame changes.
	 * @param {Function} value - The function to run when the frame changes.
	 */
	set onFrameChange(value) {
		this.pixiObj.onFrameChange = value;
	}

	/**
	 * Gets the function to run when the frame changes.
	 * @returns {Function} The function to run when the frame changes.
	 */
	get onFrameChange() {
		return this.pixiObj.onFrameChange;
	}

	/**
	 * Sets the function to run when the loop starts.
	 * @param {Function} value - The function to run when the loop starts.
	 */
	set onLoop(value) {
		this.pixiObj.onLoop = value;
	}

	/**
	 * Gets the function to run when the loop starts.
	 * @returns {Function} The function to run when the loop starts.
	 */
	get onLoop() {
		return this.pixiObj.onLoop;
	}
}

export default AnimatedSprite;
