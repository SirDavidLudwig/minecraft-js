const MinecraftJs          = require("../../src/index");
const {VersionInstallTask} = require("../../src/task/version_install_task");

exports["test Version Install Task"] = function(assert, done) {
	MinecraftJs.versions.fetch("1.12.2", (err, version) => {
		assert.equal(err, null, "Fetch version 1.12.2 from online");
		var task = new VersionInstallTask(version);
		task.then(() => { console.log("The task has finished"); done(); })
			.catch(err => { console.log("The task threw the error: ", err); })
			.progress(data => { console.log("Progress data: ", data); });
		task.start();
	});
};
