
function setup() {
  createCanvas(400, 400);
  frameRate(30);
  setupMuse();
  setupMuseML();
}

function draw() {
  
  background(dmxRed * 255, dmxGreen * 255, dmxBlue * 255);

  // EEG chart
  beginShape();
  strokeWeight(1);
  noFill();
  stroke(255, 255, 255);

  for (let i = 1; i <= eegSpectrum.length / 2; i++) {
    let x = map(i, 0, 48, 0, width);
    let y = map(eegSpectrum[i], 0, 50, height, 0);
    vertex(x, y); //<-- draw a line graph
  }
  endShape();

  // PPG chart
  if (ppg.buffer.length == PPG_SAMPLES_MAX) {
    beginShape();
    strokeWeight(1);
    noFill();
    stroke(255, 100, 100);

    for (let i = 1; i <= PPG_SAMPLES_MAX; i++) {
      let x = map(i, 0, PPG_SAMPLES_MAX, 0, width);
      let y = map(ppg.buffer[i], ppg.min, ppg.max, height * 0.6, height * 0.4);
      vertex(x, y); //<-- draw a line graph
    }
    endShape();
  }

  noStroke();
  fill(255);
  textSize(10);
  text("BATTERY: " + Math.floor(batteryLevel), width - 80, 10);

  textSize(12);
  

  // Calculate alpha, ensuring it's never less than a certain value
  let noiseAlpha = Math.max(state.noise * 255, 50); 
  let muscleAlpha = Math.max(state.muscle * 255, 50); 
  let focusAlpha = Math.max(state.focus * 255, 50);
  let clearAlpha = Math.max(state.clear * 255, 50);
  let meditateAlpha = Math.max(state.meditation * 255, 50);
  let dreamAlpha = Math.max(state.dream * 255, 50);

  fill(255, 255, 255, noiseAlpha);
  text("NOISE: " + state.noise, 15, 30);
  fill(255, 255, 255, muscleAlpha);
  text("MUSCLE: " + state.muscle, 15, 45);
  fill(255, 255, 255, focusAlpha);
  text("FOCUS: " + state.focus, 15, 60);
  fill(255, 255, 255, clearAlpha);
  text("CLEAR:  " + state.clear, 15, 75);
  fill(255, 255, 255, meditateAlpha);
  text("MEDITATE: " + state.meditation.toFixed(4), 15, 90);
  fill(255, 255, 255, dreamAlpha);
  text("DREAM: " + state.dream, 15, 105);

  fill(255, 255, 255, 255);

  let statePos = [-10, 30, 45, 60, 75, 90, 105];
  let highestState = 0;
  let highestValue = 0;
  if (state.noise > highestValue) {
    highestValue = state.noise;
    highestState = 1;
    activateMidiBpm(false); //turn off bpm if headset is disconnected
  }
  if (state.muscle > highestValue) {
    highestValue = state.muscle;
    highestState = 2;
    activateMidiBpm(true); 
  }
  if (state.focus > highestValue) {
    highestValue = state.focus;
    highestState = 3;
    activateMidiBpm(true); 
  }
  if (state.clear > highestValue) {
    highestValue = state.clear;
    highestState = 4;
    activateMidiBpm(true); 
  }
  if (state.meditation > highestValue) {
    highestValue = state.meditation;
    highestState = 5;
    activateMidiBpm(true); 
  }
  if (state.dream > highestValue) {
    highestValue = state.dream;
    highestState = 6;
    activateMidiBpm(true); 
  }

  text(">", 5, statePos[highestState] - 1);

  text("DELTA: " + (eeg.delta/5).toFixed(0), 10, 135) + "%";
  text("THETA: " + (eeg.theta/5).toFixed(0), 10, 150);
  text("ALPHA: " + eeg.alpha.toFixed(0), 10, 165);
  text("BETA:  " + eeg.beta.toFixed(0), 10, 180);
  text("GAMMA: " + eeg.gamma.toFixed(0), 10, 195);

  //if bpm is valid
  if (ppg.bpm) {
    //store bpm
    rawBPM = ppg.bpm;
    smoothBPM();

    if (ppg.heartbeat) {
      text("HEART bpm: " + smoothedBPM.toFixed(0) + " •", 10, 225);
    } else {
      text("HEART bpm: " + smoothedBPM.toFixed(0), 10, 225);
    }
  }

  text("ACCEL X: " + accel.x.toFixed(2), 10, 255);
  text("ACCEL Y: " + accel.y.toFixed(2), 10, 270);
  text("ACCEL Z: " + accel.z.toFixed(2), 10, 285);

  sendDmxLight();
}

const checkboxes = document.querySelectorAll(".state-checkbox");

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", function () {
    //send to midi manager
    updateStateCcOn(this.id.substring(6), this.checked);
  });
});

//heartbeat
let rawBPM = 60;
let smoothedBPM = 60;
let bpmInc = 0.1;

function smoothBPM() {
  if (rawBPM != 0 && rawBPM != smoothedBPM) {
    if (rawBPM < smoothedBPM - bpmInc) {
      smoothedBPM -= bpmInc;
    } else if (rawBPM > smoothedBPM + bpmInc) {
      smoothedBPM += bpmInc;
    } else {
      smoothedBPM = rawBPM;
    }
    updateMidiBpm(smoothedBPM);
  }
}

function keyTyped() {
  if (key === '-') {
    decreaseMidiStateBoost();
  } else if (key === '=') {
    increaseMidiStateBoost();
  }
}
