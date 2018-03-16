const {Version} = require("../../src/versions/version");

exports["test Fetch All"] = function(assert, done) {
	var versionManager = require("../../src/index").versions;
	versionManager.fetchAll((err, result) => {
		assert.equal(err, undefined, "Fetched versions from manifest");
		done();
	});
};

exports["test Fetch Releases"] = function(assert, done) {
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

exports["test Fetch Snapshots"] = function(assert, done) {
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

exports["test Get Version From Reference"] = function (assert, done) {
	var versionManager = require("../../src/index").versions;
	versionManager.fetchAll((err, result) => {
		assert.equal(err, undefined, "Fetched versions from manifest");
		if (!err) {
			result.latest.release.fetch((err, version) => {
				assert.equal(err, undefined, "Version fetched from online");
				done();
			});
		}
	});
};

exports["test Save the Latest Release"] = function (assert, done) {
	var versionManager = require("../../src/index").versions;
	versionManager.fetchAll((err, result) => {
		assert.equal(err, undefined, "Fetched versions from manifest");
		if (!err) {
			result.latest.release.fetch((err, version) => {
				assert.equal(err, undefined, "Version fetched from online");
				version.save(err => {
					assert.equal(err, null, "The version has been saved to disk");
					done();
				})
			});
		}
	});
};

exports["test Verify All Artifacts Are Defined"] = function (assert, done) {
	var versionManager = require("../../src/index").versions;
	versionManager.fetchAll((err, result) => {
		assert.equal(err, undefined, "Fetched versions from manifest");
		if (!err) {
			result.latest.release.fetch((err, version) => {
				assert.equal(err, undefined, "Version fetched from online");
				if (!err) {
					version.libraries.forEach(lib => {
						if (lib.isRequired()) {
							assert.notEqual(lib.artifact, undefined, "Artifact is valid");
						}
					});
				}
				done();
			});
		}
	});
};
