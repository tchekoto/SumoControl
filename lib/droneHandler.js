var util = require('util');
var sumo = require('node-sumo');
var mjpegServer = require('mjpeg-server');

var drone = sumo.createClient();
var video = null;
var buf = null;

function handler(){
    var self = this;
    this.battery = null;
    this.forwardMove = false;
    this.backwardMove = false;

    drone.connect(function() {
        console.log("Drone Connected");
        drone.postureJumper();
    });

    drone.on("ready",function(){console.log("Drone Ready");});
    drone.on("postureStanding",function(data){console.log("Drone postureStanding : ",data);});
    drone.on("postureJumper",function(data){console.log("Drone postureJumper : ",data);});
    drone.on("postureKicker",function(data){console.log("Drone postureKicker : ",data);});
    drone.on("postureStuck",function(data){console.log("Drone postureStuck : ",data);});
    drone.on("postureUnknown",function(data){console.log("Drone postureUnknown : ",data);});
    drone.on("batteryCritical",function(data){console.log("Drone batteryCritical : ",data);});
    drone.on("batteryLow",function(data){console.log("Drone batteryLow : ",data);});
    drone.on("jumpLoadUnknown",function(data){console.log("Drone jumpLoadUnknown : ",data);});
    drone.on("jumpLoadUnloaded",function(data){console.log("Drone jumpLoadUnloaded : ",data);});
    drone.on("jumpLoadLoaded",function(data){console.log("Drone jumpLoadLoaded : ",data);});
    drone.on("jumpLoadBusy",function(data){console.log("Drone jumpLoadBusy : ",data);});
    drone.on("jumpLoadLowBatteryUnloaded",function(data){console.log("Drone jumpLoadLowBatteryUnloaded : ",data);});
    drone.on("jumpLoadLowBatteryLoaded",function(data){console.log("Drone jumpLoadLowBatteryLoaded : ",data);});
    drone.on("jumpMotorOK",function(data){console.log("Drone jumpMotorOK : ",data);});
    drone.on("jumpMotorErrorBlocked",function(data){console.log("Drone jumpMotorErrorBlocked : ",data);});
    drone.on("jumpMotorErrorOverheated",function(data){console.log("Drone jumpMotorErrorOverheated : ",data);});
    drone.on("battery",function(battery){self.battery=battery;});

}

handler.prototype.getBattery = function(){
    return this.battery;
}

handler.prototype.move = function (direction){
    var self = this;
    switch(direction){
        case 'forward':
            self.forwardMove = true;
            drone.forward(127);
            break;
        case 'backward':
            self.backwardMove = true;
            drone.backward(100);
            break;
        case 'left':
            drone.left(50);
            break;
        case 'right':
            drone.right(50);
            break;
        default:
            break;
    }
}

handler.prototype.stopMoving = function (direction){
    var self = this;
    switch(direction){
        case 'forward':
            self.forwardMove = false;
            drone.forward(0);
            break;
        case 'backward':
            self.backwardMove = false;
            drone.backward(0);
            break;
        case 'left':
            drone.left(0);
            self.restoreMove();
            break;
        case 'right':
            drone.right(0);
            self.restoreMove();
            break;
        default:
            break;
    }
}

handler.prototype.restoreMove = function(){
    var self = this;
    if(self.backwardMove === true){
        drone.backward(100);
    }

    if(self.forwardMove === true){
        drone.forward(127);
    }
}

handler.prototype.action = function(action){
    switch(action){
        case 'jump':
            drone.animationsHighJump();
            break;
        case 'longJump':
            drone.animationsLongJump();
            break;
        case 'tap':
            drone.animationsTap();
            break;
        case 'spin':
            drone.animationsSpin();
            break;
        case 'slowshake':
            drone.animationsSlowShake();
            break;
        case 'metronome':
            drone.animationsMetronome();
            break;
        case 'standing':
            drone.postureStanding();
            break;
        case 'jumper':
            drone.postureJumper();
            break;
        case 'kicker':
            drone.postureKicker();
            break;
        case 'stop':
            drone.stop();
            break;
        default:
            break;
    }
}

handler.prototype.serveDroneVideo = function(req,res){
    console.log("User requested video stream");
    mjpegReqHandler = mjpegServer.createReqHandler(req, res);
    var video = drone.getVideoStream();

    video.on("data", function(data) {
        mjpegReqHandler.update(data);
    });
}

module.exports = handler;
