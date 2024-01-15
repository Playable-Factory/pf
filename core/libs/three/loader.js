import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
let loader = new GLTFLoader();

// #if process.pfData.assets3D.draco || process.pfData.isDevelepoment
// import { DDSLoader } from 'three/examples/jsm/loaders/DDSLoader.js';
////draco loader with wasm support, faster but higher filesize
import { DRACOLoader } from "./utils/DRACOLoader.js";
// import { DRACOLoader} from '../utils/DRACOLoaderOnlyJS.js';
// console.log("draco");

const dracoLoader = new DRACOLoader();
loader.setDRACOLoader(dracoLoader);
// loader.setDDSLoader( new DDSLoader() );
// #endif

// #if process.pfData.assets3D.zip
import JSZip from "jszip";
// #endif

// #if process.pfData.assets3D.fbx
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
// #endif

// #if process.pfData.assets3D.brotli
let unbrotli = require("../../brotli/unbrotli");
// #endif

// #if process.pfData.assets3D.meshopt
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module";
loader.setMeshoptDecoder(MeshoptDecoder);
// #endif

import { TextureLoader } from "three";

class Loader {
	constructor() {}

	loadModels(models, callback) {
		let modelsToLoad = models;

		let totalModel = modelsToLoad.length;
		let modelLoaded = 0;
		let list = {};

		////No assets to load, return
		if (modelsToLoad.length == 0) {
			setTimeout(() => {
				callback(list);
			}, 100);
			return;
		}

		let modelLoadedCallback = (name, gltf) => {
			list[name] = gltf;

			modelLoaded++;
			if (modelLoaded >= totalModel) {
				callback(list);
			}
		};

		for (let md of modelsToLoad) {
			///check if it is a brotli file
			if (md.type == "brotli") {
				loadBrotliModel(md, modelLoadedCallback, loader);
				continue;
			}

			///FBX
			if (md.type == "fbx" || md.type == "fbx-br") {
				if (!fbxLoader) fbxLoader = new FBXLoader();

				let str = md.model.replace("data:;base64,", "");
				let str2 = atob(str)
					.split("")
					.map((a) => a.charCodeAt(0));
				let n2 = new Uint8Array(str2);

				if (md.type == "fbx-br") {
					n2 = unbrotli(n2);
				}

				let obj = fbxLoader.parse(n2.buffer, "");
				modelLoadedCallback(md.name, {
					scene: obj,
					animations: obj.animations,
				});
				continue;
			}

			///GLB

			if (md.type == "glb-br") {
				decompressArrayBuffer(md.model.slice(13)).then(function (blob) {
					let model = "data:model/gltf-binary;base64," + _arrayBufferToBase64(blob);

					loader.load(model, (gltf) => {
						modelLoadedCallback(md.name, gltf);
					});
				});

				continue;
			}

			if (md.type == "glb") {
				loader.load(md.model, (gltf) => {
					modelLoadedCallback(md.name, gltf);
				});

				continue;
			}

			///check if it is a zip file
			if (md.gltf.indexOf("data:application/zip;base64") == 0) {
				loadZipModel(md, modelLoadedCallback, loader);
				continue;
			}

			if (md.isUrl) {
				loader.load(md.gltf, (gltf) => {
					modelLoadedCallback(md.name, gltf);
				});
			} else {
				md.gltf = JSON.stringify(JSON.parse(md.gltf));
				loader.parse(md.gltf, "", (gltf) => {
					modelLoadedCallback(md.name, gltf);
				});
			}
		}
	}

	loadTextures(storage, textures) {
		var textureLoader = new TextureLoader();

		let loadTexture = (src, storageName) => {
			if (storage.hasItem("texture", storageName)) {
				console.warn("Already exist in the storage!");
				return;
			}

			let texture = textureLoader.load(src);

			storage.addItem("texture", storageName, texture);
			return texture;
		};

		for (var item of textures) {
			loadTexture(item.src, item.name);
		}
	}
}

export default Loader;

/////////////ZIP LOADER
function base64toBlob(base64Data, contentType) {
	contentType = contentType || "";
	let sliceSize = 1024;
	let byteCharacters = atob(base64Data);
	let bytesLength = byteCharacters.length;
	let slicesCount = Math.ceil(bytesLength / sliceSize);
	let byteArrays = new Array(slicesCount);

	for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
		let begin = sliceIndex * sliceSize;
		let end = Math.min(begin + sliceSize, bytesLength);

		let bytes = new Array(end - begin);
		for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
			bytes[i] = byteCharacters[offset].charCodeAt(0);
		}
		byteArrays[sliceIndex] = new Uint8Array(bytes);
	}
	return new Blob(byteArrays, { type: contentType });
}

