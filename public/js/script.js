var socket = io('http://localhost:3000');
socket.on('data', function (data) {
  console.log(data);
});

var alerted = false;

socket.on('battery', function (data) {
  var element = document.getElementById("battery_num");
  element.innerHTML = data.toString();
  var elem = document.getElementById("mybar");
  elem.style.width = data.toString() + '%';
  if(data < 10){
      if(alerted === false){
            alert("Drone Battery Low");
            alerted=true;
      }
  }
});

/// TOOLBOX moves
function jsJumpFunction() {
    socket.emit('action', 'jump');
}

function jsLongJumpFunction() {
    socket.emit('action', 'longJump');
}

function jsSpinFunction() {
    socket.emit('action', 'spin');
}

function jsSlowShakeFunction() {
    socket.emit('action', 'slowshake');
}

function jsMetronomeFunction() {
    socket.emit('action', 'metronome');
}

function postureStanding() {
    socket.emit('action', 'standing');
}
function postureJumper() {
    socket.emit('action', 'jumper');
}

function postureKicker() {
    socket.emit('action', 'kicker');
}

/// MOVE with keyboard
document.onkeydown = function(e) {
  switch (e.keyCode) {
      case 16:
          socket.emit('action', 'tap');
          break;
      case 27:
          socket.emit('action', 'stop');
          break;
      case 32:
          socket.emit('action', 'jump');
          break;
      case 37:
          socket.emit('keydown', 'left');
          break;
      case 38:
          socket.emit('keydown', 'forward');
          break;
      case 39:
          socket.emit('keydown', 'right');
          break;
      case 40:
          socket.emit('keydown', 'backward');
          break;
  }
};

document.onkeyup = function(e) {
  switch (e.keyCode) {
      case 37:
          socket.emit('keyup', 'left');
          break;
      case 38:
          socket.emit('keyup', 'forward');
          break;
      case 39:
          socket.emit('keyup', 'right');
          break;
      case 40:
          socket.emit('keyup', 'backward');
          break;
  }
};
