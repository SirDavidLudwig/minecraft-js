const process = require("process");

class Task
{
	constructor() {
		this.__onCatch    = null;
		this.__onFinished = null;
		this.__onProgress = null;
	}

	// Private Methods -----------------------------------------------------------------------------

	/**
	 * Throw an error
	 *
	 * @param {Object} error
	 */
	error(error) {
		if (this.__onCatch) {
			process.nextTick(() => {
				this.__onCatch(error);
			});
		}
	}

	/**
	 * The current task has finished
	 *
	 * @param {JSON Object|Null} data
	 */
	finish(data) {
		if (this.__onFinished) {
			process.nextTick(() => {
				this.__onFinished(data);
			});
		}
	}

	/**
	 * Update the progress
	 *
	 * @param {JSON Object} data
	 */
	update(data) {
		if (this.__onProgress) {
			process.nextTick(() => {
				this.__onProgress(data);
			});
		}
	}

	// General Methods -----------------------------------------------------------------------------

	/**
	 * Catch an error if one is thrown
	 *
	 * @param  {Function} callback
	 * @return {Task}
	 */
	catch(callback) {
		this.__onCatch = callback;
		return this;
	}

	/**
	 * Invoke this method when the task is done
	 */
	done() {
		this.clean();
		this.finish();
	}

	/**
	 * Listen for progress updates
	 *
	 * @param  {Function} callback
	 * @return {Task}
	 */
	progress(callback) {
		this.__onProgress = callback;
		return this;
	}

	/**
	 * Start the task
	 */
	start() {
		process.nextTick(() => {
			try {
				this.run();
			} catch(e) {
				this.error(e);
			}
		});
	}

	/**
	 * Cancel the running task
	 *
	 * @param {Function} callback
	 */
	stop(callback) {
		process.nextTick(() => {
			this.halt();
			if (callback)
				callback();
		});
	}

	/**
	 * Execute the given callback when the task is finished
	 *
	 * @param  {Function} callback
	 * @return {Task}
	 */
	then(callback) {
		this.__onFinished = callback;
		return this;
	}

	// Overridable Methods -------------------------------------------------------------------------

	/**
	 * Executes just before the finished event is fired.
	 */
	clean() { }

	/**
	 * Stop the currently executing task. Use this to stop your task in progress!
	 */
	halt() { }

	/**
	 * Execute the task. When this method returns, the task is declared finished. (Watch for async!)
	 */
	run() { done(); }
}

/**
 * Export the module
 */
module.exports = { Task };
