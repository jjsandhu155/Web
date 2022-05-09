// Facts About

var express = require('express')
var router = express.Router()

router.get('/facts', function(req, res) {
    if(req.query.topic === 'X' || (req.query.topic === '' && req.query.num !== '')) {
        res.render('undefined');
    }
    
    var facts = [];
    for(var i = 0; i <= req.query.num; i++) {
        var temp = '';
        temp += 'Fact #' + i+1 + ' ';
        for(var j = 0; j <= i; j++) {
            temp += req.query.topic;
        }
        facts = facts.concat(temp);
    }
    
    res.render('facts', {topic: req.query.topic, num: req.query.num, facts: facts});
    console.log('user has landed at page: facts');
});


module.exports = router

