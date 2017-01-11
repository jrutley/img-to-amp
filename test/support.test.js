const assert = require('assert')
const support = require('../src/support.js')
const sinon = require('sinon')

describe('support', function() {
    describe('addEndTag', function() {
        const beginning = '<amp-img foo'
        it('should append "></amp-img>" to a tag ending in >', function() {
            assert.equal(support.addEndTag(beginning+'>'), beginning + '></amp-img>')
        })
        it('should replace "/>" with "></amp-img>"', function() {
            assert.equal(support.addEndTag(beginning+'/>'), beginning + '></amp-img>')
        })
    })

    describe('getImageProperties', ()=>{
        const beginning = '<amp-img src="', ending='">'
        const relativePath = 'images/image.jpg'
        const absolutePath = 'http://localhost/images/image.jpg'
        it('should match an absolute URL', ()=>{
            assert.equal(support.getImageProperties(beginning+absolutePath+ending).src, absolutePath)
        })
        it('should match a URL when there are multiple properties', ()=>{
            assert.equal(support.getImageProperties(beginning+relativePath+" width=300 "+ending).src, relativePath)
        })
    })

    describe('buildAmpImgFromProperties', () =>{
        it('should begin and end with an amp-img tag',()=>{
            var ampImgString = support.buildAmpImgFromProperties({})
            assert.equal(ampImgString, "<amp-img></amp-img>")
        })
    })

    describe('setImageSize', ()=>{
        const defaultImage = {width: 1000, height: 500}
        const squareImage = {width: 640, height: 640}
        it('should get the default image size if there\'s no specifier', ()=>{
            support.setImageSize({}, url => Promise.resolve(defaultImage)).then(dimensions=>{
            assert.equal(dimensions.width, defaultImage.width)
            assert.equal(dimensions.height, defaultImage.height)})
        })
        it('should return the same height as the specified input width on a square image', ()=>{
            const smallerWidth = 300
            support.setImageSize({width: smallerWidth}, url => Promise.resolve(squareImage)).then(dimensions=>{
            assert.equal(dimensions.width, smallerWidth)
            assert.equal(dimensions.height, smallerWidth)
            })
        })    
        it('should return the scaled height as the specified input width on a rectangular image', ()=>{
            const image = {width:500, height: 1000}
            const smallerWidth = 300
            support.setImageSize({width: smallerWidth}, url => Promise.resolve(image)).then(dimensions => {
            assert.equal(dimensions.width, smallerWidth)
            assert.equal(dimensions.height, smallerWidth/2)
        })})
        it('should return the specified width and height if they\'re both already present', ()=>{
            const image = {width:500, height: 1000}
            support.setImageSize({width: 300, height: 275}, url => Promise.resolve(image)).then(dimensions=>{
            assert.equal(dimensions.width, 300)
            assert.equal(dimensions.height, 275)
        })})
        it('should return the specified width if width ends with px', ()=>{
            const image = {width:500, height: 1000}
            support.setImageSize({width: 300, height: 275}, url => Promise.resolve(image)).then(dimensions=>{
            assert.equal(dimensions.width, 300)
            assert.equal(dimensions.height, 275)
        })})
    })
})
