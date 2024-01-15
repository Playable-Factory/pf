/**
 * Vignette shader
 * based on PaintEffect postprocess from ro.me
 * http://code.google.com/p/3-dreams-of-black/source/browse/deploy/js/effects/PaintEffect.js
 */

 import { Color } from "three";

 var VignetteShader = {
 
     uniforms: {
 
         'tDiffuse': { value: null },
         'offset': { value: 1.0 },
         'color': { value: new Color(0) },
         'animateRatio': { value: 0.5 },
         'animateSpeed': { value: 0.1 },
         'time': { value: 0 },
 
     },
 
     vertexShader: [
 
         'varying vec2 vUv;',
 
         'void main() {',
 
         '	vUv = uv;',
         '	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
 
         '}'
 
     ].join( '\n' ),
 
     fragmentShader: [
 
         'uniform float offset;',
         'uniform float animateRatio;',
         'uniform float animateSpeed;',
         'uniform float time;',
         'uniform vec3 color;',
 
         'uniform sampler2D tDiffuse;',
 
         'varying vec2 vUv;',
 
         'void main() {',
 
         // Eskil's vignette
 
         '	vec4 texel = vec4(1.0, 1.0, 1.0, 1.0);',
         '	vec2 uv = ( vUv - vec2( 0.5 ) ) * vec2( offset - animateRatio * abs(sin(time * animateSpeed)) );',
         `
            vec3 newColor = mix( texel.rgb, vec3(0.0, 0.0, 0.0), dot( uv, uv ) );

            newColor.r = max(0.0, newColor.r);
            newColor.g = max(0.0, newColor.g);
            newColor.b = max(0.0, newColor.b);

            // newColor.r = min(1.0, newColor.r);
            // newColor.g = min(1.0, newColor.g);
            // newColor.b = min(1.0, newColor.b);

            float rat = min(newColor.r, newColor.g);
            rat = min(rat, newColor.b);

            vec4 defColor = texture2D( tDiffuse, vUv );


            vec3 tempColor = vec3(
                color.r * (1.0 - rat) + defColor.r * newColor.r,
                color.g * (1.0 - rat) + defColor.g * newColor.g,
                color.b * (1.0 - rat) + defColor.b * newColor.b
            );    
            
            // tempColor = vec3(
            //     newColor.r,
            //     newColor.g,
            //     newColor.b
            // ); 
            
            gl_FragColor = vec4( tempColor, 1.0 );             
            

         `,
        //  '	gl_FragColor = vec4( mix( texel.rgb, color, dot( uv, uv ) ), 1.0 );',
 
         /*
         // alternative version from glfx.js
         // this one makes more "dusty" look (as opposed to "burned")
 
         "	vec4 color = texture2D( tDiffuse, vUv );",
         "	float dist = distance( vUv, vec2( 0.5 ) );",
         "	color.rgb *= smoothstep( 0.8, offset * 0.799, dist *( darkness + offset ) );",
         "	gl_FragColor = color;",
         */
 
         '}'
 
     ].join( '\n' )
 
 };
 
 export { VignetteShader };
 