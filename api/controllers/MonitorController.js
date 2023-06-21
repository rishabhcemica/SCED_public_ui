/**
 * MonitorController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

	index:async function(req,res){
		if(req.session.login!=true)
  		{
    		res.redirect('/');
  		}

		res.setHeader("Content-Type", "text/html"); 
		const http = require('http');
		data="";
		http.get("http://10.5.134.44/spinreserve/" , function(res1) {
   			//console.log("http://localhost:5000?username=" +username+"&password="+password+"&captcha="+captcha );
   			res1.on('data', function (chunk) {
    			data+=chunk;		
  			});

   			res1.on("end", function () {
       			 
       			 res.send(data.replace(/http:\/\/10.5.134.31:1337/g, 'https://scedpublic.posoco.in/dashboard'));
    		});

		}).on('error', function(e) {
    		console.log("Got error: " + e.message);
		});

	}
  

};

