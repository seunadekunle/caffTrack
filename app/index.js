// import necessary libraries
import document from "document";
import { readFileSync } from "fs";

import { init } from "./views";

var intake = 0;
/**
 * Definition for each view in the resources/views folder, and the associated
 * JavaScript module is lazily loaded alongside its view.
 */
const views = init(
  [
    ["home", () => import("./views/home")],
    ["list_options", () => import("./views/list_options")]
  ],
  "./resources/views/", intake
);


// Select the first view (view-1) after 1 second
setTimeout(() => {
  views.navigate("home", intake);
}, 1000);



