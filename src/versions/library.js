const jetpack           = require("fs-jetpack");
const path              = require("path");
const env               = require("../environment");
const error             = require("../error");
const networking        = require("../networking");
const os                = require("../operating_system");
const utils             = require("../utils");

class Library
{
	constructor(data) {
		this.__downloads   = data.downloads;
		this.__extract     = data.extract || undefined;
		this.__name        = data.name;
		this.__natives     = data.natives || undefined;
		this.__rules       = data.rules   || undefined;
		this.__url         = data.url     || undefined;
		this.__artifact    = this.parseArtifacts();
	}

	// Private Methods -----------------------------------------------------------------------------

	/**
	 * * @todo There may be a chance that native classifiers can be downloaded without explicitly
	 * specifying natives. This can be seen with the 'ca.weblite:java-objc-bridge:1.0.0' for OS X.
	 * This should be checked andy verified, because it could change the logic behind this.
	 *
	 * Parse the given data, and figure the primary artifact
	 */
	parseArtifacts() {
		if (this.__downloads && this.isRequired()) {
			// Check for natives and classifiers, otherwise just use the artifact if it exists.
			if (this.__natives && this.__downloads.classifiers) {
				let native = this.__natives[env.get("os")];
				if (native) {
					return this.__downloads.classifiers[native];
				}
			} else {
				if (this.__downloads.artifact) {
					return this.__downloads.artifact;
				}
			}
		}
		return undefined;
	}

	// General Methods -----------------------------------------------------------------------------

	/**
	 * Determine if this library can be downloaded
	 *
	 * @return {Boolean}
	 */
	canDownload() {
		return this.__artifact != undefined;
	}

	/**
	 * Download the artifact
	 *
	 * @param {Function} callback (error)
	 */
	download(callback) {
		if (!this.canDownload()) {
			callback({ type: error.LIBRARY_DOWNLOAD_UNAVAILABLE });
			return;
		}
		networking.download(
			this.__artifact.url,
			jetpack.path(env.get("minecraft_home"), "libraries", this.path()),
			err => {
				if (err) {
					callback({
						type:  error.LIBRARY_DOWNLOAD_FAILED,
						error: err
					});
				} else {
					callback(undefined);
				}
			}
		);
	}

	/**
	 * @todo
	 *
	 * @param {Function} callback (error)
	 */
	extract(callback) {
		//
	}

	/**
	 * Determine if the library is required
	 *
	 * @return {Boolean}
	 */
	isRequired() {
		if (this.__rules) {
			var osRules = {}; // Initialize everything to 'disallow'
			osRules[os.OS_LINUX]   = false;
			osRules[os.OS_OSX]     = false;
			osRules[os.OS_WINDOWS] = false;
			this.__rules.forEach(rule => {
				if (rule.os) {
					osRules[rule.os.name] = rule.action == "allow";
				} else {
					for (let i in osRules)
						osRules[i] = rule.action == "allow";
				}
			});
			return osRules[env.get("os")];
		}
		return true; // No rules specified, so it's required
	}

	/**
	 * Determine if the library needs to be extracted
	 *
	 * @return {Boolean}
	 */
	needsExtraction() {
		return this.__extract != undefined;
	}

	/**
	 * Get the path to the location of the library on the disk
	 *
	 *	@return {String}
	 */
	path() {
		return utils.jarPath(this.__name);
	}

	// Accessors -----------------------------------------------------------------------------------

	/**
	 * Get the artifact to download
	 *
	 * @return {JSON Object|Undefined}
	 */
	get artifact() {
		if (!this.__artifact)
			return undefined;
		return JSON.parse(JSON.stringify(this.__artifact));
	}

	/**
	 * Get the extraction rules if they exist
	 *
	 * @return {JSON Object|Undefined}
	 */
	get extractRules() {
		return this.__extract;
	}

	/**
	 * Get the name of the library
	 *
	 * @return {String}
	 */
	get name() {
		return this.__name;
	}

	/**
	 * Get the natives for the library if they exist
	 *
	 * @return {JSON Object|Undefined}
	 */
	get natives() {
		return this.__natives;
	}

	/**
	 * Get the rules for the library if they exist
	 *
	 * @return {Array|Undefined}
	 */
	get rules() {
		return this.__rules;
	}

	/**
	 * Get the URL of the library
	 *
	 * @return {String|Undefined}
	 */
	get url() {
		return this.__url;
	}
}

/**
 * Export the module
 */
module.exports = { Library };
