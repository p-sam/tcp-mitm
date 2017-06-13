module.exports = function masterThread(cluster) {
	const Express = require('express');
	const SocketIO = require('socket.io');
	const http = require('http');
	
	const app = new Express();
	const server = new http.Server(app);
	const io = new SocketIO(server);
	
	app.use(new Express.static(__dirname + '/../public'));
	
	cluster.on('message', (worker, message) => {
		if(message && message.type === 'app-event') {
			io.emit('app-event', message.event);
		}
	});
	
	server.listen(process.env.LISTEN_WEB_PORT, process.env.LISTEN_WEB_IP);
}