const {GeneralError} = require("./general_error");

/**
 * This error type represents a generic error for failing to fetch/download a resource from a URL
 */
class FetchError extends GeneralError
{
	//
}

/**
 * Export the module
 */
module.exports = { FetchError };
