const {Version} = require("../../src/versions/version");

exports["test Fetch All"] = function (assert, done) {
	var versionManager = require("../../src/index").versions;
	versionManager.fetchAll((err, result) => {
		assert.equal(err, undefined, "Fetched versions from manifest");
		done();
	});
};

exports["test Fetch Releases"] = function (assert, done) {
	var versionManager = require("../../src/index").versions;
	versionManager.fetchReleases((err, result) => {
		assert.equal(err, undefined, "Fetched versions from manifest");
		if (!err) {
			var count = 0;
			result.versions.forEach((version) => {
				if (version.type == Version.RELEASE)
					count++;
			});
			assert.equal(count, result.versions.length, "All versions are releases");
		}
		done();
	});
};

exports["test Fetch Snapshots"] = function (assert, done) {
	var versionManager = require("../../src/index").versions;
	versionManager.fetchSnapshots((err, result) => {
		assert.equal(err, undefined, "Fetched versions from manifest");
		if (!err) {
			var count = 0;
			result.versions.forEach((version) => {
				if (version.type == Version.SNAPSHOT)
					count++;
			});
			assert.equal(count, result.versions.length, "All versions are snapshots");
		}
		done();
	});
};
