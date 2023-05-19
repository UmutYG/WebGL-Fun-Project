// General variables.
var gl;
var thetaLoc;
var isDirClockwise = false;
var uScale;
var rotate = false;
var randomMode = false;
var delay = 50;
var uColorLocation;

// Vertices for the letters.
var verticesU;
var verticesZ;

// Diffrent variables for the letters.
var thetaU = 0;
var thetaZ = 0;

var scaleU = 1;
var scaleZ = 1;

// Coordinates for the letters to move them.
var directionU = { x: 0, y: 0 };
var directionZ = { x: 0, y: 0 };

// Initial colors.
var colorU = [0.2, 0.1, 0.3];
var colorZ = [0.2, 0.1, 0.3];

var oldColor = [0.0, 0.0, 0.0];

var chosenLetter = null;

function setupListeners() {
   // Letter selecting setup.
   // THAT IS THE MOST IMPORTANT listener in the whole program.
   // Because it is the one that is responsible for the tell functions which letter to work with.
   const selectLetter = document.getElementById("letter");
   selectLetter.addEventListener("input", (event) => {
     const chosen = event.target.value;
     // Assigning the chosen letter to the variable.
     chosenLetter = chosen;
     selectLetter.blur();
     oldColor = [colorU[0], colorU[1], colorU[2]];
     if (chosenLetter == "Both") {
       chosenLetter = null;
     }
   });

  // Key listeners setup.
  document.onkeydown = function (event) {
    switch (event.keyCode) {
      // Keydown for left arrow.
      case 37:
        if (chosenLetter == "U") {
          directionU.x += -0.1;
        } else if (chosenLetter == "Z") {
          directionZ.x += -0.1;
        } else {
          directionU.x += -0.1;
          directionZ.x += -0.1;
        }
        break;
      // Keydown for up arrow.
      case 38:
        if (chosenLetter == "U") {
          directionU.y += 0.1;
        } else if (chosenLetter == "Z") {
          directionZ.y += 0.1;
        } else {
          directionU.y += 0.1;
          directionZ.y += 0.1;
        }
        break;
      // Keydown for right arrow.
      case 39:
        if (chosenLetter == "U") {
          directionU.x += 0.1;
        } else if (chosenLetter == "Z") {
          directionZ.x += 0.1;
        } else {
          directionU.x += 0.1;
          directionZ.x += 0.1;
        }
        break;
      // Keydown for down arrow.
      case 40:
        if (chosenLetter == "U") {
          directionU.y += -0.1;
        } else if (chosenLetter == "Z") {
          directionZ.y += -0.1;
        } else {
          directionU.y += -0.1;
          directionZ.y += -0.1;
        }
        break;
    }
  };

  // Speed up and slow down buttons setup.
  document.getElementById("speed-up").addEventListener("click", function () {
    if (delay > 2) delay /= 2.0;
  });
  document.getElementById("slow-down").addEventListener("click", function () {
    if (delay < 100) delay *= 2.0;
  });

  // Rotation buttons setup.
  document
    .getElementById("direction-button")
    .addEventListener("click", buttonPressedFunc);
  document
    .getElementById("direction-button--stop")
    .addEventListener("click", function () {
      // Switching the rotation.
      rotate = !rotate;
      var rotateSwitch = document.getElementById("direction-button--stop");
      // Changing the button text and color.
      if (rotate == false) {
        rotateSwitch.innerHTML = "Start Rotation";
        rotateSwitch.style.backgroundColor = "#40bfbf";
      } else {
        rotateSwitch.innerHTML = "Stop Rotation";
        rotateSwitch.style.backgroundColor = "red";
      }
    });

  // Reset button setup.
  document.getElementById("reset").addEventListener("click", function () {
    // resetting variables.
    thetaU = 0;
    thetaZ = 0;

    // Resetting the scale.
    scaleU = 1;
    scaleZ = 1;

    // Resetting the directions.
    directionU = { x: 0, y: 0 };
    directionZ = { x: 0, y: 0 };

    // Resetting the colors.
    colorU = [0.2, 0.1, 0.3];
    colorZ = [0.2, 0.1, 0.3];
    // Resetting the delay.
    delay = 50;

    // Resetting the random mode.
    randomMode = false;

    // Resetting random button.
    var randSwitch = document.getElementById("random");
    randSwitch.innerHTML = "Random Mode: OFF";
    randSwitch.style.backgroundColor = "#cc0000";

    // Resetting the rotation.
    rotate = false;
    rotateSwitch = document.getElementById("direction-button--stop");
    rotateSwitch.innerHTML = "Start Rotation";
    rotateSwitch.style.backgroundColor = "#40bfbf";

    // Resetting the scale range input.
    document.getElementById("scale").value = 1;
  });

  // Scale range input setup.
  document.getElementById("scale").onchange = function (event) {
    const value = event.target.value;
    if (chosenLetter == "U") {
      scaleU = value;
    } else if (chosenLetter == "Z") {
      scaleZ = value;
    } else {
      scaleU = value;
      scaleZ = value;
    }
  };

  // Color picker setup.
  document.getElementById("color-picker").oninput = function (event) {
    // Converting the hex color to rgb.
    const values = hexToRgbA(event.target.value);
    // Setting the color depending on the chosen letter.
    if (chosenLetter == "U") {
      colorU[0] = (parseInt(values[0]) / 255).toFixed(1);
      colorU[1] = (parseInt(values[1]) / 255).toFixed(1);
      colorU[2] = (parseInt(values[2]) / 255).toFixed(1);
    } else if (chosenLetter == "Z") {
      colorZ[0] = (parseInt(values[0]) / 255).toFixed(1);
      colorZ[1] = (parseInt(values[1]) / 255).toFixed(1);
      colorZ[2] = (parseInt(values[2]) / 255).toFixed(1);
    } else {
      colorU[0] = (parseInt(values[0]) / 255).toFixed(1);
      colorU[1] = (parseInt(values[1]) / 255).toFixed(1);
      colorU[2] = (parseInt(values[2]) / 255).toFixed(1);

      colorZ[0] = (parseInt(values[0]) / 255).toFixed(1);
      colorZ[1] = (parseInt(values[1]) / 255).toFixed(1);
      colorZ[2] = (parseInt(values[2]) / 255).toFixed(1);
    }
  };

  // Random mode generator setup.
  var randomSwitch = document.getElementById("random");
  randomSwitch.addEventListener("click", function () {
    // Switching the random mode.
    randomMode = !randomMode;
    if (randomMode == true) {
      randomSwitch.innerHTML = "Random Mode: ON";
    } else {
      randomSwitch.innerHTML = "Random Mode: OFF";
      randomSwitch.style.backgroundColor = "#cc0000";
    }
  });

 
}

