import { Point, Filter } from "pixi.js-legacy";

const fragShader = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
#define highmedp highp
#else
#define highmedp mediump
#endif
#define PI 3.141592653589793

precision highmedp float;

uniform float time;
uniform bool grayscale;
uniform float nIntensity;
uniform float sIntensity;
uniform float sCount;


uniform sampler2D uSampler;
varying vec2 vTextureCoord;

highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}

void main(void)
{
	// sample the source
	vec4 cTextureScreen = texture2D( uSampler, vTextureCoord );

	// make some noise
	float dx = rand( vTextureCoord + time );

	// add noise
	vec3 cResult = cTextureScreen.rgb + cTextureScreen.rgb * clamp( 0.1 + dx, 0.0, 1.0 );

	// get us a sine and cosine
	vec2 sc = vec2( sin( vTextureCoord.y * sCount ), cos( vTextureCoord.y * sCount ) );

	// add scanlines
	cResult += cTextureScreen.rgb * vec3( sc.x, sc.y, sc.x ) * sIntensity;

	// interpolate between source and result by intensity
	cResult = cTextureScreen.rgb + clamp( nIntensity, 0.0,1.0 ) * ( cResult - cTextureScreen.rgb );

	// convert to grayscale if desired
	if( grayscale ) {
		cResult = vec3( cResult.r * 0.3 + cResult.g * 0.59 + cResult.b * 0.11 );
	}

	gl_FragColor =  vec4( cResult, cTextureScreen.a );
	
	// vec2 dxy = pixelSize / uRes;
	// vec2 coord = dxy * floor( vTextureCoord / dxy );
	// gl_FragColor = texture2D(uSampler, coord);

    

}

`;

class FilmShader extends Filter {
	constructor() {
		super(null, fragShader, {
			time: 0.0,
			nIntensity: 0.5,
			sIntensity: 0.05,
			sCount: 4096,
			grayscale: 0.0,
		});
	}

	//time
	set time(value) {
		this.uniforms.time = value;
	}
	get time() {
		return this.uniforms.time;
	}
	//nIntensity
	set nIntensity(value) {
		this.uniforms.nIntensity = value;
	}
	get nIntensity() {
		return this.uniforms.nIntensity;
	}
	//sIntensity
	set sIntensity(value) {
		this.uniforms.sIntensity = value;
	}
	get sIntensity() {
		return this.uniforms.sIntensity;
	}
	//sCount
	set sCount(value) {
		this.uniforms.sCount = value;
	}
	get sCount() {
		return this.uniforms.sCount;
	}
	//grayscale
	set grayscale(value) {
		this.uniforms.grayscale = value;
	}
	get grayscale() {
		return this.uniforms.grayscale;
	}
	
}

export { FilmShader };
