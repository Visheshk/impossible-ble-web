
let slider;
function setup() {
  createCanvas(500, 500);
  slider = 0;
  background(255)
  // slider = createSlider(0, 60, 0, 1);
  // slider.position(10, 20);
  // delay(2000);
  circX = 0;
  circY = 0;
  theta = 0;
  radius = 10;
  // frameRate(5);
}


function draw() {
  strokeWeight(0);
  
  magnitude = (globalX**2 + globalY**2 + globalZ**2)**0.5;
  // console.log(magnitude);
  if (magnitude < 1500) {
    fill(255 - globalX, 255 - globalY, 255 - globalZ , 150);
    circle(circX, circY, 30);
    gX = map(globalX, -1040, 1040, -9.8, 9.8);
    gY = map(globalY, -1040, 1040, -9.8, 9.8);
    gZ = map(globalZ, -1040, 1040, -9.8, 9.8);
    // g * cos(Beta) * sin(Alpha) = z;
    // g * cos(Beta) * cos(Alpha) = x;
    // g * sin(Beta) * sin(Alpha) = y;
    mag = Math.sqrt(gX**2 + gY**2 + gZ**2);
    console.log(gX, gY, gZ, mag);
    alpha = Math.trunc((Math.atan2(gY,gZ) * (180/Math.PI)) * 100)/100;
    beta = Math.trunc((Math.atan(gX,gZ) * (180/Math.PI)) * 100)/100;
    // beta = Math.trunc((Math.asin(gX,mag) * (180/Math.PI)) * 100)/100;
    console.log(alpha, beta);
  }
  else {
    circle(Math.sin(theta)*radius + 250, Math.cos(theta) * radius + 250, map(globalY, -1024, 1024, 5, 20));
    theta += 1;
    radius += 1;
  }
}