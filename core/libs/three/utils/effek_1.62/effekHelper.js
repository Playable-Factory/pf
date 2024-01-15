require('./effekseer.js');

let main;

let unbrotli = require("../../../../brotli/unbrotli");
import effekBuffer from '!!arraybuffer-loader!./effekseer.wasm.br'; 

let fastRenderMode;

class EffekHelper{
    constructor(){
        
    }

    static init(){
        main = app.main;

        let buffer = effekBuffer;
        buffer = new Uint8Array(buffer);
        buffer = unbrotli(buffer);
        
        effekseer.initRuntime(buffer, () => {
            this.ready();
        });
    }

    static ready(){
        this.isReady = true;
        let context = effekseer.createContext();
        context.init(main.renderer.getContext());
        this.context = context;

        console.log(context);

        if (fastRenderMode) {
            context.setRestorationOfStatesFlag(false);
        }

        

        ///add assets to lib object
        context.lib = {};

        let imgSrcList = {
            'Texture/LaserMain01.png': require('../../../../../../assets/effek_assets/Texture/LaserMain01.png'),
            'Texture/Particle01.png': require('../../../../../../assets/effek_assets/Texture/Particle01.png'),
            'Texture/Particle02.png': require('../../../../../../assets/effek_assets/Texture/Particle02.png'),
            'Texture/Burst01.png': require('../../../../../../assets/effek_assets/Texture/Burst01.png'),
            'Texture/LaserMain02.png': require('../../../../../../assets/effek_assets/Texture/LaserMain02.png'),
            'Texture/Thunder01.png': require('../../../../../../assets/effek_assets/Texture/Thunder01.png'),
            
        }

        for(let prop in imgSrcList){
            let img = document.createElement('img');
		    img.crossOrigin = 'use-credentials';
            img.src = imgSrcList[prop];

            context.lib[prop] = img;
        }

        ////add sounds if there is any
        //context.lib['Sound/Laser.wav'] = require('../../../assets/effek_assets/Sound/Laser.wav');
        

        ////load effects
        this.effects = {};
        let laserEfk = require('../../../../../../assets/effek_assets/Laser02.efk');
        
        let laserEffect = context.loadEffect(laserEfk, 1, () => {
            
            this.laserEffect = laserEffect;

            this.effects.laser = laserEffect;

            // context.play(laserEffect, 0, 0, 0);
        });

    }

    static playEffect(name, position){
        console.log(name, position);
        if(!this.effects[name]){
            console.warn('there is no effect with the name of ' + name);
            return;
        }
        
        return this.context.play(this.effects[name], position.x, position.y, position.z);
    }

    static update = (delta)=>{

        if(!this.context)return;

        this.context.update(delta * 60.0);
        this.context.setProjectionMatrix(main.camera.projectionMatrix.elements);
        this.context.setCameraMatrix(main.camera.matrixWorldInverse.elements);

        // Effekseer Rendering
        this.context.draw();

        if (fastRenderMode) {
            main.renderer.resetState();
        }


        
    }

}

export default EffekHelper;