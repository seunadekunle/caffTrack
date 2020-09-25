import document from "document";
import { readFileSync } from "fs";

// Import the messaging module
import * as messaging from "messaging";

let views;
var NUM_ELEMS, VTList, data, unit_measurement = "oz";

export function init(_views, value) {
  views = _views;
  onMount();
}

/**
 * When this view is mounted, setup elements and events.
 */
function onMount() {
  // Listen for the onmessage event
  // messaging.peerSocket.onmessage = (evt) => {
  //   // Output the message to the console
  //   unit_measurement = evt.data.newValue;
  // };

  unit_measurement = "fl. oz";
  readFile();

  // retrieves list from ui file
  VTList = document.getElementById('my-list');

  // populate list with data
  setupList();

  // fix issue with ui positioning and selecting the first item
  VTList.value = 3; // Scroll to the 3rd item
  VTList.value = 0; // Scroll to the 1st item
}

function readFile() {
  // opens external json file to read data
  // data gotten from https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/caffeine/art-20049372
  // csv converted to json using https://www.convertcsv.com/csv-to-json.htm
  data = readFileSync('/mnt/assets/resources/utils/list.json', 'json');

  // Dynamically changes list value based on json data 
  NUM_ELEMS = data.drink_list.length;
}

// function to populate list with data
function setupList() {
  VTList.delegate = {
    getTileInfo: function (index) {
      return {
        type: "list-pool",
        name: data.drink_list[index].drink,
        size: data.drink_list[index].size,
        value: data.drink_list[index].caffeine
      };
    },
    configureTile: function (tile, info) {
      if (info.type == "list-pool") {

        tile.getElementById("transform").getElementById("unit_text").text = `${info.size} ${unit_measurement}`;
        tile.getElementById("transform").getElementById("main_text").text = `${info.name}`;

        let touch = tile.getElementById("tile-touch");
        touch.onclick = evt => {
          views.navigate("home", info.value);
        };
      }
    }
  };

  // to handle the lenght of VTList after the dele
  VTList.length = NUM_ELEMS;
}

function adjustSIze(size) {
  if (unit_measurement == "mL") {
    return size * 29.574;
  }
}

//TODO add option to change
// function OzToMl(value){
//   return value * 29.574;
// }