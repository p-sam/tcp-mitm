require("require-environment-variables")([
        'LISTEN_TCP_IP', 'LISTEN_TCP_PORT',
        'LISTEN_WEB_IP', 'LISTEN_WEB_PORT',
        'FORWARD_TCP_IP', 'FORWARD_TCP_PORT'
]);

const TCPProxy = require('./lib/tcp-proxy.js');
const Express = require('express');
const SocketIO = require('socket.io');
const http = require('http');

const proxy = new TCPProxy({
        ip: process.env.FORWARD_TCP_IP,
        port: process.env.FORWARD_TCP_PORT
});

proxy.listen(process.env.LISTEN_TCP_PORT, process.env.LISTEN_TCP_IP);

const app = new Express();
const server = new http.Server(app);
const io = new SocketIO(server);

app.use(new Express.static(__dirname + '/public'));

Object.keys(TCPProxy.EVENTS).forEach((i) => {
        proxy.on(TCPProxy.EVENTS[i], (payload) => {
                io.emit('app-event', {type: i, payload});
        });
});

server.listen(process.env.LISTEN_WEB_PORT, process.env.LISTEN_WEB_IP);