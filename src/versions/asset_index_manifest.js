const networking   = require("../networking");
const {AssetIndex} = require("./asset_index");

class AssetIndexManifest
{
	/**
	 * Create an instance of an asset index manifest
	 *
	 * @param {JSON Object} data
	 */
	constructor(data) {
		this.__id        = data.id;
		this.__sha1      = data.sha1;
		this.__size      = data.size;
		this.__totalSize = data.totalSize;
		this.__url       = data.url;
	}

	// General Methods -----------------------------------------------------------------------------

	/**
	 * Fetch the asset index from the interwebs
	 *
	 * @param {Function} callback
	 */
	fetch(callback) {
		AssetIndex.loadFromUrl(this.__id, this.__url, callback);
	}

	/**
	 * Load the asset index from the disk
	 *
	 * @param {Function} callback
	 */
	load(callback) {

	}

	// Accessors -----------------------------------------------------------------------------------

	/**
	 * Get the asset index ID
	 *
	 * @return {String}
	 */
	get id() {
		return this.__id;
	}

	/**
	 * Get the SHA1 hash of the asset index
	 *
	 * @return {String}
	 */
	get sha1() {
		return this.__sha1;
	}

	/**
	 * Get the size of the asset index
	 *
	 * @return {Integer}
	 */
	get size() {
		return this.__size;
	}

	/**
	 * Get the total size of the assets
	 *
	 * @return {Integer}
	 */
	get totalSize() {
		return this.__totalSize;
	}

	/**
	 * Get the URL to the asset index's manifest
	 */
	get url() {
		return this.__url;
	}
}

/**
 * Export the module
 */
module.exports = { AssetIndexManifest };