function loadZipModel(md, callback, loader) {
	let zipFile = md.gltf;
	let [match, contentType, base64] = zipFile.match(/^data:(.+);base64,(.*)$/);

	let blob = base64toBlob(base64, contentType);

	new Promise(function (resolve, reject) {
		resolve(JSZip.loadAsync(blob));
	})
		.then(function (zip) {
			let fileMap = {};
			let pendings = [];

			for (let file in zip.files) {
				let entry = zip.file(file);
				if (entry === null) continue;
				pendings.push(
					entry.async("blob").then(
						function (file, blob) {
							fileMap[file] = URL.createObjectURL(blob);
						}.bind(this, file)
					)
				);
			}

			return Promise.all(pendings).then(function () {
				return fileMap;
			});
		})
		.then(function (fileMap) {
			let numOfAssets = Object.keys(fileMap).length;
			let assetsLoaded = 0;

			let gltf,
				images = {},
				bin;
			function itemLoaded(item, data) {
				let name = data.name;
				let type = data.type;
				let fileType = name.slice(name.lastIndexOf(".") + 1);

				//name = name.slice(name.indexOf("/")+1);
				if (type == "image") {
					name = name.slice(name.lastIndexOf("textures/"));
				} else {
					name = name.slice(name.lastIndexOf("/") + 1);
				}

				if (type == "gltf") {
					gltf = item;
				} else if (type == "image") {
					item = item.replace("data:text/plain;base64", "data:image/" + fileType + ";base64");
					images[name] = item;
				} else if (type == "bin") {
					item = item.replace("data:text/plain;base64", "data:application/octet-stream;base64");
					bin = { name, item };
				}

				assetsLoaded++;

				if (assetsLoaded >= numOfAssets) {
					if (gltf.buffers) {
						gltf.buffers[0].uri = bin.item;
					}
					if (gltf.images) {
						for (let i = 0; i < gltf.images.length; i++) {
							gltf.images[i].uri = images[gltf.images[i].uri];
						}
					}

					gltf = JSON.stringify(gltf);

					loader.parse(gltf, "", (gltf) => {
						callback(md.name, gltf);
					});
				}
			}

			for (let prop in fileMap) {
				let file = fileMap[prop];

				if (prop.indexOf(".gltf") >= 0) {
					fetch(file)
						.then((response) => response.json())
						.then((json) => itemLoaded(json, { name: prop, type: "gltf" }));
				} else if (prop.indexOf(".bin") >= 0) {
					fetch(file)
						.then((response) => response.blob())
						.then((blob) => {
							let reader = new FileReader();
							reader.onload = function () {
								itemLoaded(this.result, { name: prop, type: "bin" });
							}; // <--- `this.result` contains a base64 data URI
							reader.readAsDataURL(blob);
						});
				} else {
					fetch(file)
						.then((response) => response.blob())
						.then((blob) => {
							let reader = new FileReader();
							reader.onload = function () {
								itemLoaded(this.result, { name: prop, type: "image" });
							}; // <--- `this.result` contains a base64 data URI
							reader.readAsDataURL(blob);
						});
				}
			}
		})
		.catch();
}

////BROTLI LOADER

function decompress(e, n) {
	return unbrotli(_base64ToArrayBuffer(e));
}

function _base64ToArrayBuffer(e) {
	let decoded = window.atob(e);
	let len = decoded.length;
	let arr = new Uint8Array(len);

	for (let i = 0; i < len; i++) {
		arr[i] = decoded.charCodeAt(i);
	}

	return arr;
}

function decompressString(str) {
	return new Promise(function (resolve, reject) {
		resolve(new TextDecoder("utf-8").decode(decompress(str)));
	});
}

function decompressArrayBuffer(arr) {
	return new Promise(function (resolve, reject) {
		resolve(decompress(arr).buffer);
	});
}

function _arrayBufferToBase64(buffer) {
	let binary = "";
	let bytes = new Uint8Array(buffer);
	let len = bytes.byteLength;
	for (let i = 0; i < len; i++) {
		binary += String.fromCharCode(bytes[i]);
	}
	return window.btoa(binary);
}

function loadBrotliModel(md, callback, loader) {
	let gltfBr = md.gltf.gltf;
	let binBr = md.gltf.bin;
	let textures = md.gltf.textures;

	gltfBr = gltfBr.slice(13);
	binBr = binBr.slice(13);

	let gltf;
	let bin;

	decompressString(gltfBr).then(function (_gltf) {
		gltf = _gltf;
		modelCompressed();
	});

	decompressArrayBuffer(binBr).then(function (blob) {
		bin = "data:application/octet-stream;base64," + _arrayBufferToBase64(blob);
		modelCompressed();
	});

	function modelCompressed() {
		if (!bin || !gltf) return;

		gltf = gltf.replace("scene.bin", bin);

		// for (let tex in textures) {
		// 	gltf = gltf.replace(tex, textures[tex]);
		// }
		for (let tex in textures) {
			let regex = new RegExp(tex, "g");
			gltf = gltf.replace(regex, textures[tex]);
		}

		loader.parse(gltf, "", (gltf) => {
			callback(md.name, gltf);
		});
	}
}
