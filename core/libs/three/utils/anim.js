///some utility functions
function AnimManager(model, animations, mixer){
    
    let list={};
    let animList=[];
	
    for(let anim of animations){
        let name=anim.name;
        list[name]=anim;
        anim.defaultDuration=anim.duration;
		
		anim.timeScale = 1;
    }
	
    
    
    this.addAnimation=function({name,startTime,duration,noRepeat,timeScale=1,yoyo}){
        let anim=list[name];
        let animName=name+"Anim";
        
        if(duration)anim.duration=duration;
        this[animName] = mixer.clipAction(anim,model);
        animList.push(this[animName]);

        this[animName].clampWhenFinished = true;

        if(noRepeat)this[animName].repetitions = 0;
        
        this[animName].timeScale = timeScale;

        if(yoyo){
            this[animName].loop = THREE.LoopPingPong;
        }
        
    }

    this.fadeTo = function name(name, startTime=0, noRepeat=null, timeScale=1, yoyo, changeDuration = 0.25) {
        timeScale = timeScale || list[name].timeScale;
		
        let animName= name+"Anim";
        if(!this[animName]){
            this.addAnimation({name,startTime});
        }       
        
        
        if(startTime != "none"){
            this[animName].time = startTime;
        }
        
        if(noRepeat){
            this[animName].repetitions = 0;
        }
        else{
            this[animName].repetitions = Infinity;
        }

        this[animName].timeScale = timeScale;
        
        this[animName].play();
        
        this.curAnim
        .setEffectiveTimeScale( 1 )
        .setEffectiveWeight(1)
        .crossFadeTo(this[animName], changeDuration);
        
        

        
        this.curAnim = this[animName];
        this.curAnim.name = name;
        this.curAnim.duration=this.curAnim._clip.duration;


        this.curAnim.startTime = startTime;
        this.curAnim._clip.startTime =startTime;
        
        if(yoyo){
            this.curAnim.loop = THREE.LoopPingPong;
        }
    }
    
    this.stopAllAnimations=function(){
        for(let anim of animList){
            anim.time=0;
            anim.stop();
        }
    }
	
	this.updateTimeScales = function(animations){
		for(let animData of animations){
			let name = animData.name;
			let value = animData.value;
			list[name].timeScale = value;
		}
	}
    
    this.startAnimation = function(name,startTime=0,noRepeat=null,timeScale=1,yoyo){
        
		timeScale = timeScale || list[name].timeScale;
		
        let animName= name+"Anim";
        if(!this[animName]){
            this.addAnimation({name,startTime});
            //return;
        }
        
        this.stopAllAnimations();
        
        this[animName].reset();
        
        if(startTime != "none"){
            this[animName].time = startTime;
        }
        
        if(noRepeat){
            this[animName].repetitions = 0;
        }
        else{
            this[animName].repetitions = Infinity;
        }
        this[animName].timeScale = timeScale;
		
		this[animName].play();
        

        
        this.curAnim = this[animName];
        this.curAnim.name = name;
        this.curAnim.duration=this.curAnim._clip.duration;


        this.curAnim.startTime = startTime;
        this.curAnim._clip.startTime =startTime;
        
        if(yoyo){
            this.curAnim.loop = THREE.LoopPingPong;
        }

    }
    
    
}


///some utility functions
function TimeAnimManager(model,animData,animations,mixer){
    
    let list={};
    let animList=[];
    
    for(let anim of animations){
        let name=anim.name;
        list[name]=anim;
        
        if(anim.repeat==-1){
            anim.endlessAnim=true;
        }
        
        anim.defaultDuration=anim.duration;
        anim.defaultRepeat=anim.repeat;
    }
    
    let clipAction=mixer.clipAction(animData,model);
    let completeCallback;
    
    this.clipAction=clipAction;
    
    let curAnim;
    
    
    this.startAnimation=function(name,callback){
        curAnim=list[name];
        
        if(!curAnim){
            console.warn("NO SUCH ANIMATION!");
        }
        
        curAnim.endTime= curAnim.startTime+curAnim.duration;
        curAnim.repeat= curAnim.defaultRepeat;
        
        clipAction.time=curAnim.startTime;
        clipAction.timeScale = curAnim.timeScale || 1;
        clipAction.play();
        
        curAnim.onComplete=callback;
        
        this.curAnimName=name;
    }
    
    this.update=function(){
        
        if(!curAnim)return;
        
        
        if(clipAction.time>curAnim.endTime){
            curAnim.repeat--;
            if(curAnim.repeat<0 && !curAnim.endlessAnim){
                clipAction.timeScale=0;
                if(curAnim.onComplete){
                    clearInterval( completeCallback );
                    completeCallback = setTimeout( curAnim.onComplete , 200 );
                    //curAnim.onComplete();
                }
                curAnim=null;
            }
            else{
                clipAction.time=curAnim.startTime;
            }
            
        }
    }
    
    
    
    
    
}

export {AnimManager,TimeAnimManager};
//export default TimeAnimManager;



















