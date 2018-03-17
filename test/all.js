/**
 * MinecraftJs is purposefuly configured to be running as Linux for testing purposes.
 */

const jetpack     = require("fs-jetpack");
const process     = require("process");
const test        = require("test");
const _           = require("underscore");
const MinecraftJs = require("../src/index");

// Configure the environment to use the test directory (./data)
MinecraftJs.environment.set({
	"minecraft_home": jetpack.path(__dirname, "data", "minecraft"),
	"os":             MinecraftJs.os.OS_LINUX
});

// Paths to tests
var featurePath = jetpack.cwd(__dirname, "feature");
var unitPath    = jetpack.cwd(__dirname, "unit");

// Compile the unit tests together
var unitTests = {};
unitPath.list().forEach(function(file) {
	var unit = require(unitPath.path(file));
	_.extend(unitTests, unit);
});

// Execute all of the tests
if (module == require.main) {
	if (process.argv.length > 2)
		test.run(require(featurePath.path(process.argv[2])));
	else
		test.run(unitTests);
}
