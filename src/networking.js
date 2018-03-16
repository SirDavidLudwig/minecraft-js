const downloadFile  = require("download-file");
const got           = require("got");
const jetpack       = require("fs-jetpack");
const path          = require("path");

/**
 * Download a file from the given URL and save it to the given path
 *
 * @param {String}   url
 * @param {String}   path Save destination
 * @param {Function} callback (error)
 */
var download = function(url, filePath, callback) {
	jetpack.dir(path.dirname(filePath));
	var options = {
		directory: path.dirname(filePath),
		filename:  path.basename(filePath)
	}
	downloadFile(url, options, callback);
}

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
	download: download,
	get:      get
}
