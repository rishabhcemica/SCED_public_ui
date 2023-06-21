module.exports = function(req, res,ok) {

 

  // If `req.session.me` exists, that means the user is logged in.

    // res.setHeader("X-Content-Type-Options","nosniff");

    

    res.set({

      // 'Pragma':'no-cache',

      "Content-Type": "text/html",

      "X-Content-Type-Options": "nosniff", 

      "X-XSS-Protection": "1; mode=block",

      "X-Download-Options": "noopen",

      "Referrer-Policy": "no-referrer",

      "Strict-Transport-Security": "max-age=15552000; includeSubDomains",

      "X-DNS-Prefetch-Control": "off",

      "Content-Security-Policy": "frame-ancestors 'none'",

      

    })

    // sails.disable('x-powered-by');

    // res.removeHeader("X-Powered-By");

 //   res.removeHeader('Pragma');  

   

 

    return ok();

 

};