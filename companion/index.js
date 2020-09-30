import * as messaging from "messaging";
import { settingsStorage } from "settings";
import { localStorage } from "local-storage";
import { WEEK_DAYS } from "../resources/utils/globals.js";

var intake, caff_history;
var date = new Date();

// Message socket opens
messaging.peerSocket.onopen = () => {
  console.log("Companion Socket Open");

  intake = localStorage.getItem(WEEK_DAYS[date.getDay()]);
  caff_history = [];

  // retrieves data from past week
  for(var i = 0; i < WEEK_DAYS.length; i++){
    caff_history.push(localStorage.getItem(WEEK_DAYS[i]));
  }

  let data = {
    value: intake,
    history: caff_history
  };
    
  sendData(data);
};

// Message socket closes
messaging.peerSocket.onclose = () => {
  console.log("Companion Socket Closed");
};

// Listen for the onmessage event
messaging.peerSocket.onmessage = function(evt) {
  // Output the message to the console
  intake = evt.data.value;
  if(intake){
     localStorage.setItem(WEEK_DAYS[date.getDay()], intake);
  }
}

// A user changes settings
// settingsStorage.onchange = evt => {
//   let newValue = JSON.parse(evt.newValue).values[0].name;
//   let data = {
//     newValue: newValue
//   };
  
//   sendVal(data);
// };

// // Restore any previously saved settings and send to the device
// function restoreSettings() {
//   for (let index = 0; index < settingsStorage.length; index++) {
//     let key = settingsStorage.key(index);
//     if (key) {
//       let data = {
//         key: key,
//         newValue: settingsStorage.getItem(key)
//       };
//       sendVal(data);
//     }
//   }
// }

// Send data to device using Messaging API
function sendData(data) {

  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
  }
}
