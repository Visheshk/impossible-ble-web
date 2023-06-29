
let slider;
function setup() {
  createCanvas(500, 500);
  slider = 0;
  // slider = createSlider(0, 60, 0, 1);
  // slider.position(10, 20);
  // delay(2000);
}

function draw() {
  background(255);
  fill(210);
  if (millis() > 1500) {
    
    // text("change player 1s possession times", 15, 15);
    
    setCenter(width/2, height/2);
    
    // console.log(slider.value());
    if (slider <= 60) {
      slider += 1;
    }
    for (var c in connections) {
      if (connections[c] > -1) {
        ballPossess[c] = blockVals[connections[c]]
      }
    }
    

    // ballPossess[1] = slider;
    // ballPossess[3] = slider/2;
    // ballPossess[4] = slider-20;
    // ballPossess[5] = slider/3;
    // ballPossess[6] = slider/2;

    // ballPossess[1] = slider.value();
    // ballPossess[3] = slider.value()/2;
    // ballPossess[4] = slider.value()-20;
    // ballPossess[5] = slider.value()/3;
    // ballPossess[6] = slider.value()/2;
    
    // polarLines( number, radius, distance, [callback] )
    noFill();
    stroke('#ccc');
    strokeWeight(0.5);
    polarLines(8, 140, 0);
    polarLines(8, 60, 20);
    
    // polarEllipses( number, widthRadius, heightRadius, distance, [callback] )
    
    noStroke();
    //player 1
    fill(13, 146, 185, 110);
    polarEllipses(10, ballPossess[1], ballPossess[1], ballTimes[1]);
    
    //player2
    fill(252, 248, 200, 120);
    polarEllipses(5, ballPossess[2], ballPossess[2], ballTimes[2]);
    
    //player 3
    fill(178, 216, 178, 120);
    polarEllipses(10, ballPossess[3], ballPossess[3], ballTimes[3]);
    
    //player 4
    polarEllipses(10, ballPossess[4], ballPossess[4], ballTimes[4]);
    
    //player5
    fill(238, 175, 170);
    polarEllipses(12, ballPossess[5], ballPossess[5], ballTimes[5]);
    
    // player6
    fill(252, 248, 200, 120);
    polarEllipses(5, ballPossess[6], ballPossess[6], ballTimes[6]);
    
    // player 7
    fill(13, 146, 185, 110);
    polarEllipses(14, ballPossess[0], ballPossess[0], ballTimes[0]);
    
    // polarHexagon( angle, radius, [distance] ) 
    noStroke();
    fill(175, 170, 238);
    polarHexagon(3, 10, 0);
    
    fill(238, 175, 170);
    // polarTriangles( number, radius, distance, [callback] )
    polarTriangles(4, 6, 60);
    polarTriangles(4, 8, 140);
    // polarSquares( number, radius, distance, [callback] )
    polarSquares(8, 2, 80);
    polarSquares(4, 4, 120);
  }
  
}