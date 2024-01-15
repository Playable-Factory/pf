function Time(totalGameTime){
    
    var countTime,
        startTime,
        totalTimePassed = 0,
        elapsedTime = 0,
        prevTime = 0,
        totalTime = totalGameTime;
    
    var analyticsTime = 0;

    this.isStarted = false;

    /**
    * Start the timer
    */
    this.start = function(){
        //if(totalGameTime==0)return;
        if(this.isStarted)return;
        
        this.isStarted = true;
        countTime = true;
        startTime = new Date().getTime();

        elapsedTime = 0;
        prevTime = 0;
    }
    /**
    * Stop  the timer
    */
    this.stop = function(){
        if(!this.isStarted)return;
        
        totalTime = this.left();
        totalTimePassed = this.passed();
        countTime = false;

        this.isStarted = false;
    }

    /**
    * Reset the timer
    * @param {Number} Duration of the timer
    */
    this.reset = function(newTime){
        countTime = true;
        startTime = new Date().getTime();
        totalTime = newTime === undefined ? totalGameTime : newTime;
        totalGameTime = newTime;

        elapsedTime = 0;
        prevTime = 0;

        analyticsTime = 0;
    }
    /**
    * Resume the timer
    */
    this.resume = function(){
        if(!countTime && startTime){
            this.start();
        }
    }
    /**
    * Check time left
    * @returns {Number} time left
    */
    this.left = function(){
        if(!countTime)return totalTime//-totalTimePassed;

        var elapsedTime = new Date().getTime() - startTime;
        elapsedTime /= 1000;
        return totalTime - elapsedTime;
    }
    /**
    * Check passed time
    * @returns {Number} time passed
    */
    this.passed = function(){
        if(!countTime)return totalTimePassed;

        var elapsedTime = new Date().getTime() - startTime;
        elapsedTime /= 1000;
        return elapsedTime + totalTimePassed;
    }

    /**
    * Check time up
    * @returns {Boolean} is time up?
    */
    this.checkTimeUp = function(){
        if(!countTime || !totalGameTime)return;

        // var elapsedTime = new Date().getTime() - startTime;
        // elapsedTime /= 1000;
        
        if( elapsedTime >= totalTime ){
            return true;
        }
    }

    /**
    * Update the time
    * @params {networkHelper} networkHelper Object
    * @returns {Boolean} 1 second passed or not?
    */
    this.update = function(networkHelper){
        
        if(!countTime)return;
        elapsedTime = new Date().getTime() - startTime;
        elapsedTime /= 1000;
        
        if(networkHelper && elapsedTime - prevTime >= 1){
            prevTime = Math.floor(elapsedTime);
            networkHelper && networkHelper.secondPassed();
            analyticsTime++;
            return true;
        }
    }

    /**
    * Get analytics time
    * @returns {Number} analytics time
    */
    this.getAnalyticsTime = function(){
        return analyticsTime;
    }
}

export default Time;