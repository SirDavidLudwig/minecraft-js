const jetpack           = require("fs-jetpack");
const env               = require("../environment");
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
var fetch = function(versionId, callback) {
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
};

/**
 * Get the installed versions
 *
 * @return {Array<String>} list of version IDs to load
 */
var installed = function() {
	var path     = jetpack.path(env.get("minecraft_home"), "versions/");
	var versions = [];
	jetpack.list(path).forEach(file => {
		if (jetpack.cwd(path, file).exists(`${file}.json`)) {
			versions.push(file);
		}
	});
	return versions;
};

/**
 * Load a version on the disk
 *
 * @param {String}   versionId Version ID of the version to load
 * @param {Function} callback  (err, Version|null)
 */
var load = function(versionId, callback) {
	Version.load(versionId, callback);
};

/**
 * Remove an installed Minecraft version
 *
 * @param {String} versionId
 */
var remove = function(versionId) {
	jetpack.cwd(env.get("minecraft_home"), `versions/${versionId}`).remove();
};

/**
 * Export the module
 */
module.exports = {
	fetch:          fetch,
	fetchAll:       fetchAll,
	fetchReleases:  fetchReleases,
	fetchSnapshots: fetchSnapshots,
	installed:      installed,
	load:           load,
	remove:         remove
};
