/**
 * LoginController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

	index:async function(req,res){
		var notice=req.allParams()['notice'];
		if(req.session.login==true)
			res.redirect("/dashboard");
		else
			res.view('pages/login',{
	               notice: notice
	        });
	},

	attempt:async function(req,res){

		var username=req.allParams()['username'];
		var password=req.allParams()['password'];

		//captcha verification start
		
		captcha=req.allParams()['g-recaptcha-response'];
		//console.log(captcha);
		/*
		const https=require('https');
		const querystring = require('querystring');
		var postData = querystring.stringify({
    		'secret' : '6LdTtusUAAAAACtQ5DydCJF45mkna-40eTcBZhrb',
    		'response' : captcha
		});

		var options = {
		  hostname: 'www.google.com',
		  port: 443,
		  path: '/recaptcha/api/siteverify',
		  method: 'POST',
		  headers: {
		       'Content-Type': 'application/x-www-form-urlencoded',
		       'Content-Length': postData.length
		     }
		};
		console.log(captcha);
		var reqC = https.request(options, (resC) => {
		  //console.log('statusCode:', resC.statusCode);
		  //console.log('headers:', resC.headers);
		  console.log('response');

		  resC.on('data', (d) => {
		    console.log(d.success);
		    console.log("done");
		  });
		});

		reqC.on('error', (e) => {
		  console.error(e);
		});
		*/
		//captcha verification end

		const http = require('http');
		encoded_password=encodeURIComponent(password)
		http.get("http://10.5.134.44:5000?username=" +username+"&password="+encoded_password+"&captcha="+captcha , function(res1) {
   			console.log("http://10.5.134.44:5000?username=" +username+"&password="+encoded_password+"&captcha="+captcha );
   			//console.log(chunk)
			res1.on('data', function (chunk) {
				console.log(chunk.toString())
    			//res.setHeader("Content-Type", "text/html");
    			//res.send(chunk);
    			//console.log(chunk);
    			//res.redirect('/?notice='+chunk);
    			if(chunk=='Captcha Failed'){
				req.session.login=true;
				res.redirect('/dashboard');
    				//res.redirect('/?notice=Captcha Error!!!');
    			}
    			else if(chunk=='Success'){
    				req.session.login=true;
    				res.redirect('/dashboard');
    			}
    			else{
    				res.redirect('/?notice=Login error');	
    			}
  			});

		}).on('error', function(e) {
    		console.log("Got error: " + e.message);
		});
		
	},
  
	logout:async function(req,res){
		req.session.destroy();
		res.redirect('/?notice=Logged Out');
	}
};
