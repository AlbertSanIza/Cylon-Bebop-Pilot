var Cylon = require('cylon');

function validatePitch(data, l2state, r2state) {
  var value = Math.abs(data);
  if (value >= 0.2) {
    if (value <= 1.0) {
      var speed = 50;
      if(l2state == true) {
        speed = speed + 25;
      }
      if(r2state == true) {
        speed = speed + 25;
      }
      return Math.round(value * speed);
    } else {
      return 100;
    }
  } else {
    return 0;
  }
}

Cylon.robot({

  connections: {
    joystick: {adaptor: 'joystick'},
    bebop: {adaptor: 'bebop'}
  },
  devices: {
    controller: {driver: 'dualshock-3'},
    drone: {driver: "bebop", connection: "bebop"}
  },

  work: function(my) {

    var rightStick = { x: 0.0, y: 0.0 }, leftStick = { x: 0.0, y: 0.0 };

    my.controller.on("left_x:move", function(data) {
      leftStick.x = data;
    });
    my.controller.on("left_y:move", function(data) {
      leftStick.y = data;
    });
    my.controller.on("right_x:move", function(data) {
      rightStick.x = data;
    });
    my.controller.on("right_y:move", function(data) {
      rightStick.y = data;
    });

    my.controller.on("up:press", function() {
      my.drone.frontFlip();
    });
    my.controller.on("down:press", function() {
      my.drone.backFlip();
    });
    my.controller.on("left:press", function() {
      my.drone.leftFlip();
    });
    my.controller.on("right:press", function() {
      my.drone.rightFlip();
    });

    my.controller.on("triangle:press", function() {
      my.drone.emergency();
    });
    my.controller.on("x:press", function() {
      my.drone.land();
    });
    my.controller.on("square:press", function() {
      my.drone.takeOff();
    });
    my.controller.on("circle:press", function() {
      my.drone.stop();
    });

    var l2 = false, r2 = false;
    my.controller.on("l2:press", function() {
      console.log("\nl2:press\n");
      l2 = true;
    });
    my.controller.on("l2:release", function() {
      console.log("\nl2:release\n");
      l2 = false;
    });
    my.controller.on("r2:press", function() {
      console.log("\nr2:press\n");
      r2 = true;
    });
    my.controller.on("r2:release", function() {
      console.log("\nr2:release\n");
      r2 = false;
    });

    my.drone.on("battery", function(val) {
      console.log("\nBattery Level: " + val + "\n");
    });
    my.drone.on("ready", function() {
      console.log("\nReady!\n");
    });
    my.drone.on("takingOff", function() {
      console.log("\nTaking Off...\n");
      //my.drone.stopRecording();
    });
    my.drone.on("landing", function() {
      console.log("\nLanding...\n");
    });
    my.drone.on("landed", function() {
      console.log("\nLanded\n");
    });
    my.drone.on("emergency", function() {
      console.log("\nWarning! Emergency Encountered!\n");
    });

    constantly(function() {
      var pair = leftStick;
      if (pair.y < 0) {
        my.drone.up(validatePitch(pair.y, l2, r2));
      } else if (pair.y > 0) {
        my.drone.down(validatePitch(pair.y, l2, r2));
      }
      if (pair.x > 0) {
        my.drone.clockwise(validatePitch(pair.x, l2, r2));
      } else if (pair.x < 0) {
        my.drone.counterClockwise(validatePitch(pair.x, l2, r2));
      }
    });

    constantly(function() {
      var pair = rightStick;
      if (pair.y < 0) {
        my.drone.forward(validatePitch(pair.y, l2, r2));
      } else if (pair.y > 0) {
        my.drone.backward(validatePitch(pair.y, l2, r2));
      }
      if (pair.x > 0) {
        my.drone.right(validatePitch(pair.x, l2, r2));
      } else if (pair.x < 0) {
        my.drone.left(validatePitch(pair.x, l2, r2));
      }
    });

    setInterval(function() {
      my.drone.stop();
    }, 10);

  }

});
Cylon.start();
