const os = require("./operating_system");

/**
 * The default environment
 */
var env = {
	"java":             "/usr/bin/java",
	"minecraft_home":   "~/.minecraft",
	"os":               os.detect()
};

/**
 * Get the current environment settings, or the specific settings for the given key
 *
 * @param  {String|Undefined} key
 * @return {JSON Object}
 */
var get = function(key = undefined) {
	if (key)
		return env[key];
	return JSON.parse(JSON.stringify(env));
};

/**
 * Configure the environment by overriding the default options
 *
 * @param {JSON Object} options environment options to override (option => value)
 */
var set = function (options) {
	for (key in options) {
		if (Object.keys(env).includes(key)) {
			env[key] = options[key];
		}
	}
};

/**
 * Export the module
 */
module.exports = {
	get: get,
	set: set
};
