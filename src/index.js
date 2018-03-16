/**
 * Export the modules
 */
module.exports = {

	/**
	 * The configurable environment
	 */
	environment: require("./environment"),

	/**
	 * The error types that are used through minecraft-js
	 */
	error: require("./error/error_index"),

	/**
	 * A simple utility for standard operating system naming
	 */
	os: require("./operating_system"),

	/**
	 * The version management module
	 */
	versions: require("./versions/version_manager")
};
