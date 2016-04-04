var Cylon = require('cylon');
var util = require('util');

Cylon.api('http');

Cylon.robot({
  name: 'BebopUltimate',
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
    my.keyboard.on('backspace', function(key) {
      println("Emergency");
      //my.drone.emergency();
    });
    my.keyboard.on('return', function(key) {
      println("Stop");
      //my.drone.stop();
    });
    my.keyboard.on('w', function(key) {
      println("Up");
      //my.drone.up();
    });
    my.keyboard.on('s', function(key) {
      println("Down");
      //my.drone.down();
    });
    my.keyboard.on('a', function(key) {
      println("Counter Clockwise");
      //my.drone.counterClockwise();
    });
    my.keyboard.on('d', function(key) {
      println("Clockwise");
      //my.drone.clockwise();
    });
    my.keyboard.on('up', function(key) {
      println("Forward");
      //my.drone.forward();
    });
    my.keyboard.on('down', function(key) {
      println("Backward");
      //my.drone.backward();
    });
    my.keyboard.on('left', function(key) {
      println("Left");
      //my.drone.left();
    });
    my.keyboard.on('right', function(key) {
      println("Right");
      //my.drone.right();
    });
    my.keyboard.on('i', function(key) {
      println("Front Flip");
      //my.drone.frontFlip();
    });
    my.keyboard.on('k', function(key) {
      println("Back Flip");
      //my.drone.backFlip();
    });
    my.keyboard.on('j', function(key) {
      println("Left Flip");
      //my.drone.leftFlip();
    });
    my.keyboard.on('l', function(key) {
      println("Right Flip");
      //my.drone.rightFlip();
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

    constantly(function() {
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
    });

    constantly(function() {
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
    });

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
