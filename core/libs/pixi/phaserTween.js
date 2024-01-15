import phaserPlusPlus from "../../utils/phaserHelpers/ppp";

export default class PhaserTween {
	constructor(game) {
		let tweens = require("phaser/src/tweens");
		game.stage.sys = {};
		game.stage.sys.events = {};
		game.stage.sys.events.on = () => {};
		game.stage.sys.events.once = () => {};
		game.stage.tweens = new tweens.TweenManager(game.stage);
		phaserPlusPlus.upgradePhaser(game.stage);
		let time = require("phaser/src/time");
		game.stage.time = new time.Clock(game.stage);

		game.ticker.add((delta) => {
			const msec = delta / PIXI.settings.TARGET_FPMS;
			if (game.stage.tweens) {
				game.stage.tweens.update(game.ticker.lastTime, msec);
			}
			if (game.stage.time) {
				game.stage.time.preUpdate();
				game.stage.time.update(game.ticker.lastTime, msec);
			}
		});
	}
}
