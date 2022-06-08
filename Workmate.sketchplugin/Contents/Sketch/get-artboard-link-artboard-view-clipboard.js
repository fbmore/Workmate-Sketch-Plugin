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

    var docWSURL = getDocURL(document)

    var selectedArtboardName = selectedArtboards[0].name

    var selectedArtboardID = getValueInParentheses(selectedArtboards[0].sketchObject.toString());

    console.log(selectedArtboardID)

    selectionFrame = getSelectionFrame(selectedArtboards)

  }

  //// find origin ////

  var canvasOriginXArray = []

  var canvasOriginYArray = []

  for (var i = 0; i < canvasLayers.length; i++) {

    var artboard = canvasLayers[i];

    console.log("artboard: " + artboard.name)
    if (artboard.hidden === false) {
      canvasOriginXArray.push(artboard.frame.x);
      canvasOriginYArray.push(artboard.frame.y);
    }
  }

  console.log("canvasOriginXArray: " + canvasOriginXArray)
  console.log("canvasOriginYArray: " + canvasOriginYArray)
  console.log("MINcanvasOriginXArray: " + getMinValue(canvasOriginXArray))
  console.log("MINcanvasOriginYArray: " + getMinValue(canvasOriginYArray))


  /////

  var currentPageID = document.selectedPage.id;

  var Ascale;
  // var AscaleX = (1440 / selectionFrame.width);
  if (selectionFrame.width >> selectionFrame.height) {
    Ascale = (1440 / selectionFrame.width)/1.25;
  } else {
    Ascale = (800 / selectionFrame.height);
  }

  var Xpos = (selectionFrame.x * (-1)) + ((selectionFrame.width/2 * (-1))) + getMinValue(canvasOriginXArray);// * Ascale;
  var Ypos =  (selectionFrame.y * (-1)) + ((selectionFrame.height/2 * (-1))) + getMinValue(canvasOriginYArray);// * Ascale;

  var docWSURLPage = docWSURL + "/p/" + getValueInParentheses(document.selectedPage.id.toString()) + "/canvas?posX="+Xpos+"&posY="+Ypos+"&zoom="+Ascale

  // console.log(docWSURLQuery)
  // console.log("docWSURLPage: "+ docWSURLPage)

  // console.log(docWSURLQuery)
  // console.log("artboardWSURL: "+ getArtboardURL(selectedArtboards[0]))


  var docWSURLPageArray = [];


  if (selectedArtboards.length >> 1){



    var docWSURLArtboard;

    for (i = 0; i < selectedArtboards.length; i++){

      if (selectedArtboards[i].type == "Artboard" || selectedArtboards[i].type == "SymbolMaster"){

        var artboard = selectedArtboards[i]

        docWSURLArtboard = getArtboardURL(artboard)

        console.log("artboardWSURL----: "+ docWSURLArtboard)

        docWSURLPageArray.push(artboard.name + "\n" + docWSURLArtboard + "\n\n")
      }

    }



    console.log(docWSURLPageArray)
    // console.log("docWSURLArtboard: "+ docWSURLArtboard)
    copyToClipboard(docWSURLPageArray.reverse().join("\n"))


    ui.message('💠 Selection Workspace Artboard names and URLs copied to Clipboard!')


  } else {
    ui.message('💠 Artboard Workspace URL copied to Clipboard!')

    copyToClipboard(getArtboardURL(selectedArtboards[0]))

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


  function copyToClipboard(value) {
    let pasteboard = NSPasteboard.generalPasteboard()
    pasteboard.clearContents()
    pasteboard.setString_forType(value.toString(), NSPasteboardTypeString)
  }



  // ui.message("💠: Opening Workspace! 👏 🚀");

};
