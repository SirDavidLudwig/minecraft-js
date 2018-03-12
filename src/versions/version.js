const jetpack      = require("fs-jetpack");
const env          = require("../environment");
const errors       = require("../error");
const networking   = require("../networking");
const {AssetIndex} = require("./asset_index");
const {Library}    = require("./library");

// Class constant declarations
const ALPHA     = "old_alpha";
const BETA      = "old_beta";
const RELEASE   = "release";
const SNAPSHOT  = "snapshot";

class Version
{
	/**
	 * Class constants (these can be access just like any other constant from an object
	 */
	static get OLD_ALPHA() { return OLD_ALPHA; }
	static get OLD_BETA()  { return OLD_BETA; }
	static get RELEASE()   { return RELEASE; }
	static get SNAPSHOT()  { return SNAPSHOT; }

	/**
	 * Load a version from the given URL (ignores recursion)
	 */
	static loadFromUrl(url, callback) {
		networking.get(url, (err, data) => {
			if (err) {
				callback(err, undefined);
				return;
			}
			callback(undefined, new Version(data));
		});
	}

	/**
	 * Load the installed version recursivly (load parent(s) as well)
	 *
	 * @param {String}   id       Version ID
	 * @param {Function} callback (err, version)
	 */
	static load(id, callback) {
		var path = jetpack.cwd(env.environment().minecraft_home, "versions", id, `${id}.json`);
		if (jetpack.exists() != "file") {
			callback({
				type:    errors.VERSION_MISSING,
				version: id
			}, undefined);
			return;
		}
		jsonfile.readFile(path, (err, data) => {
			if (err) {
				var error = {
					type:    errors.VERSION_CORRUPTED,
					version: id
				};
				callback(err, undefined);
				return;
			}
			if (data.inheritsFrom) {
				Version.load(data.inheritsFrom, (err, version) => {
					if (err)
						callback(err, undefined);
					else
						callback(undefined, new Version(data, version));
				});
			} else {
				callback(undefined, new Version(data));
			}
		});
	}

	/**
	 * Create a new version instance with the following data from the version manifest
	 */
	constructor(data, parent) {
		this.__arguments          = {};
		this.__assetIndex         = new AssetIndex(data.assetIndex);
		this.__downloads          = data.downloads;
		this.__id                 = data.id;
		this.__jar                = data.jar;
		this.__legacyArguments    = false;
		this.__libraries          = [];
		this.__logging            = data.logging || null;
		this.__mainClass          = data.mainClass;
		this.__minLauncherVersion = data.minimumLauncherVersion;
		this.__releaseTime        = data.releaseTime;
		this.__time               = data.releaseTime;
		this.__type               = data.type
		this.parseArguments(data.arguments || data.minecraftArguments);
		this.parseLibraries(data.libraries);
	}

	// Private Methods -----------------------------------------------------------------------------

	/**
	 * Parse the arguments into an array (for 1.13 and onward)
	 *
	 * @param {String|JSON Object} args
	 */
	parseArguments(args) {
		if (typeof args == "string") {
			args = {
				"game": args.split(/\s+/),
				"jvm": []
			};
			this.__legacyArguments = true;
		}
		this.__arguments = args
	}

	/**
	 * Parse the libraries that this version will use
	 *
	 * @param {Array} libraries
	 */
	parseLibraries(libraries) {
		libraries.forEach(lib => {
			this.__libraries.push(new Library(lib));
		})
	}

	// General Methods -----------------------------------------------------------------------------

	/**
	 * @todo Get the JSON representation for this version
	 *
	 * @return {JSON Object}
	 */
	json() {
		//
	}

	// Accessors -----------------------------------------------------------------------------------

	/**
	 * Get the list of arguments
	 *
	 * @return {JSON Object}
	 */
	get arguments() {
		return this.__arguments;
	}

	/**
	 * Get the asset index that belongs to this version
	 *
	 * @return {AssetIndex}
	 */
	get assetIndex() {
		return this.__assetIndex;
	}

	/**
	 * Get the list of available downloads
	 *
	 * @return {JSON Object}
	 */
	get downloads() {
		return JSON.parse(JSON.stringify(this.__downloads));
	}

	/**
	 * Get the version ID
	 *
	 * @return {String}
	 */
	get id() {
		return this.__id;
	}

	/**
	 * Get the list of libraries
	 *
	 * @return {Array}
	 */
	get libraries() {
		return this.__libraries;
	}

	/**
	 * Get the logging configuration
	 *
	 * @return {JSON Object|Null}
	 */
	get logging() {
		return this.__logging;
	}

	/**
	 * Get the main Java class
	 *
	 * @return {String}
	 */
	get mainClass() {
		return this.__mainClass;
	}

	/**
	 * Get the path to where this version should be saved
	 */
	get path() {
		jetpack.cwd(env.environment().minecraft_home, "versions", this.__id, `${this.__id}.json`);
	}

	/**
	 * Get the release date of the version
	 *
	 * @return {Date Object}
	 */
	get releaseTime() {
		return new Date(this.__date);
	}

	/**
	 * Get the time of the version
	 *
	 * @return {Date Object}
	 */
	get time() {
		return new Date(this.__date);
	}

	/**
	 * Get the version type
	 *
	 * @return {String}
	 */
	get type() {
		return this.__type;
	}

	/**
	 * Get the URL to this version's manifest
	 *
	 * @return {String|Undefined}
	 */
	get url() {
		return this.__url;
	}
}

/**
 * Export the module
 */
module.exports = { Version };
