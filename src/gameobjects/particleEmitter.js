// import { AnimatedSprite, Graphics, Loader, TextStyle, Text, Texture, utils, NineSlicePlane } from "pixi.js-legacy";
import { NineSlicePlane, Texture } from "pixi.js-legacy";

import GameObject from "pf.js/src/gameobjects/gameObject";
import pfGlobals from "pf.js/src/pfGlobals";

class ParticleEmitter extends GameObject {
	constructor(x, y, particleData) {
		let textureBehaviour = particleData.find((a) => a.type == "textureSingle");

		if (textureBehaviour.config.textureData) {
			textureBehaviour.config.texture = pfGlobals.TextureCache[textureBehaviour.config.textureData.uuid];
		} else {
			textureBehaviour.config.texture = Texture.WHITE;
		}

		let pixiObj = new PIXI.Container();

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
		emitter.spawnPos.x = data.width * 0.5;
		emitter.spawnPos.y = data.height * 0.5;

		emitter.emit = data.playAtStart;

		pfGlobals.pixiApp.ticker.add((delta) => {
			const msec = delta / PIXI.settings.TARGET_FPMS;
			const sec = msec / 1000.0;
			emitter.update(sec);
		});

		super(pixiObj, x, y);

		pixiObj.gameObject = this;
	}
}

export default ParticleEmitter;
