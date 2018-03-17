const {VersionError} = require("./version_error");

class VersionClientUnavailableError extends VersionError
{
	//
}

/**
 * Export the module
 */
module.exports = { VersionClientUnavailableError };
