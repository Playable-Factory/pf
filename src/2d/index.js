import pfGlobals from "./pfGlobals";
import GameObjectFactory from "./gameobjects/factory";
import Utils from "./utils/utils";

import Sprite from "./gameobjects/sprite";
import AnimatedSprite from "./gameobjects/animatedSprite";
import Container from "./gameobjects/container";
import Text from "./gameobjects/text";
import GameObject from "./gameobjects/gameObject";
import Spine from "./gameobjects/spine";
import Graphics from "./gameobjects/graphics";
import Rectangle from "./gameobjects/shape/rectangle";
import NineSlice from "./gameobjects/nineslice";
import Scene from "./gameobjects/scene";
import Viewport from "./gameobjects/viewport";

class gx {
	// static add = new GameObjectFactory();

	static init(pixiApp, TextureCache, Resources) {
		let pixiScene = new Scene();
		pixiScene.interactive = true;
		pixiScene.sortableChildren = true;
		pixiApp.stage.addChild(pixiScene.pixiObj);
		gx.scene = pixiScene;

        pfGlobals.gx = this;
        
		let allAnims = {};

		for (let uuid in Resources) {
			for (let animName in Resources[uuid].animations) {
				allAnims[animName] = uuid;
			}
		}

		pfGlobals.allAnims = allAnims;
		pfGlobals.TextureCache = TextureCache;
		pfGlobals.Resources = Resources;
		pfGlobals.pixiApp = pixiApp;

		this.add = new GameObjectFactory(pixiScene);
		this.utils = new Utils(pixiScene);

		return pixiScene;
	}
}

// var gx = {
//     init: (pixiScene) => {
//         gx.scene = pixiScene;

//     },
//     add: new GameObjectFactory(),
// }

export default gx;
