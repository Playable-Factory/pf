require('./effekseer.js');

let main;

let unbrotli = require("../../../../brotli/unbrotli");
import effekBuffer from '!!arraybuffer-loader!./effekseer.wasm.br'; 
import EffekseerRenderPass from '../postprocess/effekseer_pass.js';

let fastRenderMode = true;

class EffekHelper{
    constructor(){
        
    }

    static init(callback){

        let ppData = app.data.pfPostprocessData;


        if( ppData && (ppData.enable || ppData.gearboxMode) ){
            fastRenderMode = false;
        }
        main = app.main;

        this.fastRenderMode = fastRenderMode;

        let buffer = effekBuffer;
        buffer = new Uint8Array(buffer);
        buffer = unbrotli(buffer);
        
        effekseer.initRuntime(buffer, () => {
            this.ready();
            callback && callback();
        });
    }

    static ready(){
        this.isReady = true;

        let renderer = main.renderer;
        

        let context = effekseer.createContext();
        context.init(renderer.getContext());
        this.context = context;
        

        if (fastRenderMode) {
            context.setRestorationOfStatesFlag(false);
        }

        if(app.composer){
            // #if process.pfData.enableEffekseer
                
                const effekseerPass = new EffekseerRenderPass(main.scene, main.camera, context);
                app.composer.addPass(effekseerPass);
                
            // #endif
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

            // 'Texture/magma.png': require('../../../../../../assets/effek_assets/magma/Texture/magma.png'),
            // 'Texture/Burst01.png': require('../../../../../../assets/effek_assets/magma/Texture/Burst01.png'),
            // 'Texture/aura3_type2.png': require('../../../../../../assets/effek_assets/magma/Texture/aura3_type2.png'),
            // 'Texture/glow.png': require('../../../../../../assets/effek_assets/magma/Texture/glow.png'),
            // 'Texture/Particle01.png': require('../../../../../../assets/effek_assets/magma/Texture/Particle01.png'),

            // "../../../../Effekseer170Win/Sample/02_Tktk03/Parts/Aura_2.png": require('../../../../../../assets/effek_assets/1.7/Parts/Aura_2.png'),
            // "../../../../Effekseer170Win/Sample/02_Tktk03/Parts/ColorNoise.png": require('../../../../../../assets/effek_assets/1.7/Parts/ColorNoise.png'),
            // "../../../../Effekseer170Win/Sample/02_Tktk03/Parts/Gradient_2.png": require('../../../../../../assets/effek_assets/1.7/Parts/Gradient_2.png'),
            // "../../../../Effekseer170Win/Sample/02_Tktk03/Parts/Noise2.png": require('../../../../../../assets/effek_assets/1.7/Parts/Noise2.png'),
            // "../../../../Effekseer170Win/Sample/02_Tktk03/Parts/Noise3.png": require('../../../../../../assets/effek_assets/1.7/Parts/Noise3.png'),
            // "../../../../Effekseer170Win/Sample/02_Tktk03/Parts/Noise4.png": require('../../../../../../assets/effek_assets/1.7/Parts/Noise4.png'),
            // "../../../../Effekseer170Win/Sample/02_Tktk03/Parts/Null.png": require('../../../../../../assets/effek_assets/1.7/Parts/Null.png'),
            // "../../../../Effekseer170Win/Sample/02_Tktk03/Parts/Particle1.png": require('../../../../../../assets/effek_assets/1.7/Parts/Particle1.png'),
            // "../../../../Effekseer170Win/Sample/02_Tktk03/Parts/ParticleCore.png": require('../../../../../../assets/effek_assets/1.7/Parts/ParticleCore.png'),
            
            // '../../../../Effekseer170Win/Sample/01_NextSoft01/Texture/Particle03.png': require('../../../../../../assets/effek_assets/1.7/Texture/Particle03.png'),
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
        let laserEfk = require('../../../../../../assets/effek_assets/Laser01.efk');
        
        let laserEffect = context.loadEffect(laserEfk, 1, () => {            
            this.laserEffect = laserEffect;
            this.effects.laser = laserEffect;
        });

        // let waterEfk = require('../../../../../../assets/effek_assets/1.7/water.efk');
        
        // let waterEffect = context.loadEffect(waterEfk, 1, () => {    
        //     this.waterEffect = waterEffect;
        //     this.effects.water = waterEffect;
        // });

    }

    static playEffect(name, position){
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