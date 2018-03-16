const {IntegrityError} = require("./integrity_error");

class IntegrityCorruptedError extends IntegrityError
{
	//
}

/**
 * Export the module
 */
module.exports = { IntegrityCorruptedError };
