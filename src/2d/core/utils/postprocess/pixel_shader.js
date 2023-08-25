import { Filter, Point } from "pixi.js-legacy";

const fragShader = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
#define highmedp highp
#else
#define highmedp mediump
#endif
precision highmedp float;

uniform float pixelSize;
uniform vec2 uRes;

uniform sampler2D uSampler;
varying vec2 vTextureCoord;



void main(void)
{
	vec2 dxy = pixelSize / uRes;
	vec2 coord = dxy * floor( vTextureCoord / dxy );
	gl_FragColor = texture2D(uSampler, coord);

    // vec4 originalColor = texture2D(uSampler, vTextureCoord);
    // vec4 originalColor2 = texture2D(lutMap, vTextureCoord);
    // vec4 luttedColor = sampleAs3DTexture(lutMap, originalColor.rgb, lutMapSize);
    // gl_FragColor = mix(originalColor, luttedColor, 1.0);
    
    // gl_FragColor = originalColor;
    
    // gl_FragColor = luttedColor;
    //    vec2 uvs = vTextureCoord.xy;
    //    vec4 fg = texture2D(uSampler, vTextureCoord);
    //    fg.r = uvs.y + sin(customUniform);
    //    gl_FragColor = fg;

}

`;

class PixelShader extends Filter {
	constructor() {
		super(null, fragShader, {
			pixelSize: 1,
			uRes: new Point(800, 600),
		});
	}

	//pixelSize
	set pixelSize(value) {
		this.uniforms.pixelSize = value;
	}
	get pixelSize() {
		return this.uniforms.pixelSize;
	}

	//uRes
	set uRes(value) {
		this.uniforms.uRes.x = value.x;
		this.uniforms.uRes.y = value.y;
	}
	get uRes() {
		return this.uniforms.uRes;
	}
}

export { PixelShader };
