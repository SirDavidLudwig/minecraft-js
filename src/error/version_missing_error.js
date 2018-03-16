const {VersionError} = require("./version_error");

class VersionMissingError extends VersionError
{
	//
}

/**
 * Export the module
 */
module.exports = { VersionMissingError };
