var url = require('url');
var http = require('http');

var sizeOf = require('image-size');
const Rx = require('rx')

var getFunction = imgUrl => {
    var options = url.parse(imgUrl);

    return new Promise((resolve,reject)=>{
        http.get(options, function (response) {
            if (response.statusCode == 200) {
                var chunks = []
                response.on('data', d => {
                    chunks.push(d)
                })
                response.on('end', e => {
                    var buffer = Buffer.concat(chunks)

                    resolve(sizeOf(buffer))
                })
            }
            else{
                reject(response.statusMessage)
            }
        })
    })
}
module.exports = getFunction

// Retrieval should return something in this format:
// img => {width: XX, height: YY}