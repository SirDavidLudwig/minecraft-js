const jetpack     = require("fs-jetpack");
const test        = require("test");
const _           = require("underscore");
const MinecraftJs = require("../src/index");

// Configure the environment to use the test directory (./data)
MinecraftJs.environment.set({
	"minecraft_home": jetpack.path(__dirname, "data", "minecraft")
});

// Path to unit tests
var unitPath = jetpack.cwd(__dirname, "unit");

// Compile the unit tests together
var unitTests = {};
unitPath.list().forEach(function(file) {
	var unit = require(unitPath.path(file));
	_.extend(unitTests, unit);
});

// Execute all of the tests
if (module == require.main) {
	test.run(unitTests);
}
