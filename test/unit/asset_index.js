const MinecraftJs = require("../../src/index");

var latestVersion = undefined;

var fetchLatestVersion = function(callback) {
	if (latestVersion)
		return callback(latestVersion);
	MinecraftJs.versions.fetchAll((err, versions) => {
		if (err)
			console.error(err);
		versions.latest.release.fetch((err, version) => {
			latestVersion = version;
			callback(latestVersion);
		})
	})
};

exports["test Download Latest Minecraft Release"] = function (assert, done) {
	fetchLatestVersion(version => {
		assert.notEqual(version, undefined, "Version fetched from online");
		done();
	});
};

exports["test Get Asset Index"] = function (assert, done) {
	fetchLatestVersion(version => {
		version.assetIndex.fetch((err, assetIndex) => {
			assert.equal(err, undefined, "Asset index fetched");
			done();
		});
	});
};

exports["test Download and Save Asset Index"] = function (assert, done) {
	fetchLatestVersion(version => {
		version.assetIndex.fetch((err, assetIndex) => {
			assert.equal(err, undefined, "Asset index fetched");
			assetIndex.save(err => {
				assert.equal(err, null, "Asset index saved");
				done();
			});
		});
	});
};

exports["test Download an Asset and Perform Integrity Check"] = function (assert, done) {
	fetchLatestVersion(version => {
		version.assetIndex.fetch((err, assetIndex) => {
			assert.equal(err, undefined, "Asset index fetched");
			assetIndex.assets[0].download(error => {
				assert.equal(error, undefined, "The asset has been downloaded");
				assetIndex.assets[0].checkIntegrity(error => {
					assert.equal(error, undefined, "Asset integrity check");
					done();
				});
			});
		});
	});
};
