const chokidar = require("chokidar");

const watcher = chokidar.watch(".", {
  ignored: /DumpStack\.log\.tmp/, // Ignore system file
  persistent: true,
});

watcher.on("all", (event, path) => {
  console.log(event, path);
});

watcher.on("error", (error) => {
  console.error("Error occurred:", error);
});