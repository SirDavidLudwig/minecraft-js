/**
 * The environment
 */
var env = {
	"java":           "/usr/bin/java",
	"minecraft_home": "~/.minecraft",
};

/**
 * Get the current environment settings
 *
 * @return {JSON Object}
 */
var get = function() {
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
