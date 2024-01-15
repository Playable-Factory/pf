var particles = [];
var tempParticles = [];
var list = [];
var id = 0;

function Confetti(scene){
    
    /*
        models - an array of models or single model

    */

    /*
        addEmitter([model1,model2,model3], ["obj1,obj2","obj7,obj8"])

        addEmitter([
            {
                model: model1,
                objectNames: ["obj1", "obj2"],
                position: {x:0,y:0,z:0},
                initials:{
                    speed:{
                        x: [min:0, max:0.2],
                        y: [min:0, max:0.2],
                        z: [min:0, max:0.2],
                    },
                    opacity: 1,
                    scale: 1
                },

                props:{
                    gravity:{
                        x:0, y:0.1, z:0
                    },
                    scale: -0.03,
                    opacity: -0.03 
                },
                lifeTime: 100,
                frequency: 5
                
            }
        ])

    */

    this.addEmitter = function(config){
        let model = config.model;
        let objectNames = config.objectNames;
        
        
        let objects = [];
        
        if(!objectNames){
            objects.push(model);
        }
        else{
            if(!Array.isArray(objectNames))objectNames = [objectNames];

            for(let on of objectNames){
                let obj = model.getObjectByName(on);
                if(!obj)console.warn("No such object in the model");
                objects.push(obj.clone());
            }
        }

        let emitter = {
            position: config.position,
            lifeTime:config.lifeTime,
            frequency: config.frequency || 1,
            quantity: config.quantity || 1,
            update: config.update,
            onEmit: config.onEmit,
            name: config.name,
            objects,
            
            ///initials
            speed: config.initials.speed,
            opacity: config.initials.opacity,
            scale: config.initials.scale,

            ///props
            gravity: config.props.gravity,
            scaleSpeed: config.props.scale,
            opacitySpeed: config.props.opacity,

            colorList: config.colorList,
            id:id,
            step:0,

            particles:[],
            temp:[],

            isActive: config.isActive
        };

        id++;
        
        list.push(emitter);

        return emitter;

    }

     function removeParticle(p){
        let emitter = this.emitter;
        emitter.particles.splice(emitter.particles.indexOf(this),1);
        emitter.temp.push(this);
        this.visible = false;
    }

    

    this.update = function(){
        for(let emitter of list){
            
            //update particles
            //for(let p of emitter.particles){
            for(let i = emitter.particles.length-1 ; i>=0;i--){
                let p = emitter.particles[i];
                p.position.x += p.vx;
                p.position.y += p.vy;
                p.position.z += p.vz;

                p.vx += p.gravity.x;
                p.vy += p.gravity.y;
                p.vz += p.gravity.z;

                p.curScale += p.scaleSpeed;
                p.scale.setScalar(p.curScale);
                p.material.opacity += p.opacitySpeed;

                if(emitter.update)emitter.update(p);
                p.lifeTime--;

                if(p.lifeTime <= 0){
                    emitter.particles.splice(i,1);
                    emitter.temp.push(p);
                    p.visible = false;
                }

            }

            if(!emitter.isActive)continue;
            ///spawn new particles
            emitter.step++;
            if(emitter.step > emitter.frequency){
                emitter.step = 0;
                for(let i=0;i<emitter.quantity;i++){
                    emitParticle(emitter);
                }
                
                
            }
        }
    }

    function getXYZFromVector(vec){
        let xMin = vec.x.min || vec.x;
        let xMax = vec.x.max || vec.x;
        let yMin = vec.y.min || vec.y;
        let yMax = vec.y.max || vec.y;
        let zMin = vec.z.min || vec.z;
        let zMax = vec.z.max || vec.z;

        return {
            x: {min: xMin, max: xMax},
            y: {min: yMin, max: yMax},
            z: {min: zMin, max: zMax},
            //xMin, xMax, yMin, yMax, zMin, zMax
        }
    }
    
    ///for single values like scale or opacity
    function evaluateValue(val){
        ///is it min/max or just value
        if(val.min){
            return getRandomBetween(val.min, val.max);
        }

        return val;
    }

    function getRandomBetweenVector(vec){
        ///if it is min max find between them, otherwise return value
        return {
            x: !isNaN(vec.x.min) ? getRandomBetween(vec.x.min, vec.x.max) : vec.x,
            y: !isNaN(vec.y.min) ? getRandomBetween(vec.y.min, vec.y.max) : vec.y,
            z: !isNaN(vec.z.min) ? getRandomBetween(vec.z.min, vec.z.max) : vec.z,
        }
    }

    function getRandomBetween(min,max){
        return min + (max-min) * Math.random();
    }

    function emitParticle(emitter){
        let p = emitter.temp.pop();

        if(!p){
            p = emitter.objects[Math.floor(emitter.objects.length*Math.random())].clone();
            scene.add(p);
            p.isNewParticle = true;
            p.remove = removeParticle;
            p.emitter = emitter;
            
            let colorList = emitter.colorList;

            let needNewMaterial = emitter.opacitySpeed || (colorList && colorList.length > 1);
            let isTransparent = needNewMaterial || emitter.opacity!=1;

            if(needNewMaterial || isTransparent){
                if(!p.material){
                    p.traverse(child=>{
                        if(child.material){
                            p.material = child.material;
                        }
                    });
                }                
            }

            needNewMaterial && (p.material = p.material.clone());
            p.material.transparent = isTransparent;
            
        }


        ///initials
        let pos = getRandomBetweenVector(emitter.position);
        p.position.set(pos.x, pos.y, pos.z);        

        p.lifeTime = emitter.lifeTime;
        p.speed = getRandomBetweenVector(emitter.speed);
        p.vx = p.speed.x;
        p.vy = p.speed.y;
        p.vz = p.speed.z;
        
        p.curScale = evaluateValue(emitter.scale);
        p.scale.setScalar(p.curScale);
        p.rotation.set(0,0,0);

        if(p.material){
            p.material.opacity = evaluateValue(emitter.opacity);

            let randomColors = emitter.colorList;
            if( randomColors && randomColors.length > 1){
                p.material.color = new THREE.Color(randomColors[Math.floor(randomColors.length*Math.random())]);
            }
        }

        ///props
        p.gravity = getRandomBetweenVector(emitter.gravity);
        p.scaleSpeed = evaluateValue(emitter.scaleSpeed);
        p.opacitySpeed = evaluateValue(emitter.opacitySpeed);

        p.visible = true;
        
        
        

        emitter.onEmit(p);
        emitter.particles.push( p );
        p.isNewParticle = false;
    }

    this.getEmitter = function(id){
        for(let emitter of list){
            if(emitter.id == id || emitter.name == id){
                return emitter;
            }
        }

        console.warn("No emitter found with this id!");
    }

    this.activateEmitter = function(id){
        for(let emitter of list){
            if(emitter.id == id || emitter.name == id){
                emitter.isActive = true;
                emitter.step = 0;
                return;
            }
        }

        console.warn("No emitter found with this id!");
    }
    
    this.deactivateEmitter = function(id){
        for(let emitter of list){
            if(emitter.id == id || emitter.name == id){
                emitter.isActive = false;
                return;
            }
        }

        console.warn("No emitter found with this id!");
    }
    /*
    this.addEmitter = function( models, objectNames ) {
        if(!Array.isArray(models))models = [models];

        let objects = [];
        ///use the models directly
        if(!objectNames){
            objects = objects.concat(models);
        }
        else{
            if(!Array.isArray(objectNames))objectNames = [objectNames];

            for(let on of objectNames){
                let obj = model.getObjectByName(on);
                if(!obj)console.warn("No such object in the model");
                objects.push(obj.clone());
            }

        }

    }
    */
}


export default Confetti;