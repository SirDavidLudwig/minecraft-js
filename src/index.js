const env            = require("./environment");
const os             = require("./operating_system");
const versionManager = require("./versions/version_manager");

/**
 * Export the modules
 */
module.exports = {
	environment: env,
	os:          os,
	versions:    versionManager
};
