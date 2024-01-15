import { Howl, Howler } from "howler";
import globals from "../../globals";

class soundHelper {
	static initTempFunctions() {
		app.playSfx = function () {};
		app.stopSfx = function () {};
		app.fadeSfx = function () {};
		app.playMusic = function () {};
		app.stopMusic = function () {};
		app.playMenuMusic = function () {};
		app.stopMenuMusic = function () {};
		app.playTTS = function () {};
	}

	static initDefault() {
		if (this.isDefaultInited) return;
		this.isDefaultInited = true;

		if (!app.data.soundEnabled) return;

		this.initEditorSounds();

		if (app.data.musicSrc) {
			let music = new Howl({
				src: [app.data.musicSrc],
				loop: true,
				volume: app.data.musicVolume,
			});

			app.playMusic = function () {
				if (music.playing()) return;
				//app.doneMenuMusic();
				music.play();
			};

			app.stopMusic = function () {
				music.stop();
			};

			app.doneMusic = function () {
				//music.isDone = true;
				music.stop();
			};
		}

		if (app.data.menuMusicSrc) {
			let menuMusic = new Howl({
				src: [app.data.menuMusicSrc],
				loop: true,
				volume: app.data.menuMusicVolume,
			});

			app.playMenuMusic = function () {
				if (menuMusic.isDone) return;
				if (menuMusic.playing()) return;
				menuMusic.play();
			};

			app.stopMenuMusic = function () {
				menuMusic.stop();
			};

			app.doneMenuMusic = function () {
				//menuMusic.isDone = true;
				menuMusic.stop();
			};
		}

		if (!app.data.sfxSrc) return;
		////prepare sfx
		let sprite = {};

		let spritemap = app.data.sfxJson.spritemap;

		for (let prop in spritemap) {
			let s = spritemap[prop];
			let start = s.start * 1000;
			let duration = Math.ceil(s.end * 1000 - start);
			let loop = s.loop;
			sprite[prop] = [start, duration, loop];
		}

		let sound = new Howl({
			src: [app.data.sfxSrc],
			sprite,
			volume: app.data.sfxVolume,
		});
		app.sfxSound = sound;

		app.playSfx = function (name, volume = app.data.sfxVolume, rate = 1) {
			if (!app.main.soundEnabled) return;
			sound.volume(volume);
			let id = sound.play(name);
			sound.rate(rate, id);
			return id;
		};

		app.stopSfx = function (id) {
			sound.stop(id);
		};

		app.fadeSfx = function (id, from = app.data.sfxVolume, to = 0) {
			sound.fade(from, to, 500, id);
		};
	}

	static initTTS() {
		if (this.isTTSInited) return;
		this.isTTSInited = true;

		let list = [];

		for (let prop in app.data) {
			let len = prop.length - 3;
			if (prop.lastIndexOf("TTS") == len) {
				list.push(prop);
			}
		}

		let ttsList = {};

		for (let name of list) {
			//let name = rawName + 'TTS';
			let rawName = name.slice(0, name.length - 3);
			let src = app.data[name];

			if (src) {
				var sound = new Howl({
					src: [src],
					loop: false,
					volume: app.data.ttsVolume,
				});

				let sd = {
					sound,
					name,
					rawName,
				};

				ttsList[rawName] = sd;
				ttsList[name] = sd;
			}
		}

		app.playTTS = (name, completeCallback) => {
			let soundData = ttsList[name];

			if (soundData) {
				let fullName = soundData.name;
				let count = app.data[fullName + "Count"] || 1;

				let sound = soundData.sound;
				sound.play();

				sound.on("end", () => {
					count--;
					if (count > 0) {
						sound.play();
					} else {
						completeCallback && completeCallback();
					}
				});
				return sound;
			} else {
				completeCallback && completeCallback();
			}

			return;
		};
	}

