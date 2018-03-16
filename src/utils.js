const checksum = require("checksum");
const jetpack  = require("fs-jetpack");

/**
 * Perform an integrity check on a file by comparing its SHA1 checksum
 *
 * @param  {String}   file
 * @param  {String}   checksum SHA1 checksum
 * @param  {Function} callback Callback that acceps {Boolean}
 */
var integrityCheck = function(file, checksum, callback) {
	checksum.file(file, (err, sum) => {
		callback(sum == checksum);
	});
};

/**
 * Generate the JAR path from its name
 *
 * @param  {String} value e.g. it.unimi.dsi:fastutil:7.1.0
 * @return {String}       e.g. it/unimi/dsi/fastutil/7.1.0/fastutil-7.1.0.jar
 */
var jarPath = function(value) {
	let parts     = value.split(':');
	let namespace = parts[0].split(".");
	return [...namespace, parts[1], parts[2], `${parts[1]}-${parts[2]}.jar`].join('/');
};

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
	integrityCheck:  integrityCheck,
	jarPath:         jarPath,
	regexMatchExact: regexMatchExact,
	verifyUuid:      verifyUuid
}
