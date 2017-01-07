var assert = require('assert');
const tokenize = require('../src/tokenize.js')

const singleImage = 'Pemphigus:<img src="/images/pemphigus.jpg" width=200px alt="pemphigus on dog\'s nose">Discoid Lupus'
const dualImage = 'Pemphigus:<img src="/images/pemphigus.jpg" width=200px alt="pemphigus on dog\'s nose">Discoid Lupus: <img src="foo"/>'

describe('tokenize', function() {
    it('should return 1 token when there are no images present', function() {
        assert.deepEqual(tokenize('Hello world'),['Hello world'])
    })
    it('should split into 3 parts when there\'s one image present', function() {
        assert.deepEqual(tokenize(singleImage), 
        ['Pemphigus:',
        '<img src="/images/pemphigus.jpg" width=200px alt="pemphigus on dog\'s nose">',
        'Discoid Lupus'])
    })
    it('should split into 5 parts when there\'s two images present', function() {
        assert.deepEqual(tokenize(dualImage), 
        ['Pemphigus:',
        '<img src="/images/pemphigus.jpg" width=200px alt="pemphigus on dog\'s nose">',
        'Discoid Lupus: ', '<img src="foo"/>', ""])
    })

});