function buttonPressedFunc() {
  // Switching the rotation direction.
  isDirClockwise = !isDirClockwise;
}

// Function to use for color conversion.
function hexToRgbA(hex) {
  var c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split("");
    if (c.length == 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = "0x" + c.join("");
    return [(c >> 16) & 255, (c >> 8) & 255, c & 255];
  }
  throw new Error("Bad Hex");
}

window.onload = function init() {
  const canvas = document.querySelector("#glcanvas");
  // Initialize the GL context
  gl = WebGLUtils.setupWebGL(canvas);
  // Only continue if WebGL is available and working
  if (!gl) {
    alert(
      "Unable to initialize WebGL. Your browser or machine may not support it."
    );
    return;
  }

  var program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  // Calling my function to setup listeners.
  setupListeners();

  // Vertices for U.
  verticesU = [
    // FIRST RECTANGLE
    vec2(-0.9, 0.45),
    vec2(-0.8, 0.45),
    vec2(-0.9, -0.45),

    vec2(-0.8, 0.45),
    vec2(-0.8, -0.45),
    vec2(-0.9, -0.45),
    // FIRST RECTANGLE

    // SECOND RECTANGLE
    vec2(-0.8, -0.45),
    vec2(-0.2, -0.35),
    vec2(-0.2, -0.45),

    vec2(-0.8, -0.45),
    vec2(-0.8, -0.35),
    vec2(-0.2, -0.35),

    // THIRD RECTANGLE
    vec2(-0.2, -0.45),
    vec2(-0.1, -0.45),
    vec2(-0.2, 0.45),

    vec2(-0.1, -0.45),
    vec2(-0.1, 0.45),
    vec2(-0.2, 0.45),
  ];
  // Vertices for Z.
  verticesZ = [
    vec2(0, 0.35),
    vec2(0.9, 0.35),
    vec2(0, 0.45),

    vec2(0.9, 0.35),
    vec2(0.9, 0.45),
    vec2(0, 0.45),

    // FIFTH RECTANGLE (Z)
    vec2(0.13, -0.35),
    vec2(0.77, 0.35),
    vec2(0, -0.35),

    vec2(0.13, -0.35),
    vec2(0.77, 0.35),
    vec2(0.9, 0.35),

    // SIXTH RECTANGLE (Z)

    vec2(0, -0.45),
    vec2(0.9, -0.35),
    vec2(0.9, -0.45),

    vec2(0, -0.45),
    vec2(0, -0.35),
    vec2(0.9, -0.35),
  ];

  var bufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesU), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  // Getting variable locations.
  uScale = gl.getUniformLocation(program, "uScale");
  thetaLoc = gl.getUniformLocation(program, "theta");
  uDirectionLoc = gl.getUniformLocation(program, "uDirection");
  uColorLocation = gl.getUniformLocation(program, "uColor");

  // Set clear color.
  gl.clearColor(0, 0, 0.05, 0.1);

  requestAnimFrame(render);
};

