import document from "document";
import { readFileSync, writeFileSync } from "fs";
import { WEEK_DAYS } from "../../resources/utils/globals.js";

// Import the messaging module
import * as messaging from "messaging";

let views, welcomeText, headerText, caffeineText, indicator;
var optionsList, addButton, startScreen, date, hours, day, unit_measurement, week_list, caff_history;

const MAX_VALUE = 400;
const NUM_ELEMS = 7;
var intake = 0, limit = 180, currentX = 12;

// Listen for the onmessage event
// messaging.peerSocket.onmessage = function(evt) {
//   // Output the message to the console
//   unit_measurement = JSON.stringify(evt.data.newValue);
// }

  // retrieve previous caffeine information
  // messaging.peerSocket.onmessage = (evt) => {
  //   caff_history = evt.data.history;
  
  //   // handle null elements
  //   for(var i = 0; i < caff_history.length; i++){
  //     if(!caff_history[i]){
  //       caff_history[i] = 0;
  //     }
  //   }
  //   console.log('caff_history');
  // };
  
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
  week_list = document.getElementById("week-list");

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


  // if button is clicked
  addButton.addEventListener("click", clickHandler);

  // get current hour
  date = new Date();
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

  // populate list with data
  // if (week_list && WEEK_DAYS) {
  //   console.log('true');
  //   var pastWeek = getPastWeek(WEEK_DAYS[date.getDay()])
  //   createList(pastWeek[0], pastWeek[1]);
  // }

  animate();
  
  // updates welcome text
  if (headerText) {
    headerText.text = welcomeText;
    updateCaffeineText();
  }

  //add code for new day
  if (hours == 24) {
    intake = 0;
    sendValue(intake);
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

  setTimeout(requestAnimationFrame(animate), 2000);
}

function createList(week_array, week_history) {
  week_list.delegate = {
    getTileInfo: function (index) {
      return {
        type: "list-pool",
        day: week_array[index],
        amount: week_history[index]
      };
    },
    configureTile: function (tile, info) {
      if (info.type == "list-pool") {
        tile.getElementById("day").text = `${info.day}`;
        tile.getElementById("amount").text = `${info.amount} mg`;
      }
    }
  };

  // length must be set AFTER delegate
  week_list.length = NUM_ELEMS;
}

function clickHandler(_evt) {
  // Navigate to another screen
  views.navigate("list_options", 0);
}

// adds prefix to numerical value
function updateCaffeineText() {
  caffeineText.text = `${intake} mg`;
  writeData(intake);
}

// get past week from today
function getPastWeek(day) {
  var count = 0;
  var newWeek = [];
  var newHistory = []
  var index = (WEEK_DAYS.indexOf(day)) + 1;

  while (count < WEEK_DAYS.length) {
    if (index == WEEK_DAYS.length) {
      index = 0;
    }
    newWeek.push(WEEK_DAYS[index]);

    if(caff_history){
      newHistory.push(caff_history[index]);
    }

    index += 1;
    count += 1;
  }

  console.log(newHistory);
  return [newWeek, newHistory];
}