
// Class constant declarations
const ALPHA     = "old_alpha";
const BETA      = "old_beta";
const RELEASE   = "release";
const SNAPSHOT  = "snapshot";

class Version
{
	/**
	 * Class constants (these can be access just like any other constant from an object. e.g. Version.RELEASE)
	 */
	static get OLD_ALPHA() { return OLD_ALPHA; }
	static get OLD_BETA()  { return OLD_BETA; }
	static get RELEASE()   { return RELEASE; }
	static get SNAPSHOT()  { return SNAPSHOT; }

	/**
	 * Create a new version instance with the following data from the version manifest
	 */
	constructor(data) {
		this.__date = data.releaseTime;
		this.__id   = data.id;
		this.__type = data.type
		this.__url  = data.url;
	}

	/**
	 * Get the release date of the version
	 *
	 * @return {Date Object}
	 */
	get releaseDate() {
		return new Date(this.__date);
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
	 * @return {String}
	 */
	get url() {
		return this.__url;
	}
}

/**
 * Export the module
 */
module.exports = { Version }
