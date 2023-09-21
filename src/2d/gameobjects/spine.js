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

		this.#modifyUpdate();

		if (animName) {
			this.play(animName, loop);
		}

		this.isSpine = true;
		this.type = objectTypes.SPINE;

		this.animationQueue = [];
	}

	/**
	 * Gets the skeleton of the Spine game object.
	 * @returns {object} The skeleton.
	 */
	get skeleton() {
		return this.pixiObj.skeleton;
	}

	/**
	 * Gets the state of the Spine game object.
	 * @returns {object} The state.
	 */
	get state() {
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
		let entry = this.pixiObj.state.setAnimation(0, animName, loop);
		entry.callback = callback;
		this.animName = animName;
		this.animQueue = [
			{
				name: animName,
				loop: loop,
				callback: callback,
			},
		];
		return this;
	}

	/**
	 * Queues an animation on the Spine game object.
	 * @param {string} animName - The name of the animation to play.
	 * @param {boolean} [loop=true] - Whether the animation should loop.
	 * @param {function} [callback] - A function to call when the animation completes.
	 * @param {number} [delay] - The delay before the animation plays. If specified, the animation will stop existing animation and play, after the delay.
	 * @returns {Spine} The Spine game object.
	 */
	queue(animName, loop, delay, callback, cycle) {
		let entry = this.pixiObj.state.addAnimation(0, animName, loop, delay);
		this.animQueue.push({
			name: animName,
			loop: loop,
			delay: delay,
			callback: callback,
			cycle: cycle,
		});

		if (cycle) {
			entry.callback = () => {
				callback();
				this.#cycleBack();
			};
		} else {
			entry.callback = callback;
		}

		return this;
	}

	#cycleBack() {
		this.animQueue.forEach((entry, index) => {
			if (index == 0) {
				let track = this.pixiObj.state.setAnimation(0, entry.name, entry.loop);
				track.callback = entry.callback;
			} else {
				let track = this.pixiObj.state.addAnimation(0, entry.name, entry.loop, entry.delay);
				if (entry.cycle) {
					track.callback = () => {
						entry.callback();
						this.#cycleBack();
					};
				} else {
					track.callback = entry.callback();
				}
			}
		});
	}

	#modifyUpdate() {
		this.pixiObj.state.update = function (delta) {
			delta *= this.timeScale;
			var tracks = this.tracks;
			for (var i = 0, n = tracks.length; i < n; i++) {
				var current = tracks[i];
				if (!current) continue;
				current.animationLast = current.nextAnimationLast;
				current.trackLast = current.nextTrackLast;
				var currentDelta = delta * current.timeScale;
				if (current.delay > 0) {
					current.delay -= currentDelta;
					if (current.delay > 0) continue;
					currentDelta = -current.delay;
					current.delay = 0;
				}
				if (current.callback)
					current.listener = {
						complete: () => {
							current.callback();
						},
					};
				var next = current.next;
				if (next) {
					// When the next entry's delay is passed, change to the next entry, preserving leftover time.
					var nextTime = current.trackLast - next.delay;
					if (nextTime >= 0) {
						next.delay = 0;
						next.trackTime += current.timeScale == 0 ? 0 : (nextTime / current.timeScale + delta) * next.timeScale;
						current.trackTime += currentDelta;
						this.setCurrent(i, next, true);

						while (next.mixingFrom) {
							next.mixTime += delta;
							next = next.mixingFrom;
						}

						continue;
					}
				} else if (current.trackLast >= current.trackEnd && !current.mixingFrom) {
					tracks[i] = null;
					this.queue.end(current);
					this.clearNext(current);
					continue;
				}
				if (current.mixingFrom && this.updateMixingFrom(current, delta)) {
					// End mixing from entries once all have completed.
					var from = current.mixingFrom;
					current.mixingFrom = null;
					if (from) from.mixingTo = null;
					while (from) {
						this.queue.end(from);
						from = from.mixingFrom;
					}
				}
				current.trackTime += currentDelta;
			}
			this.queue.drain();
		};
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

	/**
	 * Gets the names of the slots available for the Spine game object.
	 * @returns {string[]} An array of slot names.
	 */
	getSlotNames() {
		return this.pixiObj.skeleton.slots.map((slot) => slot.data.name);
	}

	/**
	 * Gets the slots available for the Spine game object.
	 * @returns {object[]} An array of slots.
	 */
	getSlots() {
		return this.pixiObj.skeleton.slots;
	}

	/**
	 * Gets a slot by name.
	 * @param {string} slotName - The name of the slot to get.
	 * @param {number} [alpha] - The alpha value to set.
	 * @returns {object} The slot.
	 */
	getSlot(slotName, alpha) {
		const slot = this.pixiObj.skeleton.findSlot(slotName);
		if (alpha !== undefined) {
			slot.color.a = alpha;
		}

		return slot;
	}

	/**
	 * Gets the names of the bones available for the Spine game object.
	 * @returns {string[]} An array of bone names.
	 */
	getBoneNames() {
		return this.pixiObj.skeleton.bones.map((bone) => bone.data.name);
	}

	/**
	 * Gets the bones available for the Spine game object.
	 * @returns {object[]} An array of bones.
	 */
	getBones() {
		return this.pixiObj.skeleton.bones;
	}

	/**
	 * Gets a bone by name.
	 * @param {string} boneName - The name of the bone to get.
	 * @returns {object} The bone.
	 */
	getBone(boneName) {
		return this.pixiObj.skeleton.findBone(boneName);
	}

	/**
	 * Sets mix duration between animations.
	 * @param {Array} args - An array of arguments.
	 * @param {string} args[0] - The name of the first animation.
	 * @param {string} args[1] - The name of the second animation.
	 * @param {number} args[2] - The duration of the mix.
	 */
	setMix(...args) {
		try {
			if (args.length === 3 && typeof args[0] === "string" && typeof args[1] === "string" && typeof args[2] === "number") {
				this.pixiObj.stateData.setMix(args[0], args[1], args[2]);
			} else {
				args.forEach((arg) => this.pixiObj.stateData.setMix(arg[0], arg[1], arg[2]));
			}
		} catch (error) {
			console.error(error);
		}
	}

	/**
	 * Sets the default mix duration between animations.
	 * @param {number} value - The duration of the mix.
	 */
	set defaultMix(value) {
		this.pixiObj.stateData.defaultMix = value;
	}

	update(delta) {}
}

export default Spine;
