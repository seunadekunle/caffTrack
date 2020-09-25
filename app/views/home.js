import document from "document";
import { readFileSync, writeFileSync } from "fs";
import { WEEK_DAYS } from "../../resources/utils/globals.js";

// Import the messaging module
import * as messaging from "messaging";

let views, welcomeText, headerText, caffeineText, indicator;
var optionsList, addButton, startScreen, date, hours, day, unit_measurement;

const MAX_VALUE = 400;
var intake = 0, limit = 180, currentX = 12;

// Listen for the onmessage event
// messaging.peerSocket.onmessage = function(evt) {
//   // Output the message to the console
//   unit_measurement = JSON.stringify(evt.data.newValue);
// }

export function init(_views, value) {
  views = _views;
  intake += value;
  onMount();
}

/**
 * When this view is mounted, setup elements and events.
 */
function onMount() {

  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    // Send intake to companion for storage
    sendValue(intake);
  }

  // initialize ui variables
  welcomeText = "Welcome";
  optionsList = document.getElementById("options-list");

  addButton = document.getElementById("add-button");
  startScreen = document.getElementById("start-screen");

  headerText = document.getElementById("header-text");
  caffeineText = document.getElementById("caffeine-count");

  indicator = document.getElementById("indicator");

  // dyanmically change the line position value and indicator
  if (startScreen && intake > 20 && intake < MAX_VALUE) {
    currentX = startScreen.width * intake / MAX_VALUE;
    indicator.style.opacity = intake / MAX_VALUE * 0.75;
  }

  // if intake exceeds maximum
  else if (intake > MAX_VALUE) {
    currentX = startScreen.width * 0.90;
    indicator.style.opacity = 0.75;
  }

  console.log(currentX);

  // if button is clicked
  addButton.addEventListener("click", clickHandler);

  date = new Date();
  // get current hour
  hours = date.getHours();

  // updates text based on time
  if (hours >= 6 && hours < 12) {
    welcomeText = "Good\nMorning";
  }
  else if (hours >= 12 && hours <= 18) {
    welcomeText = "Good\nAfternoon";
    console.log(welcomeText);
  }
  else if (hours > 18 && hours <= 20) {
    welcomeText = "Good\nEvening";
  }
  else if (hours > 20 || hours < 6) {
    welcomeText = "Good\nNight";
  }

  animate();

  // updates welcome text
  if (headerText) {
    headerText.text = welcomeText;
    updateCaffeineText();
  }

  //add code for new day
  if (hours == 24) {
    intake = 0;
  }
}

// Send a message to the peer
function sendValue(value) {
  // Sample data
  var data = {
    value: value
  }

  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    // Send the data to peer as a message
    messaging.peerSocket.send(data);
  }
}

function animate() {

  while (indicator.x2 <= currentX) {
    indicator.x2 = indicator.x2 + 1;
  }

  // requestAnimationFrame(animate);
}

function clickHandler(_evt) {
  // Navigate to another screen
  views.navigate("list_options");
}

// ads prefix to numerical value
function updateCaffeineText() {
  caffeineText.text = `${intake} mg`;
  writeData(intake);
}