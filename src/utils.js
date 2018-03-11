/**
 * Determine if the given value is an exact match for the given regular expression
 *
 * @param  {Regular Expression} expression The regular expression
 * @param  {String}             value      The value to compare against
 * @return {Boolean}
 */
var regexMatchExact = function(expression, value) {
	let match = value.match(expression);
	return match != null && value == match[0];
};

/**
 * Determine if the given value is a valid UUID
 *
 * @param  {Boolean} partitioned Indicate if there should be dash separators in the UUID
 * @return {Boolean}
 */
var verifyUuid = function(uuid, partitioned = false) {
	let expression;
	if (partitioned)
		expression = /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/;
	else
		expression = /[a-f0-9]{32}/;
	return regexMatchExact(expression, uuid);
};

/**
 * Export the module
 */
module.exports = {
	regexMatchExact: regexMatchExact,
	verifyUuid:      verifyUuid
}
