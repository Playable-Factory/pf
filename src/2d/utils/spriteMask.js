export default class SpriteMask {
	constructor(obj, mask, invertAlpha = false) {
		this.obj = obj;
		this.mask = mask;
		this.invertAlpha = invertAlpha;
		this.init();
	}

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

/*
 * DOESN'T WORK IN CANVAS MODE!
 *
 * USAGE
 * new SpriteMask(anObj, aMask, false);
 * */
