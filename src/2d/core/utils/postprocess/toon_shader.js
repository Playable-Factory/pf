import { Point } from "pixi.js-legacy";

const fragShader = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
#define highmedp highp
#else
#define highmedp mediump
#endif
precision highmedp float;

uniform vec2 uRes;
uniform vec3 outlineColor;
uniform float edgeSens;
// uniform float magnitude;

uniform sampler2D uSampler;
varying vec2 vTextureCoord;

float applyKernel(mat3 gx, mat3 gy, sampler2D sampler, vec2 outTexCoord) {
    float final = 0.0;    
   
    float horizontal = 0.0;
    float vertical = 0.0;
    
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 3; j++) {
          vec2 d = vec2(float(i), float(j)) / uRes;
          float averagePixel = dot(texture2D(sampler, outTexCoord+d).xyz, vec3(edgeSens));
            
          horizontal += averagePixel * gx[i][j];
          vertical += averagePixel * gy[i][j];
        }
    }
    
    final = sqrt(horizontal * horizontal + vertical * vertical);
    return final;
}

void main(void)
{
    mat3 Gx = mat3(-1.0, 0.0, 1.0,
        -2.0, 0.0, 2.0,
        -1.0, 0.0, 1.0);

    mat3 Gy = mat3(-1.0, -2.0, -1.0,
        0.0, 0.0, 0.0,
        1.0, 2.0, 1.0);

    vec4 color = texture2D(uSampler, vTextureCoord);
    float edgeIntensity = applyKernel(Gx, Gy, uSampler, vTextureCoord);
    
    vec4 edgeColor = mix(        
        vec4(outlineColor, 1.0),
        color,
        1.0-edgeIntensity);
    
    color = mix(
        color,
        edgeColor,
        1.0);
    
    gl_FragColor = color;

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

class ToonShader extends PIXI.Filter {
	constructor() {
		super(null, fragShader, {
			outlineColor: [1, 0, 0],
			edgeSens: 0,
			uRes: new Point(800, 600),
		});
	}

	//edgeSens
	set edgeSens(value) {
		this.uniforms.edgeSens = value;
	}
	get edgeSens() {
		return this.uniforms.edgeSens;
	}

	//uRes
	set uRes(value) {
		this.uniforms.uRes.x = value.x;
		this.uniforms.uRes.y = value.y;
	}
	get uRes() {
		return this.uniforms.uRes;
	}

	//outlineColor
	set outlineColor(hex) {
		hex = hex.replace("#", "");

		// Split the hex value into red, green, and blue components
		const r = parseInt(hex.substring(0, 2), 16) / 255;
		const g = parseInt(hex.substring(2, 4), 16) / 255;
		const b = parseInt(hex.substring(4, 6), 16) / 255;

		// Return the RGB values as an array
		this.uniforms.outlineColor = [r, g, b];
	}

	get outlineColor() {
		return this.uniforms.outlineColor;
	}
}

export { ToonShader };
