/**
 * A basic module to simplify navigation within multi-view applications.
   gotten from github 
 */

import document from "document";
// Import the messaging module
import * as messaging from "messaging";

/**
 * Initialize the views module with views from a specific folder.
 * @param {Object[]} _views An array of views containing the view filename excluding
 * its file extension, and an associated JavaScript `import()`.
 * @param {string} _prefix The folder name where the view files reside.
 */
export function init(_views, _prefix, intake) {
  let views = _views;
  let viewsPrefix = _prefix;
  const viewsSuffix = ".gui";
  let viewSelected;
  let intake = 0;

  // retrieve previous caffeine information
  messaging.peerSocket.onmessage = (evt) => {
    intake = evt.data.value;
    // convert string to int
    intake = parseInt(intake);
  };

  /**
   * Select a specific view by its index. The view's associated JavaScript is
   * loaded and executed, and the current view is replaced by the selected one.
   * @param {number} _index The array position of the view to be selected.
   */
  const select = (_index, value) => {
    const [viewGUI, viewJSLoader] = views[_index];
    viewSelected = viewGUI;
    viewJSLoader()
      .then(({ init }) => {
        document.replaceSync(`${viewsPrefix}${viewGUI}${viewsSuffix}`);
        init({ navigate }, value);
      })
      .catch(() => {
        console.error(`Failed to load view JS: ${viewGUI}`);
      });
  };

  /**
   * Navigate to a specific view using its view name.
   * @param {string} _viewName The name of a .gui file, excluding its path or
   * file extension.
   */
  const navigate = (_viewName, value) => {
    const index = views.indexOf(views.filter(el => el[0] == _viewName)[0]);
    if (value >= 0) {
      intake += value;
    }
    select(index, intake);
  };

  return {
    navigate,
    viewSelected: () => viewSelected
  };
}