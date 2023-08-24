// import { AnimatedSprite, Graphics, Loader, TextStyle, Text, Texture, utils, NineSlicePlane } from "pixi.js-legacy";
import { Texture } from "pixi.js-legacy";
import * as Particles from "@pixi/particle-emitter";

import GameObject from "./gameObject";
import pfGlobals from "../pfGlobals";
import objectTypes from "./objectTypes";

class ParticleEmitter extends GameObject {
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

	enable() {
		this.emitter.emit = true;
	}
	disable() {
		this.emitter.emit = false;
	}

	setEmit(value) {
		this.emitter.emit = value;
	}

	setSpawnPos(x, y) {
		this.emitter.spawnPos.x = x;
		this.emitter.spawnPos.y = y;
	}
}

export default ParticleEmitter;
