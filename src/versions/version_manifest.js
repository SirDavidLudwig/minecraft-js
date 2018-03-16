const networking = require("../networking");
const {Version}  = require("./version");

/**
 * This class represents a version listing fetched from the manifest. It's like a version preview.
 * If this version is decided upon, invoke the `fetch` method to get the complete version.
 */
class VersionManifest
{
	/**
	 * Create a new version index instance with the following data from the version manifest
	 */
	constructor(data) {
		this.__id          = data.id;
		this.__releaseTime = data.releaseTime;
		this.__time        = data.time;
		this.__type        = data.type
		this.__url         = data.url;
	}

	// General Methods -----------------------------------------------------------------------------

	/**
	 * Fetch the version from the manifest
	 *
	 * @param  {Function} callback (error, version)
	 */
	fetch(callback) {
		Version.loadFromUrl(this.__url, callback);
	}

	// Accessors -----------------------------------------------------------------------------------

	/**
	 * Get the version ID
	 *
	 * @return {String}
	 */
	get id() {
		return this.__id;
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
module.exports = { VersionManifest };
