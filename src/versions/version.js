const _                    = require("underscore");
const checksum             = require("checksum");
const fs                   = require("fs");
const jetpack              = require("fs-jetpack");
const jsonfile             = require("jsonfile");
const path                 = require("path");
const env                  = require("../environment");
const error                = require("../error/error_index");
const networking           = require("../networking");
const {AssetIndexManifest} = require("./asset_index_manifest");
const {Library}            = require("./library");

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
				callback(new error.FetchError(), null);
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
		var filePath = jetpack.path(env.get("minecraft_home"), "versions", id, `${id}.json`);
		if (jetpack.exists(filePath) != "file") {
			callback(new error.VersionMissingError(id), null);
			return;
		}
		/**
		 * @todo This needs to be redone. It shouldn't just error out when loading because of a
		 * missing version. It should only be checked when running an integrity check, or when a
		 * launch task is attempting to start.
		 */
		jsonfile.readFile(filePath, (err, data) => {
			if (err) {
				callback(new error.VersionCorruptedError(id, err), null);
				return;
			}
			if (data.inheritsFrom) {
				Version.load(data.inheritsFrom, (err, version) => {
					if (err)
						callback(err, null);
					else
						callback(null, new Version(data, version));
				});
			} else {
				callback(null, new Version(data));
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
		this.__assetIndex         = undefined;
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
		this.parseAssetIndexManifest(data.assetIndex);
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
	 * Parse the given asset index manifest
	 *
	 * @param {JSON Object} manifest The asset index manifest
	 */
	parseAssetIndexManifest(manifest) {
		this.__assetIndex = manifest ? new AssetIndexManifest(manifest) : null;
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
	 * Check the integrity of the JAR file
	 *
	 * @param {Function} callback (error)
	 */
	checkIntegrity(callback) {
		if (jetpack.exists(this.jarPath()) != "file") {
			callback(new error.IntegrityMissingError());
		} else {
			checksum.file(this.jarPath(), (err, hash) => {
				if (hash != this.downloads.client.sha1) {
					callback(new error.IntegrityCorruptedError());
				} else {
					callback(null);
				}
			});
		}
	}

	/**
	 * Download the client JAR
	 *
	 * @param {Function} callback (error)
	 */
	downloadClient(callback) {
		if (!this.downloads.client) {
			callback(new error.VersionClientUnavailableError(this.__id));
		} else {
			networking.download(this.downloads.client.url, this.jarPath(), (err) => {
				callback(err ? new error.VersionClientDownloadError(this.__id) : null);
			});
		}
	}

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
		var result = { game: [], jvm: [] };
		if (this.__parent) {
			result.game = this.__parent.arguments.game;
			result.jvm  = this.__parent.arguments.jvm;
		}
		result.game = _.union(result.game, this.__arguments.game);
		result.jvm  = _.union(result.jnm, this.__arguments.jvm);
		return result;
	}

	/**
	 * Get the asset index manifest
	 *
	 * @return {AssetIndexManifest}
	 */
	get assetIndex() {
		if (this.__parent && !this.__assetIndex)
			return this.__parent.assetIndex;
		return this.__assetIndex;
	}

	/**
	 * Get the list of available downloads
	 *
	 * @return {JSON Object}
	 */
	get downloads() {
		var result = this.__parent ? this.downloads : {};
		_.extend(result, JSON.parse(JSON.stringify(this.__downloads)));
		return result;
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
		var result = this.__parent ? this.__parent.libraries : [];
		return _.union(result, this.__libraries);
	}

	/**
	 * Get the logging configuration
	 *
	 * @return {JSON Object|Null}
	 */
	get logging() {
		if (this.__parent && !this.__logging)
			return this.__parent.logging;
		return this.__logging;
	}

	/**
	 * Get the main Java class
	 *
	 * @return {String}
	 */
	get mainClass() {
		if (this.__parent && !this.__mainClass)
			return this.__parent.mainClass;
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
		if (this.__parent && !this.__type)
			return this.__parent.type
		return this.__type;
	}
}

/**
 * Export the module
 */
module.exports = { Version };
