import { Filter } from "pixi.js-legacy";

const fragShader = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
#define highmedp highp
#else
#define highmedp mediump
#endif

precision highmedp float;

uniform float damp;
uniform sampler2D tOld;

uniform sampler2D uSampler;
varying vec2 vTextureCoord;

vec4 when_gt( vec4 x, float y ) {
	return max( sign( x - y ), 0.0 );
}

void main(void)
{
	vec4 texelOld = texture2D( tOld, vTextureCoord );
	vec4 texelNew = texture2D( uSampler, vTextureCoord );

	texelOld *= damp * when_gt( texelOld, 0.1 );
	
	gl_FragColor = texelOld;

	// vec2 dxy = pixelSize / uRes;
	// vec2 coord = dxy * floor( vTextureCoord / dxy );
	// gl_FragColor = texture2D(uSampler, coord);

}

`;

class PixelShader extends Filter {
	constructor() {
		super(null, fragShader, {
			damp: 0.96,
			tOld,
		});
	}
	//tOld
	get tOld() {
		return this.uniforms.tOld;
	}

	set tOld(value) {
		this.uniforms.tOld = value;
	}

	//damp
	set damp(value) {
		this.uniforms.damp = value;
	}
	get damp() {
		return this.uniforms.damp;
	}
}

export { PixelShader };
