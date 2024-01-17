import Time from "./time";
var that;

class TemplateMain {
	constructor(config) {
		this.soundEnabled = true;
		this.config = config;
		that = this;

		this.time = new Time(config.totalTime);
		this.sysTime = new Time(0);

		if (window.pfNetworkHelper) {
			let callbacks = {
				gameStart: () => {
					this.networkReady();
				},
				pauseGame: () => {
					this.pauseGame();
				},
				resumeGame: () => {
					this.resumeGame();
				},
				soundChange: (soundEnabled) => {
					this.soundChange(soundEnabled);
				},
				resize: (w, h) => {
					this.resize(w, h);
				},
			};

			let networkData = {
				nucleo: config.nucleo,
				tapjoy: config.tapjoy,
			};

			let cons = window.pfNetworkHelper.default || window.pfNetworkHelper;

			this.networkHelper = new cons(app.type, null, callbacks, networkData);
		} else {
			//this.isNetworkReady = true;

			setTimeout(() => {
				this.networkReady();
			}, 250);

			window.addEventListener("resize", () => {
				let width = window.innerWidth;
				let height = window.innerHeight;

				this.resize(width, height);
			});

			window.addEventListener("blur", this.pauseGame.bind(this));
			window.addEventListener("focus", this.resumeGame.bind(this));
		}
	}

	hidePreloader() {
		var preloader;

		if (app.data.enableCustomPreloader) {
			preloader = document.getElementById("custom-preloader-pf");
		} else {
			preloader = document.getElementById("preloader-pf") || document.getElementById("preloader-gear");
		}
		if (preloader) {
			preloader.classList.add("hide");

			setTimeout(() => {
				preloader.remove();
			}, 500);
		}
	}

	networkReady() {
		this.isNetworkReady = true;

		this.config.networkReady && this.config.networkReady();
	}

	gameInited() {
		if (this.networkHelper) {
			this.networkHelper.gameInited();
			this.networkHelper.startResponsive();
		}
	}

	gameStarted() {
		if (this.networkHelper) {
			this.networkHelper.gameStarted();
		}
	}

	pauseGame() {
		this.time.stop();
		this.sysTime.stop();
		this.gamePaused = true;

		this.config.gamePaused && this.config.gamePaused();
	}

	resumeGame() {
		this.time.resume();
		this.sysTime.resume();
		this.gamePaused = false;

		this.config.gameContinue && this.config.gameContinue();
	}

	soundChange(soundEnabled) {
		this.soundEnabled = soundEnabled;

		this.config.soundChanged && this.config.soundChanged(this.soundEnabled);
	}

	resize(w, h) {
		this.config.gameResized(w, h);
	}

	startTimer() {
		if (this.timeStarted) return;
		this.time.start();
		this.timeStarted = true;
	}

	resizeNow() {
		if (this.networkHelper) {
			this.networkHelper.resize();
		} else {
			this.resize(window.innerWidth, window.innerHeight);
		}
	}

	update() {
		this.time.update();
		//let timeIncreased = this.sysTime.update(this.networkHelper);

		if (this.state == 3 && this.time.checkTimeUp()) {
			this.state = 4;

			this.config.timeUp && this.config.timeUp();
		}
	}

	restartGame(newTime = 0) {
		this.time.reset(newTime);
		this.sysTime.reset(0);
		this.state = 3;

		this.networkHelper && this.networkHelper.gameRestarted();
	}

	interacted() {
		this.networkHelper && this.networkHelper.interacted();

		if (!this.firstInteracted) {
			this.firstInteracted = true;
			this.time.start();
		}
	}

	gameFinished(didWon, reason, oldVar, autoRedirect = false) {
		let analyticsTime = this.sysTime.getAnalyticsTime();
		this.networkHelper && this.networkHelper.gameFinished(didWon, reason, analyticsTime, autoRedirect);
	}

	openMarket(events, localX, localY, func) {
		if (that.networkHelper) {
			that.networkHelper.openMarket(events, localX, localY, func);
		} else {
			window.open(lp_url);
		}
	}

	openMarketFinal(events, localX, localY, func) {
		if (that.networkHelper) {
			that.networkHelper.openMarketFinal(events, localX, localY, func);
		} else {
			window.open(lp_url);
		}
	}

	gotoLink(events, localX, localY, func) {
		that.openMarket(events, localX, localY, func);
	}
}

export default TemplateMain;
