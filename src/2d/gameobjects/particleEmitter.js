// import { AnimatedSprite, Graphics, Loader, TextStyle, Text, Texture, utils, NineSlicePlane } from "pixi.js-legacy";
import { Texture } from "pixi.js-legacy";
import * as Particles from "@pixi/particle-emitter";
import { EmitterConfigV3 } from "@pixi/particle-emitter";
import GameObject from "./gameObject";
import pfGlobals from "../pfGlobals";
import objectTypes from "./objectTypes";



/**
 * ParticleEmitter class represents a game object that emits particles.
 * @extends GameObject
 */
class ParticleEmitter extends GameObject {
	/**
	 * Creates an instance of ParticleEmitter.
	 * @param {number} x - The x coordinate of the emitter.
	 * @param {number} y - The y coordinate of the emitter.
	 * @param {EmitterConfigV3} particleData - The particle data object.
	 * @param {Array} particleData.behaviors - The array of particle behaviors.
	 * @param {boolean} particleData.shapeSpawnEnabled - Whether the particle shape spawn is enabled.
	 * @param {string} particleData.curShape - The current particle shape.
	 * @param {Object} particleData.lifetime - The particle lifetime object.
	 * @param {number} particleData.lifetime.x - The minimum lifetime of the particle.
	 * @param {number} particleData.lifetime.y - The maximum lifetime of the particle.
	 * @param {number} particleData.frequency - The frequency of particle emission.
	 * @param {number} particleData.spawnChance - The chance of particle spawn.
	 * @param {number} particleData.particlesPerWave - The number of particles per wave.
	 * @param {number} particleData.emitterLifetime - The lifetime of the emitter.
	 * @param {number} particleData.maxParticles - The maximum number of particles.
	 * @param {Object} particleData.pos - The position of the particle.
	 * @param {number} particleData.pos.x - The x coordinate of the particle position.
	 * @param {number} particleData.pos.y - The y coordinate of the particle position.
	 * @param {boolean} particleData.addAtBack - Whether to add the particle at the back.
	 */
	constructor(x, y, particleData) {
		let enabledBehaviors = particleData.behaviors.filter((a) => a.config.enabled);
		let textureBehaviour = enabledBehaviors.find((a) => a.type == "textureSingle");

		if (textureBehaviour.config.textureData) {
			textureBehaviour.config.texture = pfGlobals.TextureCache[textureBehaviour.config.textureData.uuid];
		} else {
			textureBehaviour.config.texture = Texture.WHITE;
		}

		let pixiObj = new PIXI.Container();
		super(pixiObj, x, y);

		let behaviors = particleData.behaviors;
		let filteredBehaviors = behaviors.filter((a) => a.config.enabled);

		if (particleData.shapeSpawnEnabled) {
			if (particleData.curShape == "rect") {
				let rectConfig = behaviors.filter((a) => a.type == "spawnShape" && a.config.type == "rect")[0];
				filteredBehaviors.push(rectConfig);
			} else if (particleData.curShape == "torus") {
				let torusConfig = behaviors.filter((a) => a.type == "spawnShape" && a.config.type == "torus")[0];
				filteredBehaviors.push(torusConfig);
			} else if (particleData.curShape == "polygonalChain") {
				let polygonalChainConfig = behaviors.filter((a) => a.type == "spawnShape" && a.config.type == "polygonalChain")[0];
				filteredBehaviors.push(polygonalChainConfig);
			}
		}

		var emitter = new Particles.Emitter(pixiObj, {
			lifetime: {
				min: particleData.lifetime.x,
				max: particleData.lifetime.y,
			},
			frequency: particleData.frequency,
			spawnChance: particleData.spawnChance,
			particlesPerWave: particleData.particlesPerWave,
			emitterLifetime: particleData.emitterLifetime,
			maxParticles: particleData.maxParticles,
			pos: {
				x: particleData.pos.x,
				y: particleData.pos.y,
			},
			addAtBack: particleData.addAtBack,
			behaviors: filteredBehaviors,
		});

		this.emitter = emitter;

		pfGlobals.pixiApp.ticker.add((delta) => {
			const msec = delta / PIXI.settings.TARGET_FPMS;
			const sec = msec / 1000.0;
			emitter.update(sec);
		});

		pixiObj.gameObject = this;

		this.isParticleEmitter = true;
		this.type = objectTypes.PARTICLE_EMITTER;
	}
	/**
	 * Enables the particle emission.
	 */
	enable() {
		this.emitter.emit = true;
	}
	/**
	 * Disables the particle emission.
	 */
	disable() {
		this.emitter.emit = false;
	}
	/**
	 * Sets the particle emission.
	 * @param {boolean} value - The value to set the particle emission.
	 */
	setEmit(value) {
		this.emitter.emit = value;
	}
	/**
	 * Sets the spawn position of the particle.
	 * @param {number} x - The x coordinate of the spawn position.
	 * @param {number} y - The y coordinate of the spawn position.
	 */
	setSpawnPos(x, y) {
		this.emitter.spawnPos.x = x;
		this.emitter.spawnPos.y = y;
	}
}

export default ParticleEmitter;
