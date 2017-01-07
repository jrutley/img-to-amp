const tokenInt = function(tokens, remainingString){
    var start = remainingString.indexOf("<img")
    if(start === -1) return tokens.concat([remainingString])
    var end = remainingString.indexOf(">", start+1)+1
    return tokenInt(tokens.concat([remainingString.slice(0,start), remainingString.slice(start, end)]), remainingString.slice(end))
}

const tokenize = initialString => tokenInt([], initialString)
module.exports = tokenize