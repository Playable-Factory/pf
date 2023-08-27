/**
 * Global variables used throughout the application.
 * @module pfGlobals
 */

/**
 * Object containing animation names mapped to their corresponding UUIDs.
 * @type {Object}
 */
var allAnims = {};

/**
 * Texture cache for PIXI textures.
 * @type {Object}
 */
var TextureCache = {};

/**
 * Loader resources for PIXI.
 * @type {Object}
 */
var Resources = {};

/**
 * PIXI application instance.
 * @type {PIXI.Application|null}
 */
var pixiApp = null;

/**
 * @typedef {Object} PfGlobals
 * @property {Object} allAnims - Object containing animation names mapped to their corresponding UUIDs.
 * @property {Object} TextureCache - Texture cache for PIXI textures.
 * @property {Object} Resources - Loader resources for PIXI.
 * @property {PIXI.Application|null} pixiApp - PIXI application instance.
 */

/**
 * Global variables used throughout the application.
 * @type {PfGlobals}
 */
var pfGlobals = {
	allAnims: allAnims,
	TextureCache: TextureCache,
	Resources: Resources,
	pixiApp: pixiApp,
};

export default pfGlobals;
