/**
 * GenRatesController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
getRates:async function(req,res){
const request= require('request');

var month_names =["Jan","Feb","Mar",
                      "Apr","May","Jun",
                      "Jul","Aug","Sep",
                      "Oct","Nov","Dec"];


   var rates=await GenRates.find({});
   var sdate=req.allParams()['date'];
   console.log(sdate);
  
   var arrlen=sdate.length;

   var stdate=sdate[0].split("-")[0]+"-"+month_names[parseInt(sdate[0].split("-")[1])-1]+"-"+sdate[0].split("-")[2];
var etdate=sdate[arrlen-1].split("-")[0]+"-"+month_names[parseInt(sdate[arrlen-1].split("-")[1])-1]+"-"+sdate[arrlen-1].split("-")[2];


   //var rampu='[{';
   //var ramd='[{';
   var vc='[{';
   //console.log("hello");
   for(var i=0;i<rates.length-1;i++){
//console.log(rates[i]);
     vc+='"'+rates[i]['id']+'":"'+rates[i]['vc']+'",';
      //ramp+='"'+rates[i]['id']+'":"'+rates[i]['vc']+'",';
   }
vc+='"'+rates[i]['id']+'":"'+rates[i]['vc']+'"}]';




//http.post()
// http.get('http://10.5.112.157/rrasapi?date=16-mar-2019',function(res){

//    console.log("********************************************************************************************");
//     res.on('data', function (body) {
//     console.log('Body: ' + body);
//   });

// });

var vcJson= await sails.helpers.getVc.with({sdate:stdate,edate:etdate});
//console.log(vcJson);


   res.send(vcJson);
},
getRamp:async function(req,res){
   var month_names =["Jan","Feb","Mar",
                      "Apr","May","Jun",
                      "Jul","Aug","Sep",
                      "Oct","Nov","Dec"];
  var sdate=req.allParams()['date'];
   
   //var arrlen=sdate.length;

   var stdate=sdate.split("-")[0]+"-"+month_names[parseInt(sdate.split("-")[1])-1]+"-"+sdate.split("-")[2];
//var etdate=sdate[arrlen-1].split("-")[0]+"-"+month_names[parseInt(sdate[arrlen-1].split("-")[1])-1]+"-"+sdate[arrlen-1].split("-")[2];
var vcJson= await sails.helpers.getRamp.with({sdate:stdate});


   res.send(vcJson);


},
getRampDates:async function(req,res){
   var month_names =["Jan","Feb","Mar",
                      "Apr","May","Jun",
                      "Jul","Aug","Sep",
                      "Oct","Nov","Dec"];
  var sdate=req.allParams()['date'];
   
   //var arrlen=sdate.length;
var finalResult=[];

for(var i=0;i<sdate.length;i++)
{   var stdate=sdate.split("-")[0]+"-"+month_names[parseInt(sdate.split("-")[1])-1]+"-"+sdate.split("-")[2];
//var etdate=sdate[arrlen-1].split("-")[0]+"-"+month_names[parseInt(sdate[arrlen-1].split("-")[1])-1]+"-"+sdate[arrlen-1].split("-")[2];
var vcJson= await sails.helpers.getRamp.with({sdate:stdate});

finalResult.push(vcJson);

}


   res.send(finalResult);


},
getRampDatesData:async function(req,res){
   var month_names =["Jan","Feb","Mar",
                      "Apr","May","Jun",
                      "Jul","Aug","Sep",
                      "Oct","Nov","Dec"];
  var sdate=req.allParams()['date'];
   
   //var arrlen=sdate.length;
var finalResult={};

for(var i=0;i<sdate.length;i++)
{   var stdate=sdate[i].split("-")[0]+"-"+month_names[parseInt(sdate[i].split("-")[1])-1]+"-"+sdate[i].split("-")[2];
//var etdate=sdate[arrlen-1].split("-")[0]+"-"+month_names[parseInt(sdate[arrlen-1].split("-")[1])-1]+"-"+sdate[arrlen-1].split("-")[2];
var vcJson= await sails.helpers.getRamp.with({sdate:stdate});

finalResult[sdate[i]]=vcJson;

}


   res.send(finalResult);


},
getCurtailment:async function(req,res){
  var month_names =["Jan","Feb","Mar",
                      "Apr","May","Jun",
                      "Jul","Aug","Sep",
                      "Oct","Nov","Dec"];
  var sdate=req.allParams()['date'];
   
   //var arrlen=sdate.length;

   var stdate=sdate.split("-")[0]+"-"+month_names[parseInt(sdate.split("-")[1])-1]+"-"+sdate.split("-")[2];
//var etdate=sdate[arrlen-1].split("-")[0]+"-"+month_names[parseInt(sdate[arrlen-1].split("-")[1])-1]+"-"+sdate[arrlen-1].split("-")[2];
var vcJson= await sails.helpers.getCurtail.with({sdate:stdate});


   res.send(vcJson);

},
getHighestCostGen:async function(req,res){
   var month_names =["Jan","Feb","Mar",
                      "Apr","May","Jun",
                      "Jul","Aug","Sep",
                      "Oct","Nov","Dec"];


   var sdate=req.allParams()['dates'];
  
   var arrlen=sdate.length;

   var stdate=sdate[0].split("-")[0]+"-"+month_names[parseInt(sdate[0].split("-")[1])-1]+"-"+sdate[0].split("-")[2];
var etdate=sdate[arrlen-1].split("-")[0]+"-"+month_names[parseInt(sdate[arrlen-1].split("-")[1])-1]+"-"+sdate[arrlen-1].split("-")[2];


var vcJson=JSON.parse(await sails.helpers.getVc.with({sdate:stdate,edate:etdate}));
res.send(vcJson);
//console.log(vcJson['01-Dec-2019']);




}

};

