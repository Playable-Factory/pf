import { Pass } from "three/examples/jsm/postprocessing/Pass";

class EffekseerRenderPass extends Pass {
	constructor(scene, camera, context) {
	  super();
	  this.scene = scene;
	  this.camera = camera;
	  this.context = context;
	  this.needsSwap = false;
	}
	render(renderer, writeBuffer, readBuffer /*, deltaTime, maskActive */) {
	  renderer.setRenderTarget( this.renderToScreen ? null : readBuffer );
	  this.context.setProjectionMatrix(this.camera.projectionMatrix.elements);
	  this.context.setCameraMatrix(this.camera.matrixWorldInverse.elements);
	  this.context.draw();
	}
}

export default EffekseerRenderPass;