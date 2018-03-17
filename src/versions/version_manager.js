const error             = require("../error/error_index");
const networking        = require("../networking");
const {Version}         = require("./version");
const {VersionManifest} = require("./version_manifest");

// URL to the version manifest
const URL_VERSION_MANIFEST = "https://launchermeta.mojang.com/mc/game/version_manifest.json";

// Version Listing ---------------------------------------------------------------------------------

/**
 * Fetch the raw JSON manifest of available Minecraft versions
 *
 * @param {Function} callback Function to invoke with the result (error, result)
 */
var fetchVersionsManifest = function(callback) {
	networking.get(URL_VERSION_MANIFEST, (err, result) => {
		if (err)
			err = new error.VersionManifestFetchError(err);
		callback(err, result);
	});
};

/**
 * Fetch all of the available Minecraft versions
 *
 * @param {Function} callback Function to invoke with the result (error, result)
 */
var fetchAll = function(callback) {
	fetchVersionsManifest((err, versionList) => {
		if (err) {
			callback(err, null);
			return;
		}
		var result = { latest: {}, versions: {} };
		versionList.versions.forEach(version => {
			result.versions[version.id] = new VersionManifest(version);
		});
		result.latest.release  = result.versions[versionList.latest.release];
		result.latest.snapshot = result.versions[versionList.latest.snapshot];
		callback(null, result);
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
			callback(err, null);
			return;
		}
		var result = { latest: {}, versions: {} };
		versionList.versions.forEach(version => {
			if (version.type == Version.RELEASE)
				result.versions[version.id] = new VersionManifest(version);
		});
		result.latest.release = result.versions[versionList.latest.release];
		callback(null, result);
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
			callback(err, null);
			return;
		}
		var result = { latest: {}, versions: {} };
		versionList.versions.forEach(version => {
			if (version.type == Version.SNAPSHOT)
				result.versions[version.id] = new VersionManifest(version);
		});
		result.latest.snapshot = result.versions[versionList.latest.snapshot];
		callback(null, result);
	});
};

/**
 * Fetch a specific version manifest
 *
 * @return {VersionManifest|Null} (err, )
 */
var fetchVersion = function(versionId, callback) {
	fetchAll((err, versionList) => {
		if (err) {
			callback(err, null);
		} else {
			if (!versionList.versions[versionId])
				callback(null, null);
			else
				callback(null, versionList.versions[versionId]);
		}
	})
}

/**
 * Export the module
 */
module.exports = {
	fetchAll:       fetchAll,
	fetchReleases:  fetchReleases,
	fetchSnapshots: fetchSnapshots,
	fetchVersion:   fetchVersion
};
