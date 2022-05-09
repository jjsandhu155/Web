
var express = require('express')
var router = express.Router()



var https = require('https');
var options = {headers : {'User-Agent' : 'request' } } ;

// module . exports . run_setup = function( app ) {
    router.get('/weather', [func00, func01, func02]);  


    function func00 (req, res, next) {
        var xVal = req.query.lat;
        var yVal = req.query.long;
        var url = 'https://api.weather.gov/points/';
        if (isEmpty(xVal) || isEmpty(yVal)  ) {
            res.render('weatherError');
        }
        else {
        url += xVal;
        url += ',';
        url += yVal;
        }
     
        https. get(url, options, function (response) {
            response.on('error' , function(err) {
                 res.render('weatherissue');   
            });
            
            var rawData = '';
            
            response.on('data', function(chunk) {
                rawData += chunk;
            } );
            
            response.on('end', function() {
                var obj = JSON . parse( rawData ) ;  
                var url_2 = obj . properties . forecastHourly ;
                res . locals . url2 = url_2;
                next();
            } );
        } );
    }
    
    function func01 (req, res, next) {
        var finalUrl = res . locals . url2;
        https. get(finalUrl, options, function (response) {
            response.on('error' , function(err) {
                 res.render('error');   
            });
            
            var rawData2 = '';
            
            response.on('data', function(chunk) {
                rawData2 += chunk;
            } );
            
            response.on('end', function() {
                var obj = JSON . parse( rawData2 ) ;  
                let list = obj.properties.periods.slice(6) ;
                console . log ( list );
                res . locals . list = list;
                next();
            } );
        } );            
    }
    
    function func02 (req, res) {
        res.render('weather', { 'list' : res.locals.list });
    }
    
    function isEmpty(str) {
        return (!str || str.length === 0 );
    }

// };


module.exports = router