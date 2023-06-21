/**
 * DcoffbarreqController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
    getdcoffbarreq: async function(req,res) {
  	var startdate=(req.allParams()['startdate']);
  	//console.log(startdate);
  	var ndate= startdate.split('-');
	startdate = ndate[2] + '-' + ndate[1] + '-' + ndate[0];

  	var enddate=(req.allParams()['enddate']);
  	ndate= enddate.split('-');
	enddate = ndate[2] + '-' + ndate[1] + '-' + ndate[0];
	var gen_name=req.allParams()['gen_name'];
	var finalD=[];
	var xaxisdata=[];
//console.log(startdate + enddate + gen_name);
// var result= await Dcoffbar.find().where({"createdAt":{
//         '<=': new Date(enddate),
//         '>=': new Date(startdate)
//     },
//     "gen_name":gen_name
// });


// for(var i=0;i<result.length;i++)
// {
// 	finalD.push(...result[i][region]);
// }

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://10.5.112.198:27017/";
var finalD;
let queryenddate=new Date(enddate).toISOString();
let querystartdate=new Date(startdate).toISOString();

//console.log(querydate);
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("dc");
  //var query = { address: "Park Lane 38" };
  dbo.collection("dcoffbarreq").find({ createdAt:{'$lte':queryenddate, '$gte':querystartdate}, gen_name:gen_name
  }).toArray(function(err, result) {
    if (err) throw err;
    finalD=result;
    //console.log('result is: ');
    //console.log(result);
    res.send(finalD);
    db.close();
  });
});
//var result=await Dcoffbar.find();

// {createdAt:{
//          '<=': new Date(enddate),
//          '>=': new Date(startdate)
//      } ,

	

  } 


};

