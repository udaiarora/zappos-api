var http= require('http');
//var q = require('querystring');
var express = require('express');
var app = express();
var url_par= require('url');

app.use('/styles', express.static(__dirname + '/styles'));
app.use('/js', express.static(__dirname + '/js'));

app.get('/', function(req, res) {
    res.sendfile('./views/index.html');
});

app.get('/fetch', function(req, res) {
	
	var url="/Search?limit=5&key=52ddafbe3ee659bad97fcce7c53592916a6bfd73&term="+url_par.format(req.query.item),
	//var url="/Product/7925931?key=52ddafbe3ee659bad97fcce7c53592916a6bfd73",

		//create the options to pass into the get request
		options={
			host:"api.zappos.com" ,path:url};
			//host:"localhost:24789" ,path:url};

	//a little lightweight logging to watch requests
	console.log("url:",options.host+options.path);
	console.log("requrl:",req.url);

	//make the request server side
	http.get(options,function(response){
		res.writeHead(200, {'Content-Type': 'text/plain'});
		var pageData = "";
		response.setEncoding('utf8');
	    //stream the data into the response
	    response.on('data', function (chunk) {
	    	pageData += chunk;
	    });

	    //write the data at the end
	    response.on('end', function(){
	    	res.write(pageData);
	    	res.end();
	    });

	});

});


app.listen(24789);


console.log("They see the server rollin', they hatin'. Tryna catch it ridin localhost:24789/");