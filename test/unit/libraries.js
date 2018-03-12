const os        = require("../../src/operating_system");
const {Library} = require("../../src/versions/library");

// Some example library settings
const SETTINGS = [
	{
		"size": 15817,
		"sha1": "aef610b34a1be37fa851825f12372b78424d8903",
		"path": "com/mojang/patchy/1.1/patchy-1.1.jar",
		"url":  "https://libraries.minecraft.net/com/mojang/patchy/1.1/patchy-1.1.jar"
	},
	{
		"size": 578680,
		"sha1": "931074f46c795d2f7b30ed6395df5715cfd7675b",
		"path": "org/lwjgl/lwjgl/lwjgl-platform/2.9.4-nightly-20150209/lwjgl-platform-2.9.4-nightly-20150209-natives-linux.jar",
		"url": "https://libraries.minecraft.net/org/lwjgl/lwjgl/lwjgl-platform/2.9.4-nightly-20150209/lwjgl-platform-2.9.4-nightly-20150209-natives-linux.jar"
	}
];

// The natives to use
const NATIVES = {
	linux:   "natives-linux",
	osx:     "natives-osx",
	windows: "natives-windows"
};

// A standard library
var libStandard = new Library({
	downloads: {
		artifact: SETTINGS[0]
	}
});

// This library has natives
var libNatives = new Library({
	downloads: {
		artifact: SETTINGS[0],
		classifiers: {
			"natives-linux":   SETTINGS[1],
			"natives-osx":     SETTINGS[0],
			"natives-windows": SETTINGS[0]
		}
	},
	natives: NATIVES
});

var libDisallowAll = new Library({
	downloads: {
		artifact: SETTINGS[0],
		classifiers: {
			"natives-linux": SETTINGS[1],
			"natives-osx": SETTINGS[0],
			"natives-windows": SETTINGS[0]
		}
	},
	natives: NATIVES,
	rules: [] // Automatically disallow everything
});

var libAllowAll = new Library({
	downloads: {
		artifact: SETTINGS[0],
		classifiers: {
			"natives-linux": SETTINGS[1],
			"natives-osx": SETTINGS[0],
			"natives-windows": SETTINGS[0]
		}
	},
	natives: NATIVES,
	rules: [{
		action: "allow"
	}]
});

var libDisallowLinux = new Library({
	downloads: {
		artifact: SETTINGS[0],
		classifiers: {
			"natives-linux": SETTINGS[1],
			"natives-osx": SETTINGS[0],
			"natives-windows": SETTINGS[0]
		}
	},
	natives: NATIVES,
	rules: [
		{ action: "allow" },
		{
			action: "disallow",
			os: { name: "linux" }
		}
	]
});

var libDisallowOther = new Library({
	downloads: {
		artifact: SETTINGS[0],
		classifiers: {
			"natives-linux": SETTINGS[1],
			"natives-osx": SETTINGS[0],
			"natives-windows": SETTINGS[0]
		}
	},
	natives: NATIVES,
	rules: [
		{ action: "allow" },
		{
			action: "disallow",
			os: { name: "windows" }
		}
	]
});

exports["test Standard Library Artifact"] = function (assert) {
	var artifact = libStandard.artifact();
	assert.notEqual(artifact, undefined, "The artifact exists");
	if (artifact) {
		assert.equal(artifact.size, SETTINGS[0].size, "The size has been set");
		assert.equal(artifact.sha1, SETTINGS[0].sha1, "The sha1 has been set");
		assert.equal(artifact.path, SETTINGS[0].path, "The path has been set");
		assert.equal(artifact.url,  SETTINGS[0].url, "The url has been set");
	}
};

exports["test Library Artifact With Natives"] = function (assert) {
	var artifact = libNatives.artifact();
	assert.notEqual(artifact, undefined, "The artifact exists");
	if (artifact) {
		assert.equal(artifact.size, SETTINGS[1].size, "The size has been set");
		assert.equal(artifact.sha1, SETTINGS[1].sha1, "The sha1 has been set");
		assert.equal(artifact.path, SETTINGS[1].path, "The path has been set");
		assert.equal(artifact.url,  SETTINGS[1].url,  "The url has been set");
	}
};

exports["test Library Artifact Disallows All OS's"] = function (assert) {
	assert.equal(libDisallowAll.artifact(), undefined, "The artifact doesn't exist");
};

exports["test Library Artifact Allow All OS's"] = function (assert) {
	assert.notEqual(libAllowAll.artifact(), undefined, "The artifact is allowed");
};

exports["test Library Artifact Disallow Linux"] = function (assert) {
	assert.equal(libDisallowLinux.artifact(), undefined, "The artifact is not allowed for Linux");
};

exports["test Library Artifact Disallow Other OS"] = function (assert) {
	assert.notEqual(libAllowAll.artifact(), undefined, "The artifact is not allowed for another OS");
};
