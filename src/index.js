import pfGlobals from "pf.js/src/pfGlobals";
import GameObjectFactory from "./gameobjects/factory";
import Utils from "./utils/utils";

import Image from "./gameobjects/image";
import AnimatedSprite from "./gameobjects/animatedSprite";
import Container from "./gameobjects/container";
import Text from "./gameobjects/text";
import GameObject from "./gameobjects/gameObject";
import Spine from "./gameobjects/spine";
import Graphics from "./gameobjects/graphics";
import NineSlice from "./gameobjects/nineslice";

class gx {
	// static add = new GameObjectFactory();

	static init(pixiScene, pixiApp, TextureCache, Resources) {
		gx.scene = pixiScene;

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
	}
}

// var gx = {
//     init: (pixiScene) => {
//         gx.scene = pixiScene;

//     },
//     add: new GameObjectFactory(),
// }

export default gx;
