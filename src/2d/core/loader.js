import { TextureAtlas } from "pixi-spine";
import { SkeletonJson, AtlasAttachmentLoader } from "@pixi-spine/runtime-4.1";
//import { glTFAsset } from "pixi3d";
import { Assets } from "@pixi/assets";
import { Spritesheet, utils } from "pixi.js-legacy";

//Assets.loader._parsers[0].config.preferWorkers = false;
/**
 * Class responsible for loading various types of assets in a 2D game.
 */
class Loader2D {
	constructor() { }

	/**
	 * Load a list of assets and call the callback when all assets are loaded.
	 * @param {Object[]} assetList - List of asset objects to load.
	 * @param {Function} callback - Callback function to execute after all assets are loaded.
	 */
	load(assetList, callback) {
		let loadAsset = (asset) => {
			// let asset = assetList[i];
			// if (!asset) {
			// 	return;
			// }
			if (asset.type == "image") {
				this.loadImage(asset.key, asset.src, assetLoaded);
			} else if (asset.type == "atlas") {
				this.loadAtlas(asset.key, asset.src, asset.json, assetLoaded);
			} else if (asset.type == "video") {
				this.loadVideo(asset.key, asset.src, assetLoaded);
			} else if (asset.type == "spine") {
				this.loadSpine(asset.key, asset.src, asset.json, asset.atlas, assetLoaded);
			} else if (asset.type == "bitmapFont") {
				this.loadBitmapFont(asset.key, asset.src, asset.xml, assetLoaded);
			} else if (asset.type == "gltf") {
				this.loadGltf(asset.key, asset.src, assetLoaded);
			}
			// else if (asset.type == "sound") {
			// 	this.loadSound(asset.key, asset.src, asset.json, assetLoaded);
			// }
		};

		let numOfAssetLoaded = 0;
		let totalAssetToLoad = assetList.length;

		let loadedAsset = 0;
		loadAsset(loadedAsset);

		function assetLoaded() {
			numOfAssetLoaded++;
			if (numOfAssetLoaded >= totalAssetToLoad) {
				callback && callback();
				callback = null;
			}
			// if (numOfAssetLoaded < totalAssetToLoad) {
			// 	loadAsset(numOfAssetLoaded);
			// } else {
			// 	callback();
			// }
		}

		for (let i = 0; i < assetList.length; i++) {
			let asset = assetList[i];
			loadAsset(asset);
		}

		if (assetList.length == 0) {
			setTimeout(() => {
				callback && callback();
				callback = null;
			}, 100);
		}
	}

	/**
	 * Load a Spine animation.
	 * @param {string} key - Key to identify the loaded asset.
	 * @param {string} imageFile - Image file path.
	 * @param {string} jsonData - JSON data for the Spine animation.
	 * @param {string} atlasData - Atlas data for the Spine animation.
	 * @param {Function} callback - Callback function to execute after the Spine animation is loaded.
	 */
	async loadSpine(key, imageFile, jsonData, atlasData, callback) {
		Assets.add(key, imageFile);
		await Assets.load(key);
		var spineAtlas = new TextureAtlas(atlasData, function (line, cb) {
			// pass the image here.
			cb(PIXI.utils.TextureCache[key]);
		}); // specify path, image.png will be added automatically

		var spineAtlasLoader = new AtlasAttachmentLoader(spineAtlas);
		var spineJsonParser = new SkeletonJson(spineAtlasLoader);
		var spineData = spineJsonParser.readSkeletonData(jsonData);

		PIXI.utils.TextureCache[key].spineData = spineData;
		callback();
	}

