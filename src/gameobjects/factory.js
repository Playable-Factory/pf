import Image from "./image";

class GameObjectFactory{
    constructor(scene){
        this.scene = scene;
        console.log(this.scene);
    }

    image(x, y, texture){
        let img =  new Image(x, y, texture);
        this.scene.addChild(img.pixiObj);
        return img;
    }

    sprite(x, y, texture){
        // return new Sprite(this.scene, x, y, texture);
    }
}

export default GameObjectFactory;