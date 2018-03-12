const got = require("got");

/**
 * Send a GET request and return a JSON object
 *
 * @param {String}   url
 * @param {Function} callback (error, JSON Object)
 */
var get = function(url, callback) {
	got(url, { "json": true })
		.then(response => {
			callback(undefined, response.body);
		}).catch(err => {
			callback(err, {});
		});
};

/**
 * Export the module
 */
module.exports = {
	get: get
}
