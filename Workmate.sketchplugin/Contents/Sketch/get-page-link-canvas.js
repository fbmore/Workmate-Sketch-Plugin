var onRun = function(context) {
  var sketch = require('sketch')
  var ui = require('sketch/ui')

  var Document = require('sketch/dom').Document
  var Artboard = require('sketch/dom').Artboard

  var	document = sketch.getSelectedDocument();
  var selectedArtboards = document.selectedPage.layers;

  var canvasLayers = document.selectedPage.layers;

  var canvasOrigin = [];

  var arrayXs = [];
  var arrayYs = [];


  var extraMargin = -200

  if (document.sketchObject.isCloudDoc()) {

    ui.message("💠: Opening Workspace! 👏 🚀");


    var cloudShareURL = document.sketchObject.cloudShare().toString()

    var shortId = cloudShareURL.replace('https://sketch.cloud/s/','')

    console.log(shortId)
    console.log(cloudShareURL)

    var docWSURL = cloudShareURL.replace('https://sketch.cloud/s/','https://sketch.com/s/')

    console.log(docWSURL)



    var selectedArtboardName = selectedArtboards[0].name

    var docWSURLQuery = docWSURL + "?search=" + encodeURIComponent(selectedArtboardName)

    console.log(docWSURLQuery)



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


  // getMinValue(canvasOriginXArray)
  // getMinValue(canvasOriginYArray)



  // console.log("canvasOrigin: " + canvasOrigin)

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
  // var Xpos = (selectionFrame.x * (-1)) + ((selectionFrame.width/2 * (-1))) - 1000;// * Ascale;
  // var Ypos =  (selectionFrame.y * (-1)) + ((selectionFrame.height/2 * (-1))) - 1000;

  var docWSURLPage = docWSURL + "/p/" + getValueInParentheses(document.selectedPage.id.toString()) + "/canvas?posX="+Xpos+"&posY="+Ypos+"&zoom="+Ascale

  console.log(docWSURLQuery)
  console.log("docWSURLPage: "+ docWSURLPage)

  //openUrl(docWSURLQuery);
  openUrl(docWSURLPage)



  //// Functions

  /// Get bounding box from selection

  function getSelectionFrame(selectedArtboards) {

    var selectionFrame = Object.assign({}, selectedArtboards[0].frame);

    // var arrayXs = [];
    // var arrayYs = [];

    /// find mim/max coords
    for (var i = 0; i < selectedArtboards.length; i++) {

      var artboard = selectedArtboards[i];

      console.log("artboard: " + artboard.name)


      if (artboard.hidden === false) {
        arrayXs.push(artboard.frame.x);
        arrayYs.push(artboard.frame.y);
        arrayXs.push(artboard.frame.x + artboard.frame.width);
        arrayYs.push(artboard.frame.y + artboard.frame.height);
      }
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


  // ui.message("💠: Opening Workspace! 👏 🚀");

};