	static initEditorSounds() {
		if (!app.data.soundEnabled) return;

		let normalSounds = {};

		let addSound = (data) => {
			let name = data.name;

			let volume = data.useVolumeFromDatajs ? app.data.musicVolume : data.volume;

			let sound = new Howl({
				src: [data.src],
				loop: data.enableLoop,
				volume,
			});

			normalSounds[name] = sound;
			normalSounds[data.uuid] = sound;
		};

		let audioData = app.globals.editorConfig.audioData;

		audioData.normalAudios.forEach((data) => {
			addSound(data);
		});

		globals.playSound = (name, volume) => {
			let sound = normalSounds[name];
			if (sound) {
				sound.play();
				if (volume !== undefined) {
					sound.volume(volume);
				}
			}
		};

		globals.stopSound = (name) => {
			let sound = normalSounds[name];
			if (sound) {
				sound.stop();
			}
		};

		let audioSpriteData = audioData.audioSprite;

		if (audioSpriteData.src) {
			let audioMapList = {};
			audioSpriteData.list.forEach((data) => {
				audioMapList[data.name] = data.uuid;
			});
			////prepare sfx
			let sprite = {};

			let spritemap = audioSpriteData.json.spritemap;

			for (let prop in spritemap) {
				let s = spritemap[prop];
				let start = s.start * 1000;
				let duration = Math.ceil(s.end * 1000 - start);
				let loop = s.loop;
				sprite[prop] = [start, duration, loop];
			}

			let sound = new Howl({
				src: [audioSpriteData.src],
				sprite,
				volume: app.data.sfxVolume,
			});

			globals.sfxSound = sound;

			globals.playSfx = function (name, volume = app.data.sfxVolume, rate = 1) {
				if (!app.main.soundEnabled) return;

				let uuid = audioMapList[name];
				sound.volume(volume);
				let id = sound.play(uuid);
				sound.rate(rate, id);
				return id;
			};

			globals.stopSfx = function (id) {
				sound.stop(id);
			};

			globals.fadeSfx = function (id, from = app.data.sfxVolume, to = 0) {
				sound.fade(from, to, 500, id);
			};
		}
		return;

		if (app.data.musicSrc) {
			let music = new Howl({
				src: [app.data.musicSrc],
				loop: true,
				volume: app.data.musicVolume,
			});

			app.playMusic = function () {
				if (music.playing()) return;
				//app.doneMenuMusic();
				music.play();
			};

			app.stopMusic = function () {
				music.stop();
			};

			app.doneMusic = function () {
				//music.isDone = true;
				music.stop();
			};
		}

		if (app.data.menuMusicSrc) {
			let menuMusic = new Howl({
				src: [app.data.menuMusicSrc],
				loop: true,
				volume: app.data.menuMusicVolume,
			});

			app.playMenuMusic = function () {
				if (menuMusic.isDone) return;
				if (menuMusic.playing()) return;
				menuMusic.play();
			};

			app.stopMenuMusic = function () {
				menuMusic.stop();
			};

			app.doneMenuMusic = function () {
				//menuMusic.isDone = true;
				menuMusic.stop();
			};
		}

		if (!app.data.sfxSrc) return;
		////prepare sfx
		let sprite = {};

		let spritemap = app.data.sfxJson.spritemap;

		for (let prop in spritemap) {
			let s = spritemap[prop];
			let start = s.start * 1000;
			let duration = Math.ceil(s.end * 1000 - start);
			let loop = s.loop;
			sprite[prop] = [start, duration, loop];
		}

		let sound = new Howl({
			src: [app.data.sfxSrc],
			sprite,
			volume: app.data.sfxVolume,
		});
		app.sfxSound = sound;

		app.playSfx = function (name, volume = app.data.sfxVolume, rate = 1) {
			if (!app.main.soundEnabled) return;
			sound.volume(volume);
			let id = sound.play(name);
			sound.rate(rate, id);
			return id;
		};

		app.stopSfx = function (id) {
			sound.stop(id);
		};

		app.fadeSfx = function (id, from = app.data.sfxVolume, to = 0) {
			sound.fade(from, to, 500, id);
		};
	}
}

export default soundHelper;
