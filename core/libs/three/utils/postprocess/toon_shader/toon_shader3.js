import { Color, Vector2 } from 'three';

/**
 * Sobel Edge Detection (see https://youtu.be/uihBwtPIBxM)
 *
 * As mentioned in the video the Sobel operator expects a grayscale image as input.
 *
 */

var ToonShader = {

	uniforms: {

		'tDiffuse': { value: null },
		'outlineColor': { value: new Color(0) },
		'edgeSens': { value: 0.5 },
		'magnitude': { value: 0.6 },
		'resolution': { value: new Vector2(800, 600) },

	},

	vertexShader: [

		'varying vec2 vUv;',

		'void main() {',

		       'vUv = uv;',

		       'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',

		'}'
	].join( '\n' ),

	fragmentShader: [

		'uniform sampler2D tDiffuse;',
		'uniform vec2 resolution;',
		'uniform vec3 outlineColor;',
		'uniform float edgeSens;',
		'uniform float magnitude;',
		'varying vec2 vUv;',

        `
        mat3 calcLookAtMatrix(vec3 origin, vec3 target, float roll) {
            vec3 rr = vec3(sin(roll), cos(roll), 0.0);
            vec3 ww = normalize(target - origin);
            vec3 uu = normalize(cross(ww, rr));
            vec3 vv = normalize(cross(uu, ww));
          
            return mat3(uu, vv, ww);
          }
          
          vec3 getRay(vec3 origin, vec3 target, vec2 screenPos, float lensLength) {
            mat3 camMat = calcLookAtMatrix(origin, target, 0.0);
            return normalize(camMat * vec3(screenPos, lensLength));
          }
          
          vec2 squareFrame(vec2 screenSize, vec2 coord) {
            vec2 position = 2.0 * (coord.xy / screenSize.xy) - 1.0;
            position.x *= screenSize.x / screenSize.y;
            return position;
          }
          
        vec2 getDeltas(sampler2D buffer, vec2 uv) {
            vec2 pixel = vec2(1. / resolution);
            vec3 pole = vec3(-1, 0, +1);
            float dpos = 0.0;
            float dnor = 0.0;
            
            vec4 s0 = texture(tDiffuse, uv + pixel.xy * pole.xx); // x1, y1
            vec4 s1 = texture(tDiffuse, uv + pixel.xy * pole.yx); // x2, y1
            vec4 s2 = texture(tDiffuse, uv + pixel.xy * pole.zx); // x3, y1
            vec4 s3 = texture(tDiffuse, uv + pixel.xy * pole.xy); // x1, y2
            vec4 s4 = texture(tDiffuse, uv + pixel.xy * pole.yy); // x2, y2
            vec4 s5 = texture(tDiffuse, uv + pixel.xy * pole.zy); // x3, y2
            vec4 s6 = texture(tDiffuse, uv + pixel.xy * pole.xz); // x1, y3
            vec4 s7 = texture(tDiffuse, uv + pixel.xy * pole.yz); // x2, y3
            vec4 s8 = texture(tDiffuse, uv + pixel.xy * pole.zz); // x3, y3
        
            dpos = (
            abs(s1.a - s7.a) +
            abs(s5.a - s3.a) +
            abs(s0.a - s8.a) +
            abs(s2.a - s6.a)
            ) * 0.5;
            dpos += (
            max(0.0, 1.0 - dot(s1.rgb, s7.rgb)) +
            max(0.0, 1.0 - dot(s5.rgb, s3.rgb)) +
            max(0.0, 1.0 - dot(s0.rgb, s8.rgb)) +
            max(0.0, 1.0 - dot(s2.rgb, s6.rgb))
            );
            
            dpos = pow(max(dpos - 0.5, 0.0), 5.0);
            
            return vec2(dpos, dnor);
        }
          
        `,
        ``,


		'void main() {',
        `
            vec2 uv = vUv;
            // vec2 uv = gl_FragCoord.xy / resolution;
            float iTime = 0.0;

            vec3 ro = vec3(sin(iTime * 0.2), 1.5, cos(iTime * 0.2)) * 5.;
            vec3 ta = vec3(0, 0, 0);
            vec3 rd = getRay(ro, ta, squareFrame(resolution, gl_FragCoord.xy), 2.0);
                
            vec4 buf = texture(tDiffuse, gl_FragCoord.xy / resolution);
            float t = buf.a;
            vec3 nor = buf.rgb;
            vec3 pos = ro + rd * t;
                
            vec3 col = vec3(0.5, 0.8, 1);
            vec2 deltas = getDeltas(tDiffuse, uv);
            if (t > -0.5) {
                col = vec3(1.0);
                col *= max(0.3, 0.3 + dot(nor, normalize(vec3(0, 1, 0.5))));
                col *= vec3(1, 0.8, 0.35);
            }
            col.r = smoothstep(0.1, 1.0, col.r);
            col.g = smoothstep(0.1, 1.1, col.g);
            col.b = smoothstep(-0.1, 1.0, col.b);
            col = pow(col, vec3(1.1));
            col -= deltas.x - deltas.y;
            
                
            gl_FragColor = vec4(col, 1);
            

        `,
        // `
        //        vec2 texel = vec2( 1.0 / resolution.x, 1.0 / resolution.y ) ;

		// // kernel definition (in glsl matrices are filled in column-major order)

		//        const mat3 Gx = mat3( -1, -2, -1, 0, 0, 0, 1, 2, 1 ) ; // x direction kernel
		//        const mat3 Gy = mat3( -1, 0, 1, -2, 0, 2, -1, 0, 1 ) ; // y direction kernel

		// // fetch the 3x3 neighbourhood of a fragment

		// // first column

		//        float tx0y0 = texture2D( tDiffuse, vUv + texel * vec2( -1, -1 ) ).r ;
		//        float tx0y1 = texture2D( tDiffuse, vUv + texel * vec2( -1,  0 ) ).r ;
		//        float tx0y2 = texture2D( tDiffuse, vUv + texel * vec2( -1,  1 ) ).r ;

		// // second column

		//        float tx1y0 = texture2D( tDiffuse, vUv + texel * vec2(  0, -1 ) ).r ;
		//        float tx1y1 = texture2D( tDiffuse, vUv + texel * vec2(  0,  0 ) ).r ;
		//        float tx1y2 = texture2D( tDiffuse, vUv + texel * vec2(  0,  1 ) ).r ;

		// // third column

		//        float tx2y0 = texture2D( tDiffuse, vUv + texel * vec2(  1, -1 ) ).r ;
		//        float tx2y1 = texture2D( tDiffuse, vUv + texel * vec2(  1,  0 ) ).r ;
		//        float tx2y2 = texture2D( tDiffuse, vUv + texel * vec2(  1,  1 ) ).r ;

		// // gradient value in x direction

		//        float valueGx = Gx[0][0] * tx0y0 + Gx[1][0] * tx1y0 + Gx[2][0] * tx2y0 + 
		//        	Gx[0][1] * tx0y1 + Gx[1][1] * tx1y1 + Gx[2][1] * tx2y1 + 
		//        	Gx[0][2] * tx0y2 + Gx[1][2] * tx1y2 + Gx[2][2] * tx2y2;

		// // gradient value in y direction

		//        float valueGy = Gy[0][0] * tx0y0 + Gy[1][0] * tx1y0 + Gy[2][0] * tx2y0 + 
		//        	Gy[0][1] * tx0y1 + Gy[1][1] * tx1y1 + Gy[2][1] * tx2y1 + 
		//        	Gy[0][2] * tx0y2 + Gy[1][2] * tx1y2 + Gy[2][2] * tx2y2;

		// // magnitute of the total gradient

		//        float G = sqrt( ( valueGx * valueGx ) + ( valueGy * valueGy ) ) ;

		//        gl_FragColor = vec4( vec3( G ), 1 ) ;
		

        // `,
		'}'

	].join( '\n' )

};

export { ToonShader };
