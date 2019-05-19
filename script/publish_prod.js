var Rsync = require("rsync")

var rsync = new Rsync()
  .flags("av")
  .source("./build/")
  .destination("sg1:/opt/stth-web/")
  .delete()

var c = rsync.execute(
  function(error, code, cmd) {
    // we're done
    if (code) {
      console.log("done: ", code)
    }
  },
  function(data) {
    // do things like parse progress
    var s = data.toString()
    if (s.length > 0) {
      console.log("progress: ", data.toString())
    }
  },
  function(data) {
    // do things like parse error output
  }
)
