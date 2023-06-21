/**
 * MarginalCostController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  smoothSMP:async function(req,res){
var month_names =["Jan","Feb","Mar",
                      "Apr","May","Jun",
                      "Jul","Aug","Sep",
                      "Oct","Nov","Dec"];

var sdate=req.allParams()['selectedDate'];


  var curr_date=new Date();
         curr_date.setHours(curr_date.getHours()+5);
        curr_date.setMinutes(curr_date.getMinutes()+30);
       curr_date= curr_date.toISOString().slice(0,10);
var curr_date1=new Date();
        var hh=curr_date1.getHours();
        var mm=curr_date1.getMinutes();
     curr_date=curr_date.split("-").reverse().join("-");
     var curr_block=Math.ceil(hh*4)+Math.ceil(mm/15.0);
     var curr_block_dummy=curr_block;

      var mon=parseInt(sdate[0].split("-")[1])-1;
      var mon1=parseInt(sdate[sdate.length-1].split("-")[1])-1;

      var vcDates=sdate[0].split("-")[0]+"-"+month_names[mon]+"-"+sdate[0].split("-")[2];
     //console.log(vcDate);
     var vcDatef=sdate[sdate.length-1].split("-")[0]+"-"+month_names[mon1]+"-"+sdate[sdate.length-1].split("-")[2];
      var vcJson= await sails.helpers.getVc.with({sdate:vcDates,edate:vcDatef});
      //console.log(typeof(vcJson));
     vcJson=JSON.parse(vcJson);

let vclookup={}

for(let d=0;d<sdate.length;d++){
  var vcDate=sdate[d].split("-")[0]+"-"+month_names[mon]+"-"+sdate[d].split("-")[2];
  vclookup[sdate[d]]={}

  for(let key in vcJson[vcDate]){
    vclookup[sdate[d]][parseInt(vcJson[vcDate][key]).toString()]=key
  }


}

//console.log(vclookup)

     //console.log(JSON.stringify(vcJson))
     let scedexclude =  await Scedexcludehist.find({where:{id:{'<=':  new Date(sdate[sdate.length-1].split("-").reverse().join("-") ),
     '>=':  new Date(sdate[0].split("-").reverse().join("-") ) }}}).sort('id DESC');
     let rrasexclude =  await Excludehist.find({where:{id:{'<=':  new Date(sdate[sdate.length-1].split("-").reverse().join("-") ),
     '>=':  new Date(sdate[0].split("-").reverse().join("-") ) }}}).sort('id DESC');
     let onbardc =  await Gamspwc.find({where:{'dateString':{'<=':  new Date(sdate[sdate.length-1].split("-").reverse().join("-") ),
     '>=':  new Date(sdate[0].split("-").reverse().join("-") ) }}});

let sced = {}
let rras = {}
let onbar={}

for(let d=0;d<scedexclude.length;d++){
  sced[scedexclude[d]['on_date']]=scedexclude[d]
}

for(let d=0;d<rrasexclude.length;d++){
  rras[rrasexclude[d]['on_date']]=rrasexclude[d]
}



for(let d=0;d<onbardc.length;d++){
  onbardc[onbardc[d]['id']]=onbardc[d]
}

//console.log(onbardc)

let barVc={'rras':{},'sced':{}}
for(let d=0;d<sdate.length;d++){
  var vcDate=sdate[d].split("-")[0]+"-"+month_names[mon]+"-"+sdate[d].split("-")[2];
       barVc['rras'][sdate[d]]={}
       barVc['sced'][sdate[d]]={}
       for(let i=0;i<96;i++){
        barVc['rras'][sdate[d]][(i+1).toString()]={}
        barVc['sced'][sdate[d]][(i+1).toString()]={}
        let temp=[]
        let temps=[]
        for(let key in vcJson[vcDate]){
          //console.log(key)
          if(key!="" && rras[sdate[d]]["data"][key][i]!=1 && onbardc[sdate[d]+key]['dconbar'][i]!=0)
          temp.push({'gen':key,'val':vcJson[vcDate][key]})
        }

        for(let key in vcJson[vcDate]){
          if(key!="" && sced[sdate[d]]["data"][key][i]!=1 && onbardc[sdate[d]+key]['dconbar'][i]!=0)
          temps.push({'gen':key,'val':vcJson[vcDate][key]})
        }
       
       let obj={'mingen':'','minval':10000,'maxgen':'','maxval':-1}
        let objs={'mingen':'','minval':10000,'maxgen':'','maxval':-1}
       
        for(let j=0;j<temp.length;j++){

              if(parseInt(temp[j]['val'])>obj['maxval'])
              {
                obj['maxval']= (temp[j]['val'])
                obj['maxgen'] = temp[j]['gen']
              }
              if(parseInt(temp[j]['val'])<obj['minval']){
              obj['minval']= (temp[j]['val'])
                obj['mingen'] = temp[j]['gen']
              }

        }


        for(let j=0;j<temps.length;j++){

              if(parseInt(temps[j]['val'])>objs['maxval'])
              {
                objs['maxval']= (temps[j]['val'])
                objs['maxgen'] = temps[j]['gen']
              }
              if(parseInt(temps[j]['val'])<objs['minval']){
              objs['minval']= (temps[j]['val'])
                objs['mingen'] = temps[j]['gen']
              }

        }

        barVc['rras'][sdate[d]][(i+1).toString()]=obj
        barVc['sced'][sdate[d]][(i+1).toString()]=objs

       }

}

//console.log(JSON.stringify(barVc))

 //console.log(vcJson)
var final=[];
var tt=[];
tt.push("Generator");
tt.push("SMPSCED");
tt.push("SCEDGEN");
tt.push("SMPRRAS");
tt.push("RRASGEN");

final.push(tt);






for(var d=0;d<sdate.length;d++)
{

  if(curr_date!=sdate[d]){
  curr_block=96;
}else{
  curr_block=curr_block_dummy;
}
var mcdata=await MarginalCost.find({on_date:{'contains':sdate[d]}});
var mcrras=await Rrassmp.find({on_date:{'contains':sdate[d]}});


for(var i=1;i<curr_block+1;i++){
  var on_date;
  if(i!=0)
   on_date=sdate[d]+":"+(i).toString();
    else
       on_date=sdate[d]+":"+(i).toString();
      var gdata=[];
      var rdata=[];
   for(var j=0;j<mcdata.length;j++){
    if(mcdata[j]['on_date']==on_date){
      gdata.push(mcdata[j]);
      break;
    }
   }


 for(var j=0;j<mcrras.length;j++){
    if(mcrras[j]['on_date']==on_date){
      rdata.push(mcrras[j]);
      break;
    }
   }

   // console.log(i);
  //var gdata = await MarginalCost.find({where:{on_date:on_date}});
  var temp=[];
  //console.log(gdata);
  if(typeof(gdata[0])!="undefined" && typeof(gdata[0]['cost'])!="undefined" && typeof(rdata[0])!="undefined" && typeof(rdata[0]['cost'])!="undefined")
{ temp.push(sdate[d]+":"+(i).toString());

  if(parseInt(gdata[0]['cost']['6']) >2000){
    temp.push(barVc["sced"][sdate[d]][(i).toString()]["maxval"])
    temp.push(barVc["sced"][sdate[d]][(i).toString()]["maxgen"])
  }
  else{
    temp.push(parseInt(gdata[0]['cost']['6']))
    temp.push(vclookup[sdate[d]][parseInt(gdata[0]['cost']['6']).toString()]);
  }


if(parseInt(rdata[0]['cost']['6']) >2000){
    temp.push(barVc["rras"][sdate[d]][(i).toString()]["maxval"])
    temp.push(barVc["rras"][sdate[d]][(i).toString()]["maxgen"])
  }
  else if(parseInt(rdata[0]['cost']['6']) < -2000)
  {
//console.log(i)
   temp.push(barVc["rras"][sdate[d]][(i).toString()]["minval"])
    temp.push(barVc["rras"][sdate[d]][(i).toString()]["mingen"])
 
  }else{
    temp.push(parseInt(rdata[0]['cost']['6']))
   temp.push(vclookup[sdate[d]][parseInt(rdata[0]['cost']['6']).toString()]);
  }
  }


else{
    temp.push(sdate[d]+":"+(i).toString());
    temp.push(0);
    temp.push("NA");
     temp.push(0);
    temp.push("NA");
  
  }
final.push(temp);

  


}

}

//console.log(JSON.stringify(final));
res.send(JSON.stringify(final));



},

  getTodayCost:async function(req,res){
var sdate=req.allParams()['selectedDate'];


  var curr_date=new Date();
         curr_date.setHours(curr_date.getHours()+5);
        curr_date.setMinutes(curr_date.getMinutes()+30);
       curr_date= curr_date.toISOString().slice(0,10);
var curr_date1=new Date();
        var hh=curr_date1.getHours();
        var mm=curr_date1.getMinutes();
     curr_date=curr_date.split("-").reverse().join("-");
     var curr_block=Math.ceil(hh*4)+Math.ceil(mm/15.0);
     var curr_block_dummy=curr_block;

      
var final=[];
var tt=[];
tt.push("Generator");
tt.push("NER");
tt.push("NR");
tt.push("SR");
tt.push("AI");
final.push(tt);






for(var d=0;d<sdate.length;d++)
{

  if(curr_date!=sdate[d]){
  curr_block=96;
}else{
  curr_block=curr_block_dummy;
}
var mcdata=await MarginalCost.find({on_date:{'contains':sdate[d]}});

for(var i=1;i<curr_block+1;i++){
  var on_date;
  if(i!=0)
   on_date=sdate[d]+":"+(i).toString();
    else
       on_date=sdate[d]+":"+(i).toString();
      var gdata=[];
   for(var j=0;j<mcdata.length;j++){
    if(mcdata[j]['on_date']==on_date){
      gdata.push(mcdata[j]);
      break;
    }
   }  
   // console.log(on_date);
  //var gdata = await MarginalCost.find({where:{on_date:on_date}});
  var temp=[];
  //console.log(gdata);
  if(typeof(gdata[0])!="undefined" && typeof(gdata[0]['cost'])!="undefined" )
{ temp.push(sdate[d]+":"+(i).toString());
  temp.push(parseInt(gdata[0]['cost']['1']));
  temp.push(parseInt(gdata[0]['cost']['3']));
    temp.push(parseInt(gdata[0]['cost']['5']));
    temp.push(parseInt(gdata[0]['cost']['6']));

}else{
    temp.push(sdate[d]+":"+(i).toString());
    temp.push(0);
    temp.push(0);
      temp.push(0);
    temp.push(0);
  }
final.push(temp);

  


}

}

//console.log(JSON.stringify(final));
res.send(JSON.stringify(final));


},
 getTodayCostRras:async function(req,res){
var sdate=req.allParams()['selectedDate'];


  var curr_date=new Date();
         curr_date.setHours(curr_date.getHours()+5);
        curr_date.setMinutes(curr_date.getMinutes()+30);
       curr_date= curr_date.toISOString().slice(0,10);
var curr_date1=new Date();
        var hh=curr_date1.getHours();
        var mm=curr_date1.getMinutes();
     curr_date=curr_date.split("-").reverse().join("-");
     var curr_block=Math.ceil(hh*4)+Math.ceil(mm/15.0);
     var curr_block_dummy=curr_block;

      
var final=[];
var tt=[];
tt.push("Generator");
tt.push("NER");
tt.push("NR");
tt.push("SR");
tt.push("AI");
final.push(tt);






for(var d=0;d<sdate.length;d++)
{

  if(curr_date!=sdate[d]){
  curr_block=96;
}else{
  curr_block=curr_block_dummy;
}
var mcdata=await Rrassmp.find({on_date:{'contains':sdate[d]}});

for(var i=1;i<curr_block+1;i++){
  var on_date;
  if(i!=0)
   on_date=sdate[d]+":"+(i).toString();
    else
       on_date=sdate[d]+":"+(i).toString();
      var gdata=[];
   for(var j=0;j<mcdata.length;j++){
    if(mcdata[j]['on_date']==on_date){
      gdata.push(mcdata[j]);
      break;
    }
   }  
   // console.log(on_date);
  //var gdata = await MarginalCost.find({where:{on_date:on_date}});
  var temp=[];
  //console.log(gdata);
  if(typeof(gdata[0])!="undefined" && typeof(gdata[0]['cost'])!="undefined" )
{ temp.push(sdate[d]+":"+(i).toString());
  temp.push(parseInt(gdata[0]['cost']['1']));
  temp.push(parseInt(gdata[0]['cost']['3']));
    temp.push(parseInt(gdata[0]['cost']['5']));
    temp.push(parseInt(gdata[0]['cost']['6']));

}else{
    temp.push(sdate[d]+":"+(i).toString());
    temp.push(0);
    temp.push(0);
      temp.push(0);
    temp.push(0);
  }
final.push(temp);

  


}

}

//console.log(JSON.stringify(final));
res.send(JSON.stringify(final));


},
marginal:async function(req,res){
res.view('trends/marginalcost');
}

};

