var Hapi = require("hapi");

var server = new Hapi.Server();

server.connection({
	host : "localhost",
	port : 8001
});

server.app.fuck = "Fuck2";

server.route([{
	method : "GET",
	path : "/hello",
	handler : function(request, reply){
		reply("Hello World");
	}
},
{
	method : "GET",
	path : "/hello2",
	handler : function(request, reply){
		reply(server.app.fuck);
	}
}
]);

server.start(function(){
	console.log("Server running at:", server.info.uri);
});