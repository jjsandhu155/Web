// npm install simple-oauth2

//

var express = require('express')
var router = express.Router()

// module.exports.setup = function( app ) {
    //
    // var cookieSession = require('cookie-session') ;
    var https = require('https');
    // var mysql = require('mysql');
    // var connection = mysql.createConnection( 
    // {
    
    //     host   : process . env . DIRECTOR_DATABASE_HOST ,
    
    //     user   : process . env . DIRECTOR_DATABASE_USERNAME ,
    
    //     password : process . env . DIRECTOR_DATABASE_PASSWORD ,
    
    //     database : process . env . DIRECTOR_DATABASE_NAME
    
    // }
    
    // ) ;
    // var server =  require('http').createServer(app);      // import http and create a server
    //var io = require('socket.io').listen(server);         // attach socket.io to the server
    //
    const { AuthorizationCode } = require( 'simple-oauth2' ) ;
    //
    var ion_client_id     = 'VEWDxsIPCn4vHJ0dzarIITZnONaCLI45Aq57zCoR'     ;
    var ion_client_secret = 'XGNhiwYSaMdL0AWWFJ7TUOEG9R8qOwzr5m50mM3djJ8Q8FDSJ4zZzPaiHOlObJ5LBVLZnupwxjijFAYXmlliSRFjFPiijbWU1uweRWXidmvnuiGUCzW6F4sFI9OvaiAk' ;
    var ion_redirect_uri  = 'https://jj-sandhu.sites.tjhsst.edu/login'   ; // register URI with ION
    //                                       // must also match below
    var client = new AuthorizationCode( {
      client : {
        id : ion_client_id ,
        secret : ion_client_secret ,
      } ,
      auth : {
        tokenHost : 'https://ion.tjhsst.edu/oauth/' ,
        authorizePath : 'https://ion.tjhsst.edu/oauth/authorize' ,
        tokenPath : 'https://ion.tjhsst.edu/oauth/token/'
      }
    } ) ;
    //
    var authorizationUri = client . authorizeURL( {
        scope : 'read' ,
        redirect_uri : ion_redirect_uri
    } ) ;
    // app . use( cookieSession( {
    //         name : '_ga' ,
    //         keys : [ 'SOMETHING' ]
    //     } )
    // ) ;
    
    function not_logged_in( req , res , next )
    {
        if( 'authenticated' in req . session )
        {
            // console.log("authentication success!");
            next();
        }
        else
        {
            if(!('visit_count' in req.session)){
                visit_count = 0;
                // console.log("Set to 0 because visit_count isn't in req.session");
            } else {
                visit_count = req . session . visit_count ;
            }
            //
            if( Number . isNaN( visit_count ) ) {
                visit_count  = 1 ;
                // console.log("Set to 1 again.");
            } else {
                visit_count += 1 ;
                // console.log("Increased by 1");
            }
            if( 'reset' in req . query )
            {
                visit_count = 1;
            }
            req.session.visit_count = visit_count ;
            //
            var obj = {} ;
            //
            // specific info - YES NOW LOGGED IN
            //
            obj . yourname = "user";
            obj . myurl    = authorizationUri;
            obj . urltext  = 'login' ;
            obj . visitor  = visit_count ;
            //
            res . render( 'ionauth' , obj ) ;
        }
    }
    //
    function getUserName(req,res,next) {
        // console.log("getUserName is being called.");
        var access_token = req . session . token . access_token                 ;
        var query_params = 'format=json&access_token='           + access_token ;
        var profile_url  = 'https://ion.tjhsst.edu/api/profile?' + query_params ;
        //
        // like weather app - except we use access token for https requests
        //
        https . get( profile_url , function(response) {
          //
          var rawData = '' ;
          response . on( 'data' , function(chunk) {
              rawData += chunk ;
          } ) ;
          //
          response . on( 'end' , function() {
            res . locals . profile = JSON . parse( rawData ) ;
            next() ;
          } ) ;
          //
        } ) . on( 'error' , function(err) {
            next(err) ;
        } ) ;
    }
    //
    function yes_logged_in( req , res )
    {
        // console.log("yes_logged_in is being called.");
        var profile    = res.locals.profile ;
        var first_name = profile.first_name ;
        // console.log("First Name: "+first_name);
        //
        var visit_count ;
        //
        // same as previous example - visit count
        //
        if( !( 'visit_count' in req . session ) ) {
            visit_count = 0 ;
        } else {
            visit_count = req . session . visit_count ;
        }
        //
        if( Number . isNaN( visit_count ) ) {
            visit_count  = 1 ;
        } else {
            visit_count += 1 ;
        }
        if( 'reset' in req . query || !( 'visit_count' in req . session ) )
        {
            visit_count = 1 ;
        }
        req . session . visit_count = visit_count ;
        //
        var obj = {} ;
        //
        // specific info - YES NOW LOGGED IN
        //
        obj . yourname = first_name ;
        obj . myurl    = 'https://jj-sandhu.sites.tjhsst.edu/logout' ;
        obj . urltext  = 'logout' ;
        obj . visitor  = visit_count ;
        //
        res . render( 'ionauth' , obj ) ;
    }
    //
    // actual endpoint - others are for login and logout - but they redirect back here
    // //
    router . get( '/ionauth' , [ not_logged_in , getUserName , yes_logged_in ] ) ;
    //
    // login endpoint starts with handleCode
    //
    async function handleCode(req, res, next){
        // console.log("handleCode is being called.");
        var theCode = req.query.code;
        //
        // our page needs to check in with ION too
        //
        var options = {
            'code':         theCode          ,
            'redirect_uri': ion_redirect_uri ,
            'scope':        'read'
        } ;
        //
        // needs to be in try/catch
        //
        try {
            //
            // await serializes asyncronous fcn call
            //
            var accessToken = await client.getToken(options);
            //
            // this access token is what we need for https requests
            //
            res . locals . token = accessToken . token ;
            //
            next() ;
        }
        catch (error) {
            console . log( 'Access Token Error' , error . message ) ;
            //
            res . send( 502 ) ; // uh oh
        }
    }
    
    // this is the endpoint we registered with ION
    
    router.get( '/login' , [handleCode] , function( req , res ) {
        req . session . authenticated = true                 ;
        req . session . token         = res . locals . token ;
        //
        res . redirect( 'https://jj-sandhu.sites.tjhsst.edu/ionauth' ) ;
    } ) ;
    //
    // logout endpoint is much simpler
    //
    router . get( '/logout' , function( req , res ) {
        delete req . session . authenticated ;
        delete req . session . token         ;
        //
        res . redirect( 'https://jj-sandhu.sites.tjhsst.edu/ionauth' ) ;
    });
// };
//// -------------- socket initialization -------------- //
// end
//

module.exports = router