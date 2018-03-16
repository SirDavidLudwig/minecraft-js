/**
 * Export the error types
 */
module.exports = {
	// Integrity related errors
	INTEGRITY_CHECK_MISSING:   0x1,
	INTEGRITY_CHECK_CORRUPTED: 0x2,

	LIBRARY_DOWNLOAD_FAILED:      0x1,
	LIBRARY_DOWNLOAD_UNAVAILABLE: 0x2,

	// Version related errors
	VERSION_CORRUPTED:       0x1,
	VERSION_DOWNLOAD_FAILED: 0x2,
	VERSION_MISSING:         0x3
}
