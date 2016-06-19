var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var myDroneandler = require('./lib/droneHandler.js');
var open = require('open');

var myDrone = new myDroneandler();

var path = __dirname + '/public/';
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/img', express.static(__dirname + '/public/img'));
app.use('/fonts', express.static(__dirname + '/public/fonts'));

var PORT = 3000;

function Main() {
    app.get("/", function (req, res) {
        res.sendFile(path + "index.html");
    });

    app.get("/video/*", function (req, res) {
        myDrone.serveDroneVideo(req, res);
    });

    http.listen(PORT, function () {
        console.log('HTTP Server listening on *:' + PORT);
        open('http://127.0.0.1:' + PORT);
    });

    io.on('connection', function (socket) {
        console.log("User connected");

        socket.on('keyup', function (data) {
            myDrone.stopMoving(data);
        });

        socket.on('keydown', function (data) {
            myDrone.move(data);
        });

        socket.on('action', function (data) {
            myDrone.action(data);
        });

        var oldBatValue = -1;
        setInterval(function () {
            var newBatValue = myDrone.getBattery();
            if (newBatValue !== oldBatValue) {
                oldBatValue = newBatValue;
                socket.emit('battery', newBatValue);
            }
        }, 1000);
    });
}

Main();
