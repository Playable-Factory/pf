import SpriteMask from "./utils/spriteMask";

class Utils {
	constructor(pixiScene) {
		this.scene = pixiScene;
	}
	spriteMask(sprite, mask, invertAlpha) {
		new SpriteMask(sprite, mask, invertAlpha);
	}
	curve() {}
}
export default Utils;
