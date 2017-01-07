var Rx = require('rx')

const getImageProperties = img => {
        var newObj = {}
        var splitArray = img.split(" ")
            .map(kv=>kv.split("="))
            .filter(kv=>kv.length == 2)
            .map(kv=>newObj[kv[0]] = kv[1].replace(/\"/g,"").replace(">",""))
        return newObj
    }

const setImageSize = (imgSrcObject, getImageFromFile) => {
    var imgSizePromise = getImageFromFile(imgSrcObject.src).then(fileDimensions=>{
    const ratio = fileDimensions.height * 1.0 / (fileDimensions.width * 1.0)

    return {
        width: imgSrcObject.width 
            ? imgSrcObject.width 
            : fileDimensions.width,
        height: imgSrcObject.height 
            ? imgSrcObject.height 
            : imgSrcObject.width
                ? imgSrcObject.width / ratio   // Scale down based on the width
                : fileDimensions.height         // Use the file dimensions
    }
    }, rej=> new Error("crap"))
    return imgSizePromise
}

const addAltTag = img => img
const addEndTag = img => {
    const endText = "></amp-img>", position = img.endsWith("/>")? -2 : -1
    return img.slice(0,position) + endText
}
const convertToAmpImg = img => "<amp-img" + img.slice(4)

module.exports = {setImageSize: setImageSize, addAltTag: addAltTag, addEndTag: addEndTag, convertToAmpImg: convertToAmpImg,
    getImageProperties: getImageProperties
}