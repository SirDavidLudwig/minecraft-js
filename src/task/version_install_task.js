const async  = require("async");
const {Task} = require("./task");

class VersionInstallTask extends Task
{
	/**
	 * Install the given Minecraft version
	 *
	 * @param {VersionManifest}
	 */
	constructor(versionManifest) {
		super();
		this.__version = versionManifest;
	}

	/**
	 * @todo Halt the running task
	 */
	halt() {
		//
	}

	/**
	 * Run the task
	 */
	run() {
		var instance = this;
		async.waterfall([
			function() { instance.stepFetchVersion(...arguments); },
			function() { instance.stepSaveVersion(...arguments); },
			function() { instance.stepDownloadClientJar(...arguments); },
			function() { instance.stepDownloadLibraries(...arguments); },
			function() { instance.stepDownloadAssetIndex(...arguments); },
			function() { instance.stepDownloadAssets(...arguments); }
		], (err, result) => {
			if (err) {
				this.error(err);
			}
			this.update();
			this.done();
		});
	}

	// Task Steps (In Order) -----------------------------------------------------------------------

	/**
	 * Fetch the version from the manifest
	 */
	stepFetchVersion(callback) {
		this.update("Fetching version...");
		this.__version.fetch(callback);
	}

	/**
	 * Save the version to disk
	 */
	stepSaveVersion(version, callback) {
		this.update("Saving version JSON file...");
		version.save(err => {
			callback(err, version);
		});
	}

	/**
	 * Download the client jar
	 */
	stepDownloadClientJar(version, callback) {
		this.update("Checking client JAR integrity...");
		version.checkIntegrity(err => {
			if (err) {
				this.update("Downloading client JAR...");
				version.downloadClient(err => {
					callback(err, version);
				});
			} else {
				callback(null, version);
			}
		});
	}

	/**
	 * Install the required libraries
	 */
	stepDownloadLibraries(version, callback) {
		this.update("Downloading libraries...");
		var libraries = version.libraries;
		var downloads = [];
		var instance  = this;
		for (let i = 0; i < libraries.length; i++) {
			if (libraries[i].isRequired() && libraries[i].canDownload()) {
				let library  = libraries[i];
				downloads.push((callback) => {
					instance.update("Checking library integrity: " + library.name);
					library.checkIntegrity(err => {
						if (err) {
							instance.update("Downloading library: " + library.name);
							library.download(callback);
						} else {
							callback(null);
						}
					});
				});
			}
		}
		async.waterfall(downloads, err => {
			callback(err, version);
		});
	}

	/**
	 * Download the asset index
	 */
	stepDownloadAssetIndex(version, callback) {
		this.update("Checking asset index integrity...");
		version.assetIndex.checkIntegrity(err => {
			if (err) {
				this.update("Fetching asset index...");
				version.assetIndex.fetch((err, assetIndex) => {
					if (err) {
						callback(err);
					} else {
						this.update("Saving asset index...");
						assetIndex.save(err => {
							callback(err, version, assetIndex);
						});
					}
				});
			} else {
				this.update("Loading asset index...");
				version.assetIndex.load((err, assetIndex) => {
					callback(err, version, assetIndex);
				});
			}
		});
	}

	/**
	 * Download all of the assets
	 */
	stepDownloadAssets(version, assetIndex, callback) {
		this.update("Downloading assets...");
		var assets    = assetIndex.assets;
		var downloads = [];
		var instance  = this;
		for (let i = 0; i < assets.length; i++) {
			let asset = assets[i];
			downloads.push((callback) => {
				instance.update("Checking asset integrity: " + asset.name);
				asset.checkIntegrity(err => {
					if (err) {
						instance.update("Downloading asset: " + asset.name);
						asset.download(callback);
					} else {
						callback(null);
					}
				});
			});
		}
		async.waterfall(downloads, err => {
			callback(err, version, assetIndex);
		});
	}
}

/**
 * Export the module
 */
module.exports = { VersionInstallTask };
