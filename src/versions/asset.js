const checksum    = require("checksum");
const jetpack     = require("fs-jetpack");
const env         = require("../environment");
const error       = require("../error/error_index");
const networking  = require("../networking");

// Asset URL
const ASSET_URL = "http://resources.download.minecraft.net/";

/**
 * This class represents a Minecraft asset
 */
class Asset
{
	/**
	 * Create an asset
	 */
	constructor(data) {
		this.__hash = data.hash;
		this.__name = data.name;
		this.__size = data.size;
	}

	// General Methods -----------------------------------------------------------------------------

	/**
	 * Check the integrity of the asset file
	 *
	 * @param {Function} callback (error)
	 */
	checkIntegrity(callback) {
		checksum.file(this.path(), (err, hash) => {
			if (err) {
				callback(new error.IntegrityMissingError(err));
			}
			else if (hash != this.__hash) {
				callback(new error.IntegrityCorruptedError());
			}
			else
				callback(undefined);
		});
	}

	/**
	 * Download the asset and save it to disk
	 *
	 * @param {Function} callback (error)
	 */
	download(callback) {
		networking.download(
			ASSET_URL + `${this.__hash.slice(0, 2)}/${this.__hash}`,
			this.path(),
			err => { callback(err ? err : null); });
	}

	/**
	 * Convert the asset to its JSON format for the asset index (excludes the name for the key)
	 *
	 * @return {JSON Object}
	 */
	json() {
		return {
			"hash": this.__hash,
			"size": this.__size
		};
	}

	/**
	 * Get the location of the asset
	 *
	 * @return {String}
	 */
	path() {
		return jetpack.path(
			env.get("minecraft_home"),
			"assets/objects/",
			this.__hash.slice(0, 2),
			this.__hash
		);
	}

	// Accessors -----------------------------------------------------------------------------------

	/**
	 * Get the SHA1 hash of the asset
	 *
	 * @return {String}
	 */
	get hash() {
		return this.__hash;
	}

	/**
	 * Get the name of the asset
	 *
	 * @return {String}
	 */
	get name() {
		return this.__name;
	}

	/**
	 * Get the size of the asset
	 *
	 * @return {String}
	 */
	get size() {
		return this.__size;
	}
}

/**
 * Export the module
 */
module.exports = { Asset };
