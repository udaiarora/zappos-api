// Author: Udai Arora
// www.udaiarora.com
// Made for Zappos Internship 2014

var http= require('http');
var express = require('express');
var app = express();
var url_par= require('url');

app.use('/styles', express.static(__dirname + '/styles'));
app.use('/js', express.static(__dirname + '/js'));

app.get('/', function(req, res) {
	res.sendfile('./views/index.html');
});


//This is called to search for a product/brand, etc
app.get('/fetch', function(req, res) {
	
	var url="/Search?limit=10&key=a73121520492f88dc3d33daf2103d7574f1a3166&term="+url_par.format(req.query.item);
	//var url="/Product/7925931?key=a73121520492f88dc3d33daf2103d7574f1a3166",

		//create the options to pass into the get request
		options={
			host:"api.zappos.com",
			path:url
		};

	//a little lightweight logging to watch requests
	console.log("url:",options.host+options.path);
	console.log("requrl:",req.url);

	//make the request server side of Zappos
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

//This is when the watchlist is submitted
app.get('/watch', function(req, res) {

	//a little lightweight logging to watch requests
	var data=JSON.parse(req.query.watch_list_json);

	var url;
	var discounted_json={disc_items: []};
	var req_count=0;

	for(var num in data.items)
	{

		url ='/Product/styleId/'+data.items[num].styleId+'?&key=a73121520492f88dc3d33daf2103d7574f1a3166&includes=["styles","thumbnailImageUrl"]';
		options={
			host:"api.zappos.com",
			path:url
		};

		try{
			//make the request server side of Zappos to check for the products percentageOff
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
			    		var thumbnailImageUrl=body.product[0].styles[0].thumbnailImageUrl;
			    		var productUrl=body.product[0].styles[0].productUrl;
			    	} catch(err) {
			    		console.log(err);
			    	}
			    	
			    	
			    	if(discount>=20)
			    	{
			    		discounted_json.disc_items.push({"percentOff":discount, "thumbnailImageUrl":thumbnailImageUrl, "productUrl":productUrl});
			    	}

			    	if(data.items.length==req_count)
			    	{
			    		wr();
			    	}

			    });

			});
		} catch(e) {
			console.log("Something went wrong while trying to fetch the discounts.");
		}
	}
	function wr(){
		try{

			res.writeHead(200, {'Content-Type': 'text/plain'});
			res.write(JSON.stringify(discounted_json));
			res.end();
		} catch(e) {
			console.log("Something went wrong while trying to fetch the discounts.");
		}

	}

});




app.listen(24789);


console.log("They see the server rollin', they hatin'. Tryna catch it ridin localhost:24789/");