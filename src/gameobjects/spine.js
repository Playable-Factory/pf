// import { AnimatedSprite, Graphics, Loader, TextStyle, Text, Texture, utils, NineSlicePlane } from "pixi.js-legacy";
// import PIXI from "pixi.js-legacy";
import { Spine as PixiSpine } from "pixi-spine";

import GameObject from "./gameObject";
import pfGlobals from "pf.js/src/pfGlobals";
import objectTypes from "./objectTypes";

class Spine extends GameObject {
	constructor(x, y, spineName, skinName, animName, loop) {
		if (!pfGlobals.TextureCache[spineName]) {
			console.warn("Spine not found: " + spineName);
		}
		let pixiObj = new PixiSpine(pfGlobals.TextureCache[spineName].spineData);
		super(pixiObj, x, y);
		pixiObj.gameObject = this;

		this.skinName = skinName || "default";
		this.setSkinByName(this.skinName);

		this.spineName = spineName;

		if (animName) {
			this.play(animName, loop);
		}

		this.isSpine = true;
		this.type = objectTypes.SPINE;
	}

	setSkinByName(skinName) {
		this.pixiObj.skeleton.setSkin(null);
		this.pixiObj.skeleton.setSkinByName(skinName);
		this.pixiObj.skeleton.setSlotsToSetupPose();
		this.baseWidth = this.pixiObj.width;
		this.baseHeight = this.pixiObj.height;
		this.skinName = skinName;
		return this;
	}

	removeSkin() {
		this.skinName = null;
		this.pixiObj.state.clearTracks();
		this.pixiObj.skeleton.setSkin(null);
		this.pixiObj.skeleton.setSlotsToSetupPose();
		return this;
	}

	play(animName, loop, callback) {
		this.pixiObj.state.setAnimation(0, animName, loop);
		this.pixiObj.state.tracks[0].listener = {
			complete: callback,
		};
		this.animName = animName;
		this.loop = loop;
		return this;
	}

	resetAnimation() {
		this.pixiObj.state.clearTracks();
		this.pixiObj.state.setEmptyAnimation(0, 0);
	}

	set timescale(value) {
		this.pixiObj.state.timeScale = value;
	}
	get timescale() {
		return this.pixiObj.state.timeScale;
	}

	get skinNames() {
		return this.pixiObj.spineData.skins.map((skin) => skin.name);
	}

	get animNames() {
		return this.pixiObj.spineData.animations.map((anim) => anim.name);
	}

	set onComplete(callback) {
		this.pixiObj.state.tracks[0].listener.complete = callback;
	}

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

	setTimeScale(value) {
		this.pixiObj.state.timeScale = value;
		return this;
	}
}

export default Spine;