function render() {
  setTimeout(function () {
    // Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT);
    // Rotate control for each letter.
    if (rotate) {
      if (chosenLetter == "U") {
        thetaU += isDirClockwise ? -0.1 : 0.1;
      } else if (chosenLetter == "Z") {
        thetaZ += isDirClockwise ? -0.1 : 0.1;
      } else {
        thetaU += isDirClockwise ? -0.1 : 0.1;
        thetaZ += isDirClockwise ? -0.1 : 0.1;
      }
    }
    // Random mode control for each letter.
    if (randomMode) {
      document.getElementById("random").style.backgroundColor =
        "rgb(" +
        Math.random() * 255 +
        "," +
        Math.random() * 255 +
        "," +
        Math.random() * 255 +
        ")";
      if (chosenLetter == "U") {
        colorU[0] = Math.random();
        colorU[1] = Math.random();
        colorU[2] = Math.random();
      } else if (chosenLetter == "Z") {
        colorZ[0] = Math.random();
        colorZ[1] = Math.random();
        colorZ[2] = Math.random();
      } else {
        colorU[0] = Math.random();
        colorU[1] = Math.random();
        colorU[2] = Math.random();

        colorZ[0] = Math.random();
        colorZ[1] = Math.random();
        colorZ[2] = Math.random();
      }
    }

    // General variable loads for letter 'U'.
    // We draw the letter 'U' here.
    gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesU), gl.STATIC_DRAW);
    gl.uniform4f(uColorLocation, colorU[0], colorU[1], colorU[2], 1);
    gl.uniform2f(uScale, scaleU, scaleU);
    gl.uniform1f(thetaLoc, thetaU);
    gl.uniform2f(uDirectionLoc, directionU.x, directionU.y);
    gl.drawArrays(gl.TRIANGLES, 0, 18);

    // General variable loads for letter 'Z'.
    // We draw the letter 'Z' here.
    gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesZ), gl.STATIC_DRAW);
    gl.uniform4f(uColorLocation, colorZ[0], colorZ[1], colorZ[2], 1);
    gl.uniform2f(uScale, scaleZ, scaleZ);
    gl.uniform1f(thetaLoc, thetaZ);
    gl.uniform2f(uDirectionLoc, directionZ.x, directionZ.y);
    gl.drawArrays(gl.TRIANGLES, 0, 18);

    render();
  }, delay);
}