	/**
	 * Load a bitmap font.
	 * @param {string} key - Key to identify the loaded asset.
	 * @param {string} imageFile - Image file path.
	 * @param {string} xmlData - XML data for the bitmap font.
	 * @param {Function} callback - Callback function to execute after the bitmap font is loaded.
	 */
	async loadBitmapFont(key, imageFile, xmlData, callback) {
		const parse = function (xml) {
			var data = new PIXI.BitmapFontData();
			var info = xml.getElementsByTagName("info");
			var common = xml.getElementsByTagName("common");
			var page = xml.getElementsByTagName("page");
			var char = xml.getElementsByTagName("char");
			var kerning = xml.getElementsByTagName("kerning");
			for (var i = 0; i < info.length; i++) {
				data.info.push({
					face: info[i].getAttribute("face"),
					size: parseInt(info[i].getAttribute("size"), 10),
				});
			}
			for (var i = 0; i < common.length; i++) {
				data.common.push({
					lineHeight: parseInt(common[i].getAttribute("lineHeight"), 10),
				});
			}
			for (var i = 0; i < page.length; i++) {
				data.page.push({
					id: parseInt(page[i].getAttribute("id"), 10) || 0,
					file: page[i].getAttribute("file"),
				});
			}
			for (var i = 0; i < char.length; i++) {
				var letter = char[i];
				data.char.push({
					id: parseInt(letter.getAttribute("id"), 10),
					page: parseInt(letter.getAttribute("page"), 10) || 0,
					x: parseInt(letter.getAttribute("x"), 10),
					y: parseInt(letter.getAttribute("y"), 10),
					width: parseInt(letter.getAttribute("width"), 10),
					height: parseInt(letter.getAttribute("height"), 10),
					xoffset: parseInt(letter.getAttribute("xoffset"), 10),
					yoffset: parseInt(letter.getAttribute("yoffset"), 10),
					xadvance: parseInt(letter.getAttribute("xadvance"), 10),
				});
			}
			for (var i = 0; i < kerning.length; i++) {
				data.kerning.push({
					first: parseInt(kerning[i].getAttribute("first"), 10),
					second: parseInt(kerning[i].getAttribute("second"), 10),
					amount: parseInt(kerning[i].getAttribute("amount"), 10),
				});
			}
			return data;
		};
		let fontTag = document.createElement("font");
		fontTag.innerHTML = xmlData;
		let data = parse(fontTag.childNodes[0]);
		data.info[0].face = key;

		Assets.add(key, imageFile);
		await Assets.load(key);

		PIXI.BitmapFont.install(data, PIXI.utils.TextureCache[key]);
		callback();
	}

	/**
	 * Load an image.
	 * @param {string} key - Key to identify the loaded asset.
	 * @param {string} imageFile - Image file path.
	 * @param {Function} callback - Callback function to execute after the image is loaded.
	 */
	async loadImage(key, imageFile, callback) {
		Assets.add(key, imageFile);
		await Assets.load(key);
		callback();
	}

	/**
	 * Load a video.
	 * @param {string} key - Key to identify the loaded asset.
	 * @param {string} videoFile - Video file path.
	 * @param {Function} callback - Callback function to execute after the video is loaded.
	 */
	loadVideo(key, videoFile, callback) {
		var video = document.createElement("VIDEO");
		if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
			video.autoplay = true;
		}

		video.setAttribute("playsinline", "playsinline");

		video.addEventListener("canplay", function () {
			// if (globals.isGameStarted) {
			// 	return;
			// }

			var vidRes = new PIXI.VideoResource(video);
			var baseTexture = new PIXI.BaseTexture(vidRes);
			var texture = new PIXI.Texture(baseTexture);
			PIXI.Texture.addToCache(texture, key);
			callback();
		});
		video.src = videoFile;
		video.muted = "muted";
	}

	/**
	 * Load an atlas.
	 * @param {string} key - Key to identify the loaded asset.
	 * @param {string} imageFile - Image file path.
	 * @param {Object} atlasData - Atlas data.
	 * @param {Function} callback - Callback function to execute after the atlas is loaded.
	 */
	async loadAtlas(key, imageFile, atlasData, callback) {
		Assets.add(key, imageFile);
		const asset = await Assets.load(key);

		if (atlasData.textures) {
			atlasData.frames = atlasData.textures[0].frames;
			atlasData.textures = null;
		}

		const sheet = new Spritesheet(asset.baseTexture, atlasData);

		function parse() {
			return new Promise(function (resolve, reject) {
				const resources = PIXI.Loader.shared.resources;
				resources[key] = {};
				resources[key].animations = sheet.animations;
				resources[key].data = sheet.data;
				resources[key].frameTextures = sheet.textures;
				resources[key]._frameKeys = sheet._frameKeys;
				resources[key]._frames = sheet._frames;
				resources[key].resolution = sheet.resolution;

				sheet.parse();
				resolve();
			});
		}
		parse().then(() => {
			callback();
		});
	}

	/**
	 * Load a glTF model.
	 * @param {string} key - Key to identify the loaded asset.
	 * @param {string} gltfSrc - glTF source data.
	 * @param {Function} callback - Callback function to execute after the glTF model is loaded.
	 */
	loadGltf(key, gltfSrc, callback) {
		let src = JSON.parse(gltfSrc);
		glTFAsset.load(src, PIXI.Loader.shared, (gltf) => {
			// globals.gltfAssets[key] = gltf;
			callback();
		});
	}
}

export default Loader2D;
