import { TextureLoader } from "three";

function Storage(){
    var all={
        material:{},
        texture:{},
        geometry:{},
        cannonShape:{},
        ammoShape:{},
    }
    
    var randomNameCounter=0;
    
    
    this.init=function(){
        if(this.textureLoader){
            console.warn("init only 1 time!")
            return;
        }
        
        this.textureLoader = new TextureLoader();
    }
    
    
    this.loadTexture=function(){
        
    }
    
    
    ////FOR ALL TYPE OF STUFFS
    /*
        type - material,texture etc..
        name - storage name of this object
        data - the data to store    
    */
    this.addItem = function(type,name,data,forceAdd){
        if(!name){
            name="storageData"+randomNameCounter;
            randomNameCounter++;
            console.warn("No name given,"+name+" used!");
        }
        
        
        if(forceAdd){
            all[type][name]=data;
            return;
        }
        if(all[type][name]){
            console.warn("Already we have this stuff!");
            return all[type][name];
        }
        
        all[type][name]=data;
        
    }
    
    this.hasItem=function(type,name){
        return all[type][name];
    }
    
    this.getItem=function(type,name){
        return all[type][name];
    }
    
    this.removeItem=function(type,name){
        all[type][name]=null;
    }
    
    this.refreshItem=function(type,name,data){
        this.addItem(type,name,data,true);
    }
    
    
}


export default Storage;