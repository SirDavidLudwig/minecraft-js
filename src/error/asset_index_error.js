const {GeneralError} = require("./general_error");

class AssetIndexError extends GeneralError
{
	/**
	 * Store the version ID that the asset index belongs to
	 */
	constructor(versionId, reason = undefined) {
		super(reason);
		this.__versionId = versionId;
	}

	/**
	 * Get the version ID that this asset index belongs to
	 */
	get versionId() {
		return this.__versionId;
	}
}

/**
 * Export the module
 */
module.exports = { AssetIndexError };
