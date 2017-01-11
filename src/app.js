const sql = require('./sql.js')
const tokenize = require('./tokenize.js')
const support = require('./support.js')
const imageRetrieval = require('./imageRetrieval.js')
const Rx = require('rx')

const closeTag = q => q.question_response

const imgSize = img => imageRetrieval(img)

const transform = img =>{
        var imgTag = support.addEndTag(support.convertToAmpImg(img))
        var imageProperties = support.getImageProperties(imgTag)
        return support.setImageSize(imageProperties, imgSize).then((size,rej)=>{
            var imageProps = JSON.parse(JSON.stringify(imageProperties))
            imageProps.width = size.width
            imageProps.height = size.height
            return imageProps
        })
    }

var observable = sql("select * from conversations where question_response like '%<img%' limit 2")
.map(q=>{
    // Split into the (pre-img)<img----->(post-img)
    return {qid: q.fk_question_id, order: q.order, token: tokenize(q.question_response)}
})
.map(q => {
    return {
        qid: q.qid,
        order: q.order,
        token: q.token.map(x => x.startsWith("<img",0) 
            ? Rx.Observable.fromPromise(transform(x))
            : Rx.Observable.just(x)
        )
    }
})

var observer = observable.subscribe(next=>{
    var reduced = next.token.reduce((acc,index)=>acc.concat(index))
    var question_response = ""
    reduced.subscribe(x=>{
        // onNext: build up the elements to parse
        // TODO: Convert the objects into their string representation
        question_response += x
    },e=>{console.log("Error:" + e)},
    complete=>{
        // call sql update here
        var result = "update conversations set question_response = '" + question_response + "' where fk_question_id = " + next.qid + " and order = " + next.order
        // TODO: Escape '
        console.log(result)
    })
})
