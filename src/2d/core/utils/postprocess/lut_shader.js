import { Filter } from "pixi.js-legacy";

const fragShader = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
#define highmedp highp
#else
#define highmedp mediump
#endif
precision highmedp float;

#define FILTER_LUT true

uniform sampler2D uSampler;
uniform sampler2D lutMap;
uniform float lutMapSize;
uniform float lutPower;

varying vec2 vTextureCoord;

vec4 sampleAs3DTexture(sampler2D tex, vec3 texCoord, float size) {
        
    float sliceSize = 1.0 / size;                  // space of 1 slice
    float slicePixelSize = sliceSize / size;       // space of 1 pixel
    float width = size - 1.0;
    float sliceInnerSize = slicePixelSize * width; // space of size pixels
    float zSlice0 = floor( texCoord.z * width);
    float zSlice1 = min( zSlice0 + 1.0, width);
    float xOffset = slicePixelSize * 0.5 + texCoord.x * sliceInnerSize;
    float yRange = (texCoord.y * width + 0.5) / size;
    float s0 = xOffset + (zSlice0 * sliceSize);


    float s1 = xOffset + (zSlice1 * sliceSize);
    vec4 slice0Color = texture2D(tex, vec2(s0, yRange));
    vec4 slice1Color = texture2D(tex, vec2(s1, yRange));
    float zOffset = mod(texCoord.z * width, 1.0);
    return mix(slice0Color, slice1Color, zOffset);
}

void main(void)
{
    vec4 originalColor = texture2D(uSampler, vTextureCoord);
    vec4 originalColor2 = texture2D(lutMap, vTextureCoord);
    vec4 luttedColor = sampleAs3DTexture(lutMap, originalColor.rgb, lutMapSize);
    gl_FragColor = mix(originalColor, luttedColor, lutPower);
    
    // gl_FragColor = originalColor;
    
    // gl_FragColor = luttedColor;
    //    vec2 uvs = vTextureCoord.xy;
    //    vec4 fg = texture2D(uSampler, vTextureCoord);
    //    fg.r = uvs.y + sin(customUniform);
    //    gl_FragColor = fg;

}

`;

class LutShader extends Filter {
	constructor() {
		super(null, fragShader, {
			lutMap: null,
			lutMapSize: 8.0,
			lutPower: 1.0,
			time: 0,
		});
	}

	get lutPower() {
		return this.uniforms.lutPower;
	}

	set lutPower(value) {
        console.log("lutPower", value)
		this.uniforms.lutPower = value;
	}

	get lutMapSize() {
		return this.uniforms.lutMapSize;
	}

	set lutMapSize(value) {
		this.uniforms.lutMapSize = value;
	}

	get lutMap() {
		return this.uniforms.lutMap;
	}

	set lutMap(value) {
		this.uniforms.lutMap = value;
	}
}

export { LutShader };
