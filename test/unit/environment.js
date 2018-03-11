exports["test readonly environment"] = function(assert) {
	var env = require("../../src/index").environment;  // Import the module
	var original = env.get(); // Get the current environment
	var modified = env.get();
	modified.test_param = "This should not be in the environment.";
	assert.equal(JSON.stringify(original), JSON.stringify(env.get()), "Original environment not modified");
};
