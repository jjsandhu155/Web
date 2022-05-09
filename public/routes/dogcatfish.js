// dog-cat-fish

var express = require('express')
var router = express.Router()

router.get('/dog', function(req, res) {
    res.render('dog');
    console.log('user has landed at page: dog'); 
});

router.get('/cat', function(req, res) {
    res.render('cat');
    console.log('user has landed at page: cat'); 
});

router.get('/fish', function(req, res) {
    res.render('fish');
    console.log('user has landed at page: fish'); 
});

router.get('/pet', function(req, res) {
    if(req.query.type == 'dog') {
        res.render('dog');
        console.log('user has landed at page: dog');
    }
    if(req.query.type == 'cat') {
        res.render('cat');
        console.log('user has landed at page: cat');
    }
    if(req.query.type == 'fish') {
        res.render('undefined');
        console.log('user has landed at page: undefined');
    }
});


module.exports = router

