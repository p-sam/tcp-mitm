const net = require('net');
const EventEmitter = require('events');

const BUFFER_MAX_SIZE = 1024 * 2; // 2K

const EVENTS = Object.freeze({
	LISTENING: 'listening',
	ERROR: 'error',
	UPSTREAM_ERROR: 'upstreamError',
	CONNECTED: 'connected',
	UPSTREAM_CONNECTED: 'upstreamConnected',
	DATA: 'data',
	UPSTREAM_DATA: 'upstreamData',
	DISCONNECTED: 'disconnected',
	UPSTREAM_DISCONNECTED: 'upstreamDisconnected'
});

function forwardEvent(ee, eventName) {
	ee.on(eventName, (...args) => this.emit(eventName, ...args));
}

function truncate(buf) {
	let str = JSON.stringify(buf.toString('utf8', 0, BUFFER_MAX_SIZE));
	let strSize = Math.min(str.length - 2, BUFFER_MAX_SIZE);
	
	return {
		truncated: strSize === BUFFER_MAX_SIZE,
		text: str.substr(1, strSize)
	};
}

function onSocketConnection(forwardIp, forwardPort, socket) {
	const socketAddress = socket.address();
	
	this.emit(EVENTS.CONNECTED, {client: socketAddress});
	
	socket.on('data', (data) => this.emit(EVENTS.DATA, {client: socketAddress, data: truncate(data)}));
	socket.on('end', () => this.emit(EVENTS.DISCONNECTED, {client: socketAddress}));
	socket.on('error', (error) => this.emit(EVENTS.ERROR, {client: socketAddress, data: truncate(error.message)}));
	
	const upstreamSocket = new net.Socket();
	upstreamSocket.connect(forwardPort, forwardIp, () => {
		
		this.emit(EVENTS.UPSTREAM_CONNECTED, {client: socketAddress});
		
		upstreamSocket.on('data', (data) => this.emit(EVENTS.UPSTREAM_DATA, {client: socketAddress, data: truncate(data)}));
		upstreamSocket.on('end', () => this.emit(EVENTS.UPSTREAM_DISCONNECTED, {client: socketAddress}));
		
		socket.pipe(upstreamSocket);
		upstreamSocket.pipe(socket);
		
		upstreamSocket.on('error', (error) => this.emit(EVENTS.UPSTREAM_ERROR, {client: socketAddress, data: truncate(error.message)}));
	});
}

module.exports = class TCPProxy extends EventEmitter {
	static get EVENTS() {
		return EVENTS;
	}
	
	constructor({ip, port}) {
		super();
		
		this._server = new net.Server(onSocketConnection.bind(this, ip, port));
		this._server.on('listening', () => this.emit(EVENTS.LISTENING, {data: null}));
		this._server.on('error', (error) => this.emit(EVENTS.ERROR, {data: error.message}));
		
		forwardEvent.call(this, this._server, 'listening');
		forwardEvent.call(this, this._server, 'error');
	}
	
	listen(...args) {
		this._server.listen(...args);
	}
	
	address() {
		return this._server.address();
	}
	
	close(callback) {
		return this._server.close(callback);
	}
};