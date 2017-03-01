const http = require('http');
const fs = require('fs');
const port = 3000;

const socketio = require('socket.io');

const server = http.createServer(function(req, res) {
	res.writeHead(200, { 'Content-Type': 'text/html' });
	res.end(fs.readFileSync(__dirname + '/client/index.html'));
}).listen(port, function(){ console.log("Server running on port" + port) });

const io = socketio.listen(server);

var userHash = {}; // ユーザ管理

io.sockets.on('connection', function(socket) {
	//console.log(socket);
	socket.on('connected', function(name) {
		var msg = name + "が入室しました";
		userHash[socket.id] = name;
		io.sockets.emit('publish', { value: msg });
	});

	socket.on('publish', function(data) {
		//console.log(data.value);
		io.sockets.emit('publish', { value: data.value });
	});

	socket.on('disconnect', function() {
		if(userHash[socket.id]) {
			var msg = userHash[socket.id] + "が退出しました";
			delete userHash[socket.id];
			io.sockets.emit('publish', { value: msg });
		}
	});
});
