const jetpack   = require("fs-jetpack");
const {Version} = require("../../src/versions/version");

exports["test Fetch All"] = function(assert, done) {
	var versionManager = require("../../src/index").versions;
	versionManager.fetchAll((err, result) => {
		assert.equal(err, null, "Fetched versions from manifest");
		done();
	});
};

exports["test Fetch Releases"] = function(assert, done) {
	var versionManager = require("../../src/index").versions;
	versionManager.fetchReleases((err, result) => {
		assert.equal(err, null, "Fetched versions from manifest");
		if (!err) {
			var count = 0;
			Object.values(result.versions).forEach((version) => {
				if (version.type == Version.RELEASE)
					count++;
			});
			assert.equal(count, Object.keys(result.versions).length, "All versions are releases");
		}
		done();
	});
};

exports["test Fetch Snapshots"] = function (assert, done) {
	var versionManager = require("../../src/index").versions;
	versionManager.fetchSnapshots((err, result) => {
		assert.equal(err, null, "Fetched versions from manifest");
		if (!err) {
			var count = 0;
			Object.values(result.versions).forEach((version) => {
				if (version.type == Version.SNAPSHOT)
					count++;
			});
			assert.equal(count, Object.keys(result.versions).length, "All versions are snapshots");
		}
		done();
	});
};

exports["test Fetch Specific Version"] = function (assert, done) {
	var versionManager = require("../../src/index").versions;
	versionManager.fetch("1.12.2", (err, result) => {
		assert.equal(err, null, "Fetched versions from manifest");
		assert.notEqual(result, null, "Fetched the version itself");
		done();
	});
};

exports["test Get Version From Reference"] = function (assert, done) {
	var versionManager = require("../../src/index").versions;
	versionManager.fetchAll((err, result) => {
		assert.equal(err, null, "Fetched versions from manifest");
		result.latest.release.fetch((err, version) => {
			assert.equal(err, null, "Version fetched from online");
			done();
		});
	});
};

exports["test Verify All Artifacts Are Defined"] = function (assert, done) {
	var versionManager = require("../../src/index").versions;
	versionManager.fetchAll((err, result) => {
		assert.equal(err, null, "Fetched versions from manifest");
		if (!err) {
			result.latest.release.fetch((err, version) => {
				assert.equal(err, null, "Version fetched from online");
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

exports["test Download the Latest Release Jar and Check Integrity"] = function (assert, done) {
	var versionManager = require("../../src/index").versions;
	versionManager.fetchAll((err, result) => {
		assert.equal(err, undefined, "Fetched versions from manifest");
		if (!err) {
			result.latest.release.fetch((err, version) => {
				assert.equal(err, undefined, "Version fetched from online");
				version.downloadClient(err => {
					assert.equal(err, null, "Downloaded the version jar");
					version.checkIntegrity(err => {
						assert.equal(err, null, "Version JAR integrity check")
						done();
					})
				})
			});
		}
	});
};

exports["test Load Installed Version"] = function (assert, done) {
	var versionManager = require("../../src/index").versions;
	var versions = versionManager.installed();
	versionManager.load(versions[0], (err, version) => {
		assert.equal(err, null, "Load the installed version");
		done();
	});
};

exports["test Remove Installed Version"] = function (assert, done) {
	var env = require("../../src/index").environment;
	var versionManager = require("../../src/index").versions;
	var versions = versionManager.installed();
	versionManager.load(versions[0], (err, version) => {
		assert.equal(err, null, "Load the installed version");
		versionManager.remove(version.id);
		assert.equal(jetpack.exists(jetpack.path(env.get("minecraft_home"), `versions/${version.id}`)), false, "Version has been removed");
		done();
	});
};
