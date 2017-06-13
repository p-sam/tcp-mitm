module.exports = function workerThread(worker) {
	const TCPProxy = require('./tcp-proxy.js');

	const proxy = new TCPProxy({
		ip: process.env.FORWARD_TCP_IP, 
		port: process.env.FORWARD_TCP_PORT
	});
	
	Object.keys(TCPProxy.EVENTS).forEach((i) => {
		proxy.on(TCPProxy.EVENTS[i], (payload) => {
			worker.send({
				workerId: worker.id,
				type: 'app-event',
				event: {type: i, payload}
			});
		});
	});
	
	proxy.listen(process.env.LISTEN_TCP_PORT, process.env.LISTEN_TCP_IP);
};
