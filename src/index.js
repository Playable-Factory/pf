import GameObjectFactory from './gameobjects/factory';


class gs2d {

    // static add = new GameObjectFactory();
    
    static init(pixiScene) {
        gs2d.scene = pixiScene;

        this.add = new GameObjectFactory(pixiScene);
    }
    
    

}

// var gs2d = {
//     init: (pixiScene) => {
//         gs2d.scene = pixiScene;
        
//     },
//     add: new GameObjectFactory(),
// }

export default gs2d;
