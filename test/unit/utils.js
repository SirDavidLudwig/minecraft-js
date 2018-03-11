exports["test verify UUID"] = function(assert) {
	var utils = require("../../src/utils");
	assert.equal(utils.verifyUuid(""), false, "Non-partitioned, empty string");
	assert.equal(utils.verifyUuid("abcde4goi3oif8n65tndi2d40idto1e2"), false, "Non-partitioned, invalid character set");
	assert.equal(utils.verifyUuid("fb6ead96909047828d5fbde488cf26cda"), false, "Non-partitioned, too long");
	assert.equal(utils.verifyUuid("fb6ead96909047828d5fbde488cf26cd"), true, "Non-partitioned, valid UUID");
};
