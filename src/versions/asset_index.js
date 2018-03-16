const networking = require("../networking");
const {Asset}    = require("./asset");

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
				callback(new error.AssetIndexFetchError(id), undefined);
			else
				callback(undefined, new AssetIndex(data));
		});
	}

	/**
	 * Load the asset index of the given id from the disk
	 *
	 * @param {String}   id       The asset version id (e.g. "1.12")
	 * @param {Function} callback (error, AssetIndex)
	 */
	static load(id, callback) {

	}

	/**
	 * Create an instance of the asset index
	 *
	 * @param {JSON Object} data
	 */
	constructor(data) {
		this.__assets = [];
		for (let name in data.objects) {
			this.__assets.push(new Asset({
				hash: data.objects[name].hash,
				name: name,
				size: data.objects[name].size
			}));
		}
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
}

/**
 * Export the module
 */
module.exports = { AssetIndex };
