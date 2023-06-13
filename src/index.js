import pfGlobals from "pf.js/src/pfGlobals";
import GameObjectFactory from "./gameobjects/factory";


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
