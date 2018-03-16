/**
 * This class represents a downloadable artifact. It contains the size, sha1 hash, path, and URL.
 */
class LibraryArtifact
{
	constructor(data) {
		this.__path = data.path;
		this.__sha1 = data.sha1;
		this.__size = data.size;
		this.__url  = data.url;
	}

	// Accessors -----------------------------------------------------------------------------------

	/**
	 * Get the path of the artifact
	 *
	 * @return {String}
	 */
	get path() {
		return this.__path;
	}

	/**
	 * Get the SHA1 checksum of the artifact
	 *
	 * @return {String}
	 */
	get sha1() {
		return this.__sha1;
	}

	/**
	 * Get the size of the artifact in bytes
	 *
	 * @return {Integer}
	 */
	get size() {
		return this.__size;
	}

	/**
	 * Get the URL of the artifact
	 *
	 * @return {String}
	 */
	get url() {
		return this.__url;
	}
}

/**
 * Export the module
 */
module.exports = { LibraryArtifact };
