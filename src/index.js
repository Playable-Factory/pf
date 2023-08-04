import pfGlobals from "pf.js/src/pfGlobals";
import GameObjectFactory from "./gameobjects/factory";

import Image from "./gameobjects/image";
import ASprite from "./gameobjects/animatedSprite";
import Container from "./gameobjects/container";
import Text from "./gameobjects/text";
import GameObject from "./gameobjects/gameObject";
import Spine from "./gameobjects/spine";
import Graphics from "./gameobjects/graphics";

class gx {
	// static add = new GameObjectFactory();

	static init(pixiScene, TextureCache, Resources) {
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
