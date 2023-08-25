const fragShader = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
#define highmedp highp
#else
#define highmedp mediump
#endif
precision highmedp float;

uniform sampler2D uSampler;
uniform float hue;
uniform float saturation;

varying vec2 vTextureCoord;



void main(void)
{
	gl_FragColor = texture2D( uSampler, vTextureCoord );

	// hue
	float angle = hue * 3.14159265;
	float s = sin(angle), c = cos(angle);
	vec3 weights = (vec3(2.0 * c, -sqrt(3.0) * s - c, sqrt(3.0) * s - c) + 1.0) / 3.0;
	float len = length(gl_FragColor.rgb);
	gl_FragColor.rgb = vec3(
		dot(gl_FragColor.rgb, weights.xyz),
		dot(gl_FragColor.rgb, weights.zxy),
		dot(gl_FragColor.rgb, weights.yzx)
	);

	// saturation
	float average = (gl_FragColor.r + gl_FragColor.g + gl_FragColor.b) / 3.0;
	if (saturation > 0.0) {
		gl_FragColor.rgb += (average - gl_FragColor.rgb) * (1.0 - 1.0 / (1.001 - saturation));
	} else {
		gl_FragColor.rgb += (average - gl_FragColor.rgb) * (-saturation);
	}

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

class HueSaturationShader extends PIXI.Filter {
	constructor() {
		super(null, fragShader, {
			hue: 0,
			saturation: 0,
		});
	}

	set hue(value) {
		this.uniforms.hue = value;
	}

	set saturation(value) {
		this.uniforms.saturation = value;
	}

	get hue() {
		return this.uniforms.hue;
	}

	get saturation() {
		return this.uniforms.saturation;
	}
}

export { HueSaturationShader };
