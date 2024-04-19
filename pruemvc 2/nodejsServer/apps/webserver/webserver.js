var express = require("express");
var path = require("path");

if (process.argv.length < 3) {
    console.log("node webserver.js port");
    return;
}

var app = express();
var port = parseInt(process.argv[2]);

process.chdir("/root/nodejs/nodejsServer/apps/webserver");
console.log(process.cwd());

app.use(express.static(path.join(process.cwd(), "public")));

app.listen(port);

console.log("webserver started at port " + port);