const env            = require("./environment");
const versionManager = require("./versions/version_manager");

/**
 * Export the modules
 */
module.exports = {
	environment: env,
	versions:    versionManager
};
