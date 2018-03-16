/**
 * This is the error type index. It is simply comprised of a list that contains the file names for
 * each of the error types available. It will automatically load each error type listed, and export
 * it out into the main module.
 */

 const _ = require("underscore");

 /**
  * Error types (file names)
  */
var files = [
	// General errors
	"general_error",
	"fetch_error",

	// Asset errors
	"asset_index_error",
	"asset_index_fetch_error",

	// Integrity errors
	"integrity_error",
	"integrity_corrupted_error",
	"integrity_missing_error",

	// Library errors
	"library_error",
	"library_download_error",
	"library_unavailable_error",

	// Version errors
	"version_error",
	"version_corrupted_error",
	"version_manifest_fetch_error",
	"version_missing_error"
];

/**
 * Export the error types
 */
module.exports = {};
files.forEach(file => {
	_.extend(module.exports, require(`./${file}`));
});
