import * as PIXI from "pixi.js-legacy";
/**
 * A class to apply a sprite mask to a PIXI DisplayObject.
 */
class SpriteMask {
	/**
	 * Create a SpriteMask instance.
	 * @param {PIXI.DisplayObject} obj - The DisplayObject to apply the mask to.
	 * @param {PIXI.Sprite} mask - The sprite mask to apply.
	 * @param {boolean} [invertAlpha=false] - Whether to invert the alpha of the mask.
	 */
	constructor(obj, mask, invertAlpha = false) {
		/**
		 * The DisplayObject to apply the mask to.
		 * @type {PIXI.DisplayObject}
		 */
		this.obj = obj;

		/**
		 * The sprite mask to apply.
		 * @type {PIXI.Sprite}
		 */
		this.mask = mask;

		/**
		 * Whether to invert the alpha of the mask.
		 * @type {boolean}
		 */
		this.invertAlpha = invertAlpha;
		this.init();
	}

	/**
	 * Initialize the sprite mask.
	 */
	init() {
		if (!this.obj.filters) {
			this.obj.filters = [];
		}

		this.obj.filters.push(
			new PIXI.SpriteMaskFilter(
				undefined,
				`\
          varying vec2 vMaskCoord;
          varying vec2 vTextureCoord;
  
          uniform sampler2D uSampler;
          uniform sampler2D mask;
          uniform float alpha;
          uniform float npmAlpha;
          uniform vec4 maskClamp;
          uniform bool invertAlpha;
  
          void main(void)
          {
              float clip = step(3.5,
                  step(maskClamp.x, vMaskCoord.x) +
                  step(maskClamp.y, vMaskCoord.y) +
                  step(vMaskCoord.x, maskClamp.z) +
                  step(vMaskCoord.y, maskClamp.w));
  
              vec4 original = texture2D(uSampler, vTextureCoord);
              vec4 masky = texture2D(mask, vMaskCoord);
              float alphaMul = 1.0 - npmAlpha * (1.0 - masky.a);
  
              if(invertAlpha) {
                  original *= 1.0 - (alphaMul * masky.a * alpha * clip);
              } else {
                  original *= (alphaMul * masky.a * alpha * clip);
              }
  
              gl_FragColor = original;
          }
          `,
				{
					invertAlpha: this.invertAlpha,
				}
			)
		);
		this.obj.filters[this.obj.filters.length - 1].maskSprite = this.mask;
	}
}

export default SpriteMask;

/*
 * DOESN'T WORK IN CANVAS MODE!
 *
 * USAGE
 * new SpriteMask(anObj, aMask, false);
 * */
