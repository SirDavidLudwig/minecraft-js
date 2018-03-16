const {GeneralError} = require("./general_error");

class LibraryError extends GeneralError
{
	/**
	 * A general library error that will keep an instance of the library that had the error
	 *
	 * @param {Library}          library
	 * @param {Object|Undefined} reason
	 */
	constructor(library, reason = undefined) {
		super(reason);
		this.__library = library;
	}

	/**
	 * Get the library
	 */
	get library() {
		return this.__library;
	}
}

/**
 * Export the module
 */
module.exports = { LibraryError };
