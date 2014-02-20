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
	
	var url="/Search?limit=20&key=52ddafbe3ee659bad97fcce7c53592916a6bfd73&term="+url_par.format(req.query.item);
	//var url="/Product/7925931?key=52ddafbe3ee659bad97fcce7c53592916a6bfd73",

		//create the options to pass into the get request
		options={
			host:"api.zappos.com",
			path:url
		};
			//host:"localhost:24789" ,path:url};

	//a little lightweight logging to watch requests
	console.log("url:",options.host+options.path);
	console.log("requrl:",req.url);

	//make the request server side
	http.get(options,function(response){
		res.writeHead(200, {'Content-Type': 'text/plain'});
		var responseData = "";
		response.setEncoding('utf8');
	    //stream the data into the response
	    response.on('data', function (chunk) {
	    	responseData += chunk;
	    });

	    //write the data at the end
	    response.on('end', function(){
	    	res.write(responseData);
	    	res.end();
	    });

	});

});


app.get('/watch', function(req, res) {

	//a little lightweight logging to watch requests
	//console.log(req.query.watch_list_json);
	//console.log("requrl:",req.url);

	var data=JSON.parse(req.query.watch_list_json);

	var url;
	var discounted_json={disc_items: []};
	var req_count=0;

	for(var num in data.items)
	{

		url ='/Product/styleId/'+data.items[num].styleId+'?&key=52ddafbe3ee659bad97fcce7c53592916a6bfd73&includes=["styles"]';
		options={
			host:"api.zappos.com",
			path:url
		};

		try{
			//make the request server side to check for the products percentageOff
			http.get(options,function(response){
				req_count++;
				var responseData = "";
				response.setEncoding('utf8');
			    //stream the data into the response
			    response.on('data', function (chunk) {
			    	responseData+=chunk.toString();
			    });
			    //responseData=JSON.parse(responseData);
			    //write the data at the end
			    response.on('end', function(){
			    	
			    	body=JSON.parse(responseData);
			    	try{
			    		var discount=body.product[0].styles[0].percentOff.replace('%','');
			    	} catch(err) {
			    		console.log(err);
			    	}
			    	
			    	
			    	if(discount>=20)
			    	{
			    		discounted_json.disc_items.push({"percentOff":discount});
			    	}

			    	if(data.items.length==req_count)
			    	{
			    		wr();
			    	}

			    });

			});
		} catch(e) {
			res.writeHead(200, {'Content-Type': 'text/plain'});
			res.write("Something went wrong while trying to fetch the discounts.");
			console.log("Something went wrong while trying to fetch the discounts.");
			res.end();
		}
	}
	function wr(){
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.write(JSON.stringify(discounted_json));
		res.end();
	}

});




app.listen(24789);


console.log("They see the server rollin', they hatin'. Tryna catch it ridin localhost:24789/");