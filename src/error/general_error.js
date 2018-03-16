class GeneralError
{
	/**
	 * Create a general error that stores the reason of the error
	 *
	 * @param {Object|Undefined} reason
	 */
	constructor(reason = undefined) {
		this.__reason = reason;
	}

	/**
	 * Get the reason of the error
	 *
	 * @return {Object|Undefined}
	 */
	get reason() {
		return this.__reason;
	}
}

/**
 * Export the module
 */
module.exports = { GeneralError };
