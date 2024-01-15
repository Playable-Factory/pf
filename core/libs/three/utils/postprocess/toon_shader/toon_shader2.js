import { Color, Vector2 } from 'three';

/**
 * Sobel Edge Detection (see https://youtu.be/uihBwtPIBxM)
 *
 * As mentioned in the video the Sobel operator expects a grayscale image as input.
 *
 */

var ToonShader2 = {

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
        float applyKernel(mat3 gx, mat3 gy, sampler2D sampler, vec2 uv) {
            float final = 0.0;
            
           
            float horizontal = 0.0;
            float vertical = 0.0;
            
            for (int i = 0; i < 3; i++) {
                for (int j = 0; j < 3; j++) {
                  vec2 d = vec2(float(i), float(j)) / resolution;
                  float averagePixel = dot(texture2D(sampler, uv+d).xyz, vec3(edgeSens));
                    
                  horizontal += averagePixel * gx[i][j];
                  vertical += averagePixel * gy[i][j];
                }
            }
            
            final = sqrt(horizontal * horizontal + vertical * vertical);
            return final;
        }
        `,
        ``,


		'void main() {',
        `
            mat3 Gx = mat3(-1.0, 0.0, 1.0,
                -2.0, 0.0, 2.0,
                -1.0, 0.0, 1.0);

            mat3 Gy = mat3(-1.0, -2.0, -1.0,
                0.0, 0.0, 0.0,
                1.0, 2.0, 1.0);
            
            vec2 uv = vUv;

            vec4 color = texture2D(tDiffuse, uv);
            float edgeIntensity = applyKernel(Gx, Gy, tDiffuse, uv);
            
            vec4 edgeColor = mix(        
                vec4(outlineColor, 1.0),
                color,
                1.0-edgeIntensity);
            
            color = mix(
                color,
                edgeColor,
                1.0);
            
            gl_FragColor = edgeColor;

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

export { ToonShader2 };
