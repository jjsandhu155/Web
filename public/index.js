var express = require( 'express' ) ;

var app = express() ;

//

app.set( 'port' , process.env.PORT || 80 ) ;

//

// ************************************************

app . set( 'view engine' , 'hbs' ) ; /* hbs */

// ************************************************

//

app . get( '/' , function( req , res ) {   

   var obj = {};
   
   obj.name = 'JJ';
   obj.month = 'February' ;
   obj.year = '2021';
   
   res.render('index', obj);
} ) ;

app.get('/jury', function(req, res) {
    res.render('jury');
    console.log('user has landed at page: jury'); 
});



app.use("/", require("./routes/dogcatfish"))
app.use("/", require("./routes/factsabout"))
app.use("/", require("./routes/apod"))
app.use("/", require("./routes/weather"))
app.use("/", require("./routes/cookie_demo"))
app.use("/", require("./routes/ionauth"))


app.get('/:page', function(req, res) {
    res.send("Error: page not found");
});


var listener = app . listen( app.get( 'port' )  , function() {   

   console . log( "Express server started on port: " + listener . address() . port ) ;

} ) ;

