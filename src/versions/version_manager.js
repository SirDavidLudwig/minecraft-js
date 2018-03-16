const networking          = require("../networking");
const {Version}           = require("./version");
const {VersionReference}  = require("./version_reference");

// URL to the version manifest
const URL_VERSION_MANIFEST = "https://launchermeta.mojang.com/mc/game/version_manifest.json";

// Version Listing ---------------------------------------------------------------------------------

/**
 * Fetch the raw JSON manifest of available Minecraft versions
 *
 * @param {Function} callback Function to invoke with the result (error, result)
 */
var fetchVersionsManifest = function(callback) {
	networking.get(URL_VERSION_MANIFEST, callback)
};

/**
 * Fetch all of the available Minecraft versions
 *
 * @param {Function} callback Function to invoke with the result (error, result)
 */
var fetchAll = function(callback) {
	fetchVersionsManifest((err, versionList) => {
		if (err) {
			callback(err, undefined);
			return;
		}
		var result = { latest: {}, versions: [] };
		versionList.versions.forEach(version => {
			result.versions.push(new VersionReference(version));
		});
		let found = 0x0;
		let i = -1;
		while (~found & 0x3 && ++i < result.versions.length) {
			if (result.versions[i].type == "snapshot" && ~found & 0x1) {
				found |= 0x1;
				result.latest.snapshot = result.versions[i];
			} else if (result.versions[i].type == "release" && ~found & 0x2) {
				found |= 0x2;
				result.latest.release = result.versions[i];
			}
		}
		callback(undefined, result);
	});
};

/**
 * Fetch all available Minecraft release versions
 *
 * @param {Function} callback Function to invoke with the result (error, result)
 */
var fetchReleases = function (callback) {
	fetchVersionsManifest((err, versionList) => {
		if (err) {
			callback(err, undefined);
			return;
		}
		var result = { latest: {}, versions: [] };
		versionList.versions.forEach(version => {
			if (version.type == Version.RELEASE)
				result.versions.push(new VersionReference(version));
		});
		result.latest.release = result.versions[0];
		callback(undefined, result);
	});
};

/**
 * Fetch all available Minecraft snapshot versions
 *
 * @param {Function} callback Function to invoke with the result (error, result)
 */
var fetchSnapshots = function(callback) {
	fetchVersionsManifest((err, versionList) => {
		if (err) {
			callback(err, undefined);
			return;
		}
		var result = { latest: {}, versions: [] };
		versionList.versions.forEach(version => {
			if (version.type == Version.SNAPSHOT)
				result.versions.push(new VersionReference(version));
		});
		result.latest.snapshot = result.versions[0];
		callback(undefined, result);
	});
};

/**
 * Export the module
 */
module.exports = {
	fetchAll:       fetchAll,
	fetchReleases:  fetchReleases,
	fetchSnapshots: fetchSnapshots
};
