class Time {
    constructor(totalGameTime) {
        this.countTime = false;
        this.isStarted = false;
        this.startTime = 0;
        this.totalTimePassed = 0;
        this.elapsedTime = 0;
        this.prevTime = 0;
        this.totalTime = totalGameTime;
        this.analyticsTime = 0;
    }

    /**
     * Start the timer
     */
    start() {
        if (this.isStarted) return;

        this.isStarted = true;
        this.countTime = true;
        this.startTime = new Date().getTime();

        this.elapsedTime = 0;
        this.prevTime = 0;
    }

    /**
     * Stop the timer
     */
    stop() {
        if (!this.isStarted) return;

        this.totalTime = this.left();
        this.totalTimePassed = this.passed();
        this.countTime = false;

        this.isStarted = false;
    }

    /**
     * Reset the timer
     * @param {Number} Duration of the timer
     */
    reset(newTime) {
        this.countTime = true;
        this.startTime = new Date().getTime();
        this.totalTime = newTime === undefined ? this.totalTime : newTime;

        this.elapsedTime = 0;
        this.prevTime = 0;

        this.analyticsTime = 0;
    }

    /**
     * Resume the timer
     */
    resume() {
        if (!this.countTime && this.startTime) {
            this.start();
        }
    }

    /**
     * Check time left
     * @returns {Number} time left
     */
    left() {
        if (!this.countTime) return this.totalTime;

        const elapsedTime = new Date().getTime() - this.startTime;
        return this.totalTime - elapsedTime / 1000;
    }

    /**
     * Check passed time
     * @returns {Number} time passed
     */
    passed() {
        if (!this.countTime) return this.totalTimePassed;

        const elapsedTime = new Date().getTime() - this.startTime;
        return elapsedTime / 1000 + this.totalTimePassed;
    }

    /**
     * Check time up
     * @returns {Boolean} is time up?
     */
    checkTimeUp() {
        if (!this.countTime || !this.totalTime) return false;

        const elapsedTime = new Date().getTime() - this.startTime;
        return elapsedTime >= this.totalTime;
    }

    /**
     * Update the time
     * @param {networkHelper} networkHelper Object
     * @returns {Boolean} 1 second passed or not?
     */
    update(networkHelper) {
        if (!this.countTime) return false;

        this.elapsedTime = new Date().getTime() - this.startTime;
        this.elapsedTime /= 1000;

        if (networkHelper && this.elapsedTime - this.prevTime >= 1) {
            this.prevTime = Math.floor(this.elapsedTime);
            networkHelper && networkHelper.secondPassed();
            this.analyticsTime++;
            return true;
        }

        return false;
    }

    /**
     * Get analytics time
     * @returns {Number} analytics time
     */
    getAnalyticsTime() {
        return this.analyticsTime;
    }
}

export default Time;
