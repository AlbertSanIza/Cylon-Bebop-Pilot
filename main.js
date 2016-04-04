var Cylon = require('cylon');
var util = require('util');

Cylon.robot({

  connections: {
    keyboard: {adaptor: 'keyboard'},
    joystick: {adaptor: "joystick"},
    //bebop: {adaptor: 'bebop' }
  },
  devices: {
    keyboard: { driver: 'keyboard'},
    controller: {driver: "dualshock-3", connection: "joystick"},
    //drone: {driver: "bebop", connection: "bebop"}
  },

  work: function(my) {

    var rightStick = { x: 0.0, y: 0.0 }, leftStick = { x: 0.0, y: 0.0 };
    var air = false;

    my.keyboard.on('space', function(key) {
      air = !air;
      if(air == true) {
        println("Take Off");
        //my.drone.takeOff();
      } else {
        println("Land");
        //my.drone.land();
      }
    });

    my.controller.on("square:press", function() {
      my.drone.takeOff();
    });
    my.controller.on("triangle:press", function() {
      my.drone.stop();
    });
    my.controller.on("x:press", function() {
      my.drone.land();
    });
    my.controller.on("right_x:move", function(data) {
      rightStick.x = data;
    });
    my.controller.on("right_y:move", function(data) {
      rightStick.y = data;
    });
    my.controller.on("left_x:move", function(data) {
      leftStick.x = data;
    });
    my.controller.on("left_y:move", function(data) {
      leftStick.y = data;
    });

    setInterval(function() {
      var pair = leftStick;
      if (pair.y < 0) {
        my.drone.forward(validatePitch(pair.y));
      } else if (pair.y > 0) {
        my.drone.backward(validatePitch(pair.y));
      }

      if (pair.x > 0) {
        my.drone.right(validatePitch(pair.x));
      } else if (pair.x < 0) {
        my.drone.left(validatePitch(pair.x));
      }
    }, 0);

    setInterval(function() {
      var pair = rightStick;

      if (pair.y < 0) {
        my.drone.up(validatePitch(pair.y));
      } else if (pair.y > 0) {
        my.drone.down(validatePitch(pair.y));
      }

      if (pair.x > 0) {
        my.drone.clockwise(validatePitch(pair.x));
      } else if (pair.x < 0) {
        my.drone.counterClockwise(validatePitch(pair.x));
      }
    }, 0);

    setInterval(function() {
      //my.drone.stop();
    }, 10);

  }
}).start();

function println(input) {
  //util.print("\u001b[2J\u001b[0;0H");
  console.log("\n" + input + "\n");
};

function validatePitch(data) {
  var value = Math.abs(data);
  if (value >= 0.1) {
    if (value <= 1.0) {
      return Math.round(value * 100);
    } else {
      return 100;
    }
  } else {
    return 0;
  }
};
