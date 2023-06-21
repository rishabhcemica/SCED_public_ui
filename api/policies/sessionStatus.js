module.exports = function (req, res, next) {
   if(req.session.login!=true)
  	{
    	res.redirect('/');
  	}
};