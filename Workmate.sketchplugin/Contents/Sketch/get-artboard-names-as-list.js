var onRun = function(context) {
  var sketch = require('sketch')
  var ui = require('sketch/ui')

  var	document = sketch.getSelectedDocument();
  var selectedArtboards = document.selectedLayers.layers;

  var docWSURLPageArray = [];


  if (selectedArtboards.length >= 1){


    //var docWSURLArtboard;

    for (i = 0; i < selectedArtboards.length; i++){

      if (selectedArtboards[i].type == "Artboard" || selectedArtboards[i].type == "SymbolMaster"){

        var artboard = selectedArtboards[i]

        docWSURLPageArray.push(artboard.name)
      }

    }



    copyToClipboard(docWSURLPageArray.reverse().join("\n"))


    ui.message('💠 Selected Artboard names copied to Clipboard!')


  } 



  //// Functions


  function copyToClipboard(value) {
    let pasteboard = NSPasteboard.generalPasteboard()
    pasteboard.clearContents()
    pasteboard.setString_forType(value.toString(), NSPasteboardTypeString)
  }


};
