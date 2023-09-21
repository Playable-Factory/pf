// import { AnimatedSprite, Graphics, Loader, TextStyle, Text, Texture, utils, NineSlicePlane } from "pixi.js-legacy";
// import PIXI from "pixi.js-legacy";
import { Spine as PixiSpine } from "pixi-spine";

import GameObject from "./gameObject";
import pfGlobals from "../pfGlobals";
import objectTypes from "./objectTypes";

/**
 * Represents a Spine game object.
 * @extends GameObject
 */
class Spine extends GameObject {
	/**
	 * Creates a Spine game object.
	 * @param {number} x - The x coordinate of the Spine game object.
	 * @param {number} y - The y coordinate of the Spine game object.
	 * @param {string} spineName - The name of the Spine object.
	 * @param {string} [skinName=default] - The name of the skin to use.
	 * @param {string} [animName] - The name of the animation to play.
	 * @param {boolean} [loop=true] - Whether the animation should loop.
	 */
	constructor(x, y, spineName, skinName, animName, loop) {
		if (!pfGlobals.TextureCache[spineName]) {
			console.warn("Spine not found: " + spineName);
		}
		let pixiObj = new PixiSpine(pfGlobals.TextureCache[spineName].spineData);
		super(pixiObj, x, y);
		pixiObj.gameObject = this;

		//this.pixiObj = pixiObj;
		
		this.skinName = skinName || "default";
		this.setSkinByName(this.skinName);

		this.spineName = spineName;

		if (animName) {
			this.play(animName, loop);
		}

		this.isSpine = true;
		this.type = objectTypes.SPINE;
	}



	get skeleton ()
	{
		return this.pixiObj.skeleton;
	}

	get state ()
	{
		return this.pixiObj.state;
	}


	/**
	 * Sets the skin of the Spine game object by name.
	 * @param {string} skinName - The name of the skin to set.
	 * @returns {Spine} The Spine game object.
	 */
	setSkinByName(skinName) {
		this.pixiObj.skeleton.setSkin(null);
		this.pixiObj.skeleton.setSkinByName(skinName);
		this.pixiObj.skeleton.setSlotsToSetupPose();
		this.baseWidth = this.pixiObj.width;
		this.baseHeight = this.pixiObj.height;
		this.skinName = skinName;
		return this;
	}
	/**
	 * Removes the skin from the Spine game object.
	 * @returns {Spine} The Spine game object.
	 */
	removeSkin() {
		this.skinName = null;
		this.pixiObj.state.clearTracks();
		this.pixiObj.skeleton.setSkin(null);
		this.pixiObj.skeleton.setSlotsToSetupPose();
		return this;
	}
	/**
	 * Plays an animation on the Spine game object.
	 * @param {string} animName - The name of the animation to play.
	 * @param {boolean} [loop=true] - Whether the animation should loop.
	 * @param {function} [callback] - A function to call when the animation completes.
	 * @returns {Spine} The Spine game object.
	 */
	play(animName, loop, callback) {
		this.pixiObj.state.setAnimation(0, animName, loop);
		this.pixiObj.state.tracks[0].listener = {
			complete: callback,
		};
		this.animName = animName;
		this.loop = loop;
		return this;
	}
	/**
	 * Resets the animation on the Spine game object.
	 */
	resetAnimation() {
		this.pixiObj.state.clearTracks();
		this.pixiObj.state.setEmptyAnimation(0, 0);
	}

	/**
	 * Sets the time scale of the Spine game object.
	 * @param {number} value - The time scale value to set.
	 */
	set timescale(value) {
		this.pixiObj.state.timeScale = value;
	}
	/**
	 * Gets the time scale of the Spine game object.
	 * @returns {number} The time scale value.
	 */
	get timescale() {
		return this.pixiObj.state.timeScale;
	}

	/**
	 * Gets the names of the skins available for the Spine game object.
	 * @returns {string[]} An array of skin names.
	 */
	get skinNames() {
		return this.pixiObj.spineData.skins.map((skin) => skin.name);
	}

	/**
	 * Gets the names of the animations available for the Spine game object.
	 * @returns {string[]} An array of animation names.
	 */
	get animNames() {
		return this.pixiObj.spineData.animations.map((anim) => anim.name);
	}
	/**
	 * Sets a function to call when the animation completes.
	 * @param {function} callback - The function to call.
	 */
	set onComplete(callback) {
		this.pixiObj.state.tracks[0].listener.complete = callback;
	}

	/**
	 * Adds a listener to the Spine game object.
	 * @param {object} props - An object containing listener functions.
	 * @param {function} [props.event] - A function to call when an event is fired.
	 * @param {function} [props.complete] - A function to call when the animation completes.
	 * @param {function} [props.start] - A function to call when the animation starts.
	 * @param {function} [props.end] - A function to call when the animation ends.
	 * @param {function} [props.dispose] - A function to call when the animation is disposed.
	 * @param {function} [props.interrupted] - A function to call when the animation is interrupted.
	 */
	addListener(
		props = {
			event: function (entry, event) {
				console.log("event fired " + event.data + " at track" + entry.trackIndex);
			},
			complete: function (entry) {
				console.log("track " + entry.trackIndex + " completed " + entry.loopsCount() + " times");
			},
			start: function (entry) {
				console.log("animation is set at " + entry.trackIndex);
			},
			end: function (entry) {
				console.log("animation was ended at " + entry.trackIndex);
			},
			dispose: function (entry) {
				console.log("animation was disposed at " + entry.trackIndex);
			},
			interrupted: function (entry) {
				console.log("animation was interrupted at " + entry.trackIndex);
			},
		}
	) {
		this.pixiObj.state.addListener(props);
		this.listener = this.pixiObj.state.listeners[0];
	}
	/**
	 * Sets the time scale of the Spine game object.
	 * @param {number} value - The time scale value to set.
	 * @returns {Spine} The Spine game object.
	 */
	setTimeScale(value) {
		this.pixiObj.state.timeScale = value;
		return this;
	}
}

export default Spine;
