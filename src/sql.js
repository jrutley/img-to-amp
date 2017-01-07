const dotenv = require('dotenv').config()
const requireEnv = require('require-environment-variables')
requireEnv(['DBHOST', 'DBUSER', 'DBPASS', 'DBNAME'])

const mysql = require('mysql')
const Rx = require('rx')

var source = myQuery => Rx.Observable.using(() => { 
    var connection = mysql.createConnection({
              host: process.env.DBHOST,
              user: process.env.DBUSER,
              password: process.env.DBPASS,
              database: process.env.DBNAME
            })
    connection.dispose = () => {connection.end()}
    return connection
 },
 function (connection) {
     var query = connection.query(myQuery)
     return Rx.Observable.create(observer=>{
        query
        .on('error', err => {
            // Handle error, an 'end' event will be emitted after this as well
            observer.onError(err)
        })
        .on('fields', function(fields) {
            // the field packets for the rows to follow
        })
        .on('result', function(row) {
            // Pausing the connnection is useful if your processing involves I/O
            connection.pause();
            observer.onNext(row)        
            connection.resume()
        })
        .on('end', function() {
            // all rows have been received
            observer.onCompleted()
        })
    })
})

module.exports = source