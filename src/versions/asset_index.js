const fs          = require("fs");
const jetpack     = require("fs-jetpack");
const jsonfile    = require("jsonfile");
const path        = require("path");
const env         = require("../environment");
const error       = require("../error/error_index");
const networking  = require("../networking");
const {Asset}     = require("./asset");

class AssetIndex
{
	/**
	 * Load the asset index from the given URL
	 *
	 * @param {String}   id       The asset version id (e.g. "1.12")
	 * @param {String}   url
	 * @param {Function} callback (error, AssetIndex)
	 */
	static loadFromUrl(id, url, callback) {
		networking.get(url, (err, data) => {
			if (err)
				callback(new error.AssetIndexFetchError(id), null);
			else
				callback(null, new AssetIndex(id, data));
		});
	}

	/**
	 * Load the asset index of the given id from the disk
	 *
	 * @param {String}   id       The asset version id (e.g. "1.12")
	 * @param {Function} callback (error, AssetIndex)
	 */
	static load(id, callback) {
		var filePath = jetpack.path(env.get("minecraft_home"), `assets/indexes/${id}.json`);
		if (jetpack.exists(filePath) != "file") {
			callback(new error.IntegrityMissingError(), null);
		} else {
			jsonfile.readFile(filePath, {throws: false}, (err, data) => {
				if (err) {
					callback(new error.IntegrityCorruptedError, null);
				} else {
					callback(null, new AssetIndex(id, data));
				}
			});
		}
	}

	/**
	 * Create an instance of the asset index
	 *
	 * @param {JSON Object} data
	 */
	constructor(id, data) {
		this.__id     = id;
		this.__assets = [];
		for (let name in data.objects) {
			this.__assets.push(new Asset({
				hash: data.objects[name].hash,
				name: name,
				size: data.objects[name].size
			}));
		}
	}

	// General Methods -----------------------------------------------------------------------------

	/**
	 * Convert the asset index to JSON format
	 *
	 * @return {JSON Object}
	 */
	json() {
		var objects = {};
		this.__assets.forEach(asset => {
			objects[asset.name] = asset.json();
		});
		return {
			objects: objects
		};
	}

	/**
	 * Get the path of the index file
	 *
	 * @return {String}
	 */
	path() {
		return jetpack.path(env.get("minecraft_home"), `assets/indexes/${this.__id}.json`);
	}

	/**
	 * Save the asset index to the disk
	 *
	 * @param {Function} callback (error)
	 */
	save(callback) {
		var file = this.path();
		jetpack.dir(path.dirname(file));
		fs.writeFile(file, JSON.stringify(this.json(), null, "  "), callback);
	}

	// Accessors -----------------------------------------------------------------------------------

	/**
	 * Get the list of assets
	 *
	 * @return {Array<Asset>}
	 */
	get assets() {
		return this.__assets;
	}

	/**
	 * Get the version ID of the asset index
	 */
	get id() {
		return this.__id;
	}
}

/**
 * Export the module
 */
module.exports = { AssetIndex };
