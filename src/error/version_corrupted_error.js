const {VersionError} = require("./version_error");

class VersionCorruptedError extends VersionError
{
	//
}

/**
 * Export the module
 */
module.exports = { VersionCorruptedError };
