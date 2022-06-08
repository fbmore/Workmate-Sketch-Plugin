var onRun = function(context) {
  var sketch = require('sketch')
  var ui = require('sketch/ui')

  var Document = require('sketch/dom').Document
  var Artboard = require('sketch/dom').Artboard

  var	document = sketch.getSelectedDocument();
  var selectedArtboards = document.selectedLayers.layers;

  var canvasLayers = document.selectedPage.layers;

  var canvasOrigin = [];

  var arrayXs = [];
  var arrayYs = [];


  var extraMargin = 0

  if (document.sketchObject.isCloudDoc()) {

    // var docWSURL = getDocURL(document)

    // getWorkspaceURL(document)

    // var selectedArtboardName = selectedArtboards[0].name
    //
    // var selectedArtboardID = getValueInParentheses(selectedArtboards[0].sketchObject.toString());
    //
    // console.log(selectedArtboardID)
    //
    // selectionFrame = getSelectionFrame(selectedArtboards)

    // openUrl(getWorkspaceURL(document))
    openUrl('https://www.sketch.com/c/')

    // var data = document.sketchObject.documentData().cloudShare().workspace();
    // // var data = document.sketchObject.UIMetadata();
    // // var data = document.sketchObject.documentData().metadataConfiguration();
    //
    // //.document.cloudShare.shortId;
    // // var shortID = document.sketchObject.UIMetadata().document.cloudShare.shortId;
    //
    // // var ID = document.sketchObject.UIMetadata().document.cloudShare.id;
    //
    // // console.log(data.workspace())
    // console.log(data)

  }





  //// Functions

  /// Get bounding box from selection

  function getSelectionFrame(selectedArtboards) {

    var selectionFrame = Object.assign({}, selectedArtboards[0].frame);

    // var arrayXs = [];
    // var arrayYs = [];

    /// find mim/max coords
    for (var i = 0; i < selectedArtboards.length; i++) {

      var artboard = selectedArtboards[i];
      // console.log(artboard.frame.x);
      arrayXs.push(artboard.frame.x);
      arrayYs.push(artboard.frame.y);
      arrayXs.push(artboard.frame.x + artboard.frame.width);
      arrayYs.push(artboard.frame.y + artboard.frame.height);

    }

    console.log("Min/Max Coords");
    console.log("arrayXs: " + arrayXs);
    console.log("arrayYs: " + arrayYs);

    var minX = getMinValue(arrayXs);
    console.log(minX);

    var minY = getMinValue(arrayYs);
    console.log(minY);

    var maxX = getMaxValue(arrayXs);
    console.log(maxX);

    var maxY = getMaxValue(arrayYs);
    console.log(maxY);

    selectionFrame.x = minX - extraMargin
    selectionFrame.y = minY - extraMargin
    selectionFrame.width = maxX - minX + extraMargin
    selectionFrame.height = maxY - minY + extraMargin

    return selectionFrame;
  }




  function getMinValue(array) {
    var minValue;
    minValue = Math.min(...array);
    console.log(minValue);
    return minValue
  }

  function getMaxValue(array) {
    var maxValue;
    maxValue = Math.max(...array);
    console.log(maxValue);
    return maxValue
  }

  function openUrl(url) {
    NSWorkspace.sharedWorkspace().openURL(NSURL.URLWithString(url));
  }


  function getValueInParentheses(string) {
    var selectedArtboardID = string;
    var newTxt = selectedArtboardID.split('(');

    for (var i = 1; i < newTxt.length; i++) {
      console.log(newTxt[i].split(')')[0]);
      selectedArtboardID = newTxt[i].split(')')[0];
    }
    return selectedArtboardID;
  }

  function getArtboardUUID(artboard) {
    var selectedArtboardID = artboard.sketchObject.toString();
    // var selectedArtboardURL = artboard.sketchObject.toString();
    var newTxt = selectedArtboardID.split('(');

    for (var i = 1; i < newTxt.length; i++) {
      console.log(newTxt[i].split(')')[0]);
      selectedArtboardID = newTxt[i].split(')')[0];
    }

    return selectedArtboardID;
  }

  function getArtboardURL(artboard) {

    /// Link to specific artboard via UUID
    /// https://www.sketch.com/s/d4019aff-827e-4582-8a4d-e9f548fb378e/a/uuid/DD923B68-37F3-4571-AC78-3C36B660E1D7

    var selectedArtboardURL = getDocURL(document) + "/a/uuid/" + getArtboardUUID(artboard);

    return selectedArtboardURL;
  }


  function getDocURL(document) {

    /// Get WS Doc URL
    var cloudShareURL = document.sketchObject.cloudShare().toString()

    var shortId = cloudShareURL.replace('https://sketch.cloud/s/','')

    console.log(shortId)
    console.log(cloudShareURL)

    var docWSURL = cloudShareURL.replace('https://sketch.cloud/s/','https://sketch.com/s/')

    console.log(docWSURL)


    return docWSURL;
  }

  function getWorkspaceURL(document) {

    /// Get WS Doc URL
    console.log(document.sketchObject.cloudShare[workspace].toString())

    var workspaceID = getValueInParentheses(document.sketchObject.cloudShare.workspace.id.toString())

    // var shortId = cloudShareURL.replace('https://sketch.cloud/s/','')

    console.log(workspaceID)

    var workspaceURL = "https://sketch.com/workspace/"+workspaceID+"/shares"

    console.log(workspaceURL)

    return workspaceURL;
  }


  function copyToClipboard(value) {
    let pasteboard = NSPasteboard.generalPasteboard()
    pasteboard.clearContents()
    pasteboard.setString_forType(value.toString(), NSPasteboardTypeString)
  }



  // ui.message("💠: Opening Workspace! 👏 🚀");

};
