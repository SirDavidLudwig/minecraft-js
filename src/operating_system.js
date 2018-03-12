const process = require("process");

/**
 * Operating system constants
 */
const OS_LINUX   = "linux";
const OS_OSX     = "osx"
const OS_WINDOWS = "windows";

/**
 * Get the current operating system
 *
 * @return {String}
 */
var detect = function () {
	if (process.platform == "win32")
		return OS_WINDOWS;
	else if (process.platform == "darwin")
		return OS_OSX;
	return OS_LINUX;
}

/**
 * Export the module
 */
module.exports = {
	OS_LINUX:   OS_LINUX,
	OS_OSX:     OS_OSX,
	OS_WINDOWS: OS_WINDOWS,
	detect:     detect
}
