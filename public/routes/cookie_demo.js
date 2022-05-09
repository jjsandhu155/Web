var express = require('express')
var router = express.Router()

var cookieSession = require('cookie-session')

router.use(cookieSession({
  name: 'blessed_cookie',
  keys: ['topsecret']
}))

router.get('/cookie_demo', function(req, res) {
    var visit_count = 1000
    if (!('visit_count' in req.session)) {
        visit_count = 0
    } else {
        visit_count = req.session.visit_count
    }
    if (Number.isNaN(visit_count)) {
        visit_count = 1
    } else {
        visit_count += 1
    }
    
    if( 'reset' in req . query || !( 'visit_count' in req . session ) )

        {

            visit_count = 1 ;

        }
    req.session.visit_count = visit_count
    
    res.render('cookie_demo', {'visit_number':visit_count})
})

module.exports = router
