//DMX
let dmxLight;
let dmxRed = 0;
let dmxGreen = 0;
let dmxBlue = 0;
let DMX_INC = 0.06;
let HEART_PULSE_INC = 0.025;

function sendDmxLight() {

  //pause DMX midi output
  return;

    heartPulse -= HEART_PULSE_INC
    
    if (heartPulse < 0.00001) { heartPulse = 0}
    
    let brightness = 1.0;
          
    //set var from biometric
    let _dmxRed = 0;
    if (state.muscle > state.focus) {
      _dmxRed = state.muscle;
    } else {
      _dmxRed = state.focus;
    }
  
    //smoothing
    if (_dmxRed > dmxRed+DMX_INC) {
      dmxRed += DMX_INC;
    } else if (_dmxRed < dmxRed-DMX_INC) {
      dmxRed -= DMX_INC;
    } else {
      dmxRed = _dmxRed;
    }
    //scale by heartPulse
    dmxRed = heartPulse * dmxRed;
  
    //same for green
    let _dmxGreen = heartPulse * (state.focus/6);
    if (_dmxGreen > dmxGreen+DMX_INC) {
      dmxGreen += DMX_INC;
    } else if (_dmxGreen < dmxGreen-DMX_INC) {
      dmxGreen -= DMX_INC;
    } else {
      dmxGreen = _dmxGreen;
    }
    dmxGreen = heartPulse * dmxGreen;
    
    //blue is set by meditation or clear, whichever is higher
    let _dmxBlue = 0;
    if (state.meditation > state.clear) {
      _dmxBlue = state.meditation;
    } else {
      _dmxBlue = state.clear;
    }
    //smoothing
    if (_dmxBlue > dmxBlue+DMX_INC) {
      dmxBlue += DMX_INC;
    } else if (_dmxBlue < dmxBlue-DMX_INC) {
      dmxBlue -= DMX_INC;
    } else {
      dmxBlue = _dmxBlue;
    }
    dmxBlue = heartPulse * dmxBlue;
 
    //send to DMX light
    dmxLight.set(brightness * 127, dmxRed * 127, dmxGreen * 127, dmxBlue * 127);
  }