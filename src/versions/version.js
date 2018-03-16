const fs                    = require("fs");
const jetpack               = require("fs-jetpack");
const path                  = require("path");
const env                   = require("../environment");
const error                 = require("../error/error_index");
const networking            = require("../networking");
const {AssetIndexManifest} = require("./asset_index_manifest");
const {Library}             = require("./library");

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
	 *
	 * @param {String}   url
	 * @param {Function} callback
	 */
	static loadFromUrl(url, callback) {
		networking.get(url, (err, data) => {
			if (err) {
				callback(new error.FetchError(), undefined);
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
			callback(new error.VersionMissingError(id), undefined);
			return;
		}
		/**
		 * @todo This needs to be redone. It shouldn't just error out when loading because of a
		 * missing version. It should only be checked when running an integrity check, or when a
		 * launch task is attempting to start.
		 */
		jsonfile.readFile(path, (err, data) => {
			if (err) {
				callback(new error.VersionCorruptedError(id, err), undefined);
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
	 *
	 * @param {JSON Object}  data
	 * @param {Version|Null} parent
	 */
	constructor(data, parent = null) {
		this.__arguments          = {};
		this.__assets             = data.assets;
		this.__assetIndex         = new AssetIndexManifest(data.assetIndex);
		this.__downloads          = data.downloads;
		this.__id                 = data.id;
		this.__inheritsFrom       = data.inheritsFrom;
		this.__jar                = data.jar;
		this.__legacyArguments    = false;
		this.__libraries          = [];
		this.__logging            = data.logging;
		this.__mainClass          = data.mainClass;
		this.__minLauncherVersion = data.minimumLauncherVersion;
		this.__parent             = parent;
		this.__releaseTime        = data.releaseTime;
		this.__time               = data.time;
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
	 * Get the path to the JAR file
	 *
	 * @return {String}
	 */
	jarPath() {
		var path = jetpack.cwd(env.get("minecraft_home"), "versions");
		if (this.__jar)
			return path.path(this.__jar, `${this.__jar}.jar`);
		return path.path(this.__id, `${this.__id}.jar`);
	}

	/**
	 * Get the JSON representation for this version
	 *
	 * @return {JSON Object}
	 */
	json() {
		var result = {
			assetIndex:             this.__assetIndex.json(),
			assets:                 this.__assets,
			downloads:              this.__downloads,
			id:                     this.__id,
			inheritsFrom:           this.__inheritsFrom,
			jar:                    this.__jar,
			libraries:              [],
			logging:                this.__logging,
			mainClass:              this.__mainClass,
			minimumLauncherVersion: this.__minLauncherVersion,
			releaseTime:            this.__releaseTime,
			time:                   this.__time,
			type:                   this.__type
		};
		this.__libraries.forEach(library => {
			result.libraries.push(library.json());
		});
		if (this.__legacyArguments) {
			var args = this.__arguments.game.join(' ') + " " + this.__arguments.jvm.join(' ');
			result.minecraftArguments = args.trimRight();
		} else {
			result.arguments = this.__arguments;
		}
		for (var key in result) // Clean out any undefined records
			if (result[key] === undefined)
				delete result[key];
		return result;
	}

	/**
	 * Get the path to where this version should be saved
	 *
	 * @return {String}
	 */
	path() {
		return jetpack.path(env.get("minecraft_home"), "versions", this.__id, `${this.__id}.json`);
	}

	/**
	 * Save the version to disk
	 *
	 * @param {Function} callback
	 */
	save(callback) {
		var file = this.path();
		jetpack.dir(path.dirname(file));
		fs.writeFile(file, JSON.stringify(this.json(), null, "    "), callback);
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
	 * Get the asset index manifest that belongs to this version
	 *
	 * @return {AssetIndexManifest}
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
