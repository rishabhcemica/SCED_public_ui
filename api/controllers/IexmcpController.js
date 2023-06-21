/**
 * IexmcpController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

	getIEXMCPData:async function(req,res){

		var dates=req.allParams()['dates'];
		var final=[]
		for(var d=0;d<dates.length;d++){
			var data=await Iexmcp.find({'_id':dates[d]});
			//console.log(data);
			final.push(...data[0].MCP);
		}
		//console.log(final);
		res.send(final);

	}
  

};

