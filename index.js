const cluster = require('cluster');

require("require-environment-variables")([
	'LISTEN_TCP_IP', 'LISTEN_TCP_PORT', 
	'LISTEN_WEB_IP', 'LISTEN_WEB_PORT',
	'FORWARD_TCP_IP', 'FORWARD_TCP_PORT'
]);

if (cluster.isMaster) {
	const numCPUs = require('os').cpus().length;
	for (let i = 0; i < numCPUs; i++) {
		cluster.fork();
	}
	
	cluster.on('exit', (worker) => { 
		console.log('Worker %d died', worker.id);
		cluster.fork(); 
	});
	
	require('./lib/master.js')(cluster);
} else {
	require('./lib/worker.js')(cluster.worker);
}