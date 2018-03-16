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
		console.log("Downloading asset: ", `${ASSET_URL}${this.__hash.slice(0, 2)}/${this.__hash}`);
		networking.download(
			ASSET_URL + `${this.__hash.slice(0, 2)}/${this.__hash}`,
			this.path(),
			err => { callback(err ? err : undefined); });
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
}

/**
 * Export the module
 */
module.exports = { Asset };
