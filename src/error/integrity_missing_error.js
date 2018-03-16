const {IntegrityError} = require("./integrity_error");

class IntegrityMissingError extends IntegrityError
{
	//
}

/**
 * Export the module
 */
module.exports = { IntegrityMissingError };
