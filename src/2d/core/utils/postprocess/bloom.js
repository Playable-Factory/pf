import { Filter } from "pixi.js-legacy";

const fragShader = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
#define highmedp highp
#else
#define highmedp mediump
#endif
precision highmedp float;

const float blurSize = 1.0/512.0;

uniform float intensity;

uniform sampler2D uSampler;
varying vec2 vTextureCoord;



void main(void)
{
    vec4 sum = vec4(0);

    vec2 texcoord = vTextureCoord;
    int j;
    int i;

    //thank you! http://www.gamerendering.com/2008/10/11/gaussian-blur-filter-shader/ for the 
    //blur tutorial
    // blur in y (vertical)
    // take nine samples, with the distance blurSize between them
    sum += texture2D(uSampler, vec2(texcoord.x - 4.0*blurSize, texcoord.y)) * 0.05;
    sum += texture2D(uSampler, vec2(texcoord.x - 3.0*blurSize, texcoord.y)) * 0.09;
    sum += texture2D(uSampler, vec2(texcoord.x - 2.0*blurSize, texcoord.y)) * 0.12;
    sum += texture2D(uSampler, vec2(texcoord.x - blurSize, texcoord.y)) * 0.15;
    sum += texture2D(uSampler, vec2(texcoord.x, texcoord.y)) * 0.16;
    sum += texture2D(uSampler, vec2(texcoord.x + blurSize, texcoord.y)) * 0.15;
    sum += texture2D(uSampler, vec2(texcoord.x + 2.0*blurSize, texcoord.y)) * 0.12;
    sum += texture2D(uSampler, vec2(texcoord.x + 3.0*blurSize, texcoord.y)) * 0.09;
    sum += texture2D(uSampler, vec2(texcoord.x + 4.0*blurSize, texcoord.y)) * 0.05;
        
        // blur in y (vertical)
    // take nine samples, with the distance blurSize between them
    sum += texture2D(uSampler, vec2(texcoord.x, texcoord.y - 4.0*blurSize)) * 0.05;
    sum += texture2D(uSampler, vec2(texcoord.x, texcoord.y - 3.0*blurSize)) * 0.09;
    sum += texture2D(uSampler, vec2(texcoord.x, texcoord.y - 2.0*blurSize)) * 0.12;
    sum += texture2D(uSampler, vec2(texcoord.x, texcoord.y - blurSize)) * 0.15;
    sum += texture2D(uSampler, vec2(texcoord.x, texcoord.y)) * 0.16;
    sum += texture2D(uSampler, vec2(texcoord.x, texcoord.y + blurSize)) * 0.15;
    sum += texture2D(uSampler, vec2(texcoord.x, texcoord.y + 2.0*blurSize)) * 0.12;
    sum += texture2D(uSampler, vec2(texcoord.x, texcoord.y + 3.0*blurSize)) * 0.09;
    sum += texture2D(uSampler, vec2(texcoord.x, texcoord.y + 4.0*blurSize)) * 0.05;

	gl_FragColor = sum * intensity + texture2D(uSampler, texcoord);
	// gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    
	// vec2 dxy = pixelSize / uRes;
	// vec2 coord = dxy * floor( vTextureCoord / dxy );
	// gl_FragColor = texture2D(uSampler, coord);

}

`;

class BloomShader extends Filter {
	constructor() {
		super(null, fragShader, {
			intensity: 0,
		});
	}

	//intensity
	set intensity(value) {
		this.uniforms.intensity = value;
	}
	get intensity() {
		return this.uniforms.intensity;
	}

	//uRes
	set uRes(value) {
		console.log(value);
		this.uniforms.uRes.x = value.x;
		this.uniforms.uRes.y = value.y;
	}
	get uRes() {
		return this.uniforms.uRes;
	}
}

export { BloomShader };
