import GameObjectFactory from './gameobjects/factory';


class gx {

    // static add = new GameObjectFactory();
    
    static init(pixiScene) {
        gx.scene = pixiScene;

        this.add = new GameObjectFactory(pixiScene);
    }
    
    

}

// var gx = {
//     init: (pixiScene) => {
//         gx.scene = pixiScene;
        
//     },
//     add: new GameObjectFactory(),
// }

export default gx;
