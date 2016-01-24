var server = require("./modules/httpClient");
var router = require("./modules/route");

server.start(router.route);