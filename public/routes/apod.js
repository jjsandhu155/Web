
var express = require('express')
var router = express.Router()



var https = require('https');

var url = 'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY';

var options = { headers : { 'User-Agent' : 'request' } };


router.get( '/apod' , [ func01 , func02 ] ) ;

function func01(req, res, next)
{
	if('date' in req.query){
	    url = 'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date='+req.query.date;
	}
	https.get(url, options, function(response){
		rawData = '';
		response.on('error', function(){
		    
		});
		
  		response.on('data', function(chunk){
			rawData +=chunk;
  		});
		response.on('end', function(){
			res.locals.obj = JSON . parse( rawData ) ;
			next();
  		});
	});
}
//
function func02( req , res )
{
	data = res.locals.obj;
	res.render('apod', data);
}

module.exports = router
