const {GeneralError} = require("./general_error");

class VersionError extends GeneralError
{
	/**
	 * A general error that will store the version ID
	 *
	 * @param {String}           versionId The ID of the missing version (e.g. "1.12.2")
	 * @param {Object|Undefined} reason
	 */
	constructor(versionId, reason = undefined) {
		super(reason);
		this.__versionId = versionId;
	}

	/**
	 * Get the version ID
	 */
	get versionId() {
		return this.__versionId;
	}
}

/**
 * Export the module
 */
module.exports = { VersionError };
