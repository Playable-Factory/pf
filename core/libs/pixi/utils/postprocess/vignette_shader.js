const fragShader = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
#define highmedp highp
#else
#define highmedp mediump
#endif
precision highmedp float;

uniform sampler2D uSampler;
varying vec2 vTextureCoord;

uniform float offset;
uniform float animateRatio;
uniform float animateSpeed;
uniform float time;
uniform vec3 color;

void main(void)
{
	vec4 texel = vec4(1.0, 1.0, 1.0, 1.0);
	vec2 uv = ( vTextureCoord - vec2( 0.5 ) ) * vec2( offset - animateRatio * abs(sin(time * animateSpeed)) );

	vec3 newColor = mix( texel.rgb, vec3(0.0, 0.0, 0.0), dot( uv, uv ) );

	newColor.r = max(0.0, newColor.r);
	newColor.g = max(0.0, newColor.g);
	newColor.b = max(0.0, newColor.b);

	float rat = min(newColor.r, newColor.g);
	rat = min(rat, newColor.b);

	vec4 defColor = texture2D( uSampler, vTextureCoord );


	vec3 tempColor = vec3(
		color.r * (1.0 - rat) + defColor.r * newColor.r,
		color.g * (1.0 - rat) + defColor.g * newColor.g,
		color.b * (1.0 - rat) + defColor.b * newColor.b
	);
	
	gl_FragColor = vec4( tempColor, 1.0 );

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

class VignetteShader extends PIXI.Filter {
	constructor() {
		super(null, fragShader, {
			offset: 2,
			color: [1.0, 0.0, 0.0],
			animateRatio: 0,
			animateSpeed: 1,
			time: 0,
		});
	}

	set offset(value) {
		this.uniforms.offset = value;
	}

	get offset() {
		return this.uniforms.offset;
	}

	//color
	set color(hex) {
		hex = hex.replace("#", "");

		// Split the hex value into red, green, and blue components
		const r = parseInt(hex.substring(0, 2), 16) / 255;
		const g = parseInt(hex.substring(2, 4), 16) / 255;
		const b = parseInt(hex.substring(4, 6), 16) / 255;

		// Return the RGB values as an array
		this.uniforms.color = [r, g, b];
	}

	get color() {
		return this.uniforms.color;
	}
	//animateRatio
	set animateRatio(value) {
		this.uniforms.animateRatio = value;
	}

	get animateRatio() {
		return this.uniforms.animateRatio;
	}
	//animateSpeed
	set animateSpeed(value) {
		this.uniforms.animateSpeed = value;
	}

	get animateSpeed() {
		return this.uniforms.animateSpeed;
	}
	//time
	set time(value) {
		// console.log(value);
		this.uniforms.time = value * 10;
	}

	get time() {
		return this.uniforms.time;
	}
}

export { VignetteShader };
