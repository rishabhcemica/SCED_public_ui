/**
 * GamsoptController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  getAll:async function(req,res){

  	var curr_date=new Date();
         curr_date.setHours(curr_date.getHours()+5);
        curr_date.setMinutes(curr_date.getMinutes()+30);
       curr_date= curr_date.toISOString().slice(0,10);
var curr_date1=new Date();
        var hh=curr_date1.getHours();
        var mm=curr_date1.getMinutes();
     curr_date=curr_date.split("-").reverse().join("-");
     var curr_block=Math.ceil(hh*4)+Math.ceil(mm/15.0);

      var on_date=curr_date+":"+curr_block;
     // console.log(on_date);
  	var gamsdata=await Gamsopt.find({on_date:on_date});
    var mc=await MarginalCost.find({on_date:on_date});
    var rates=await GenRates.find({});
    var gen=await Gen.find();
    //console.log(mc);
    var optimized={'gen':gen,'mc':mc,'rates':rates,'gamsdata':gamsdata};
  	res.send(JSON.stringify(optimized));
  },
  accountView:async function(req,res){
    res.view('account/scedaccount');
  },
  accountCost:async function(req,res){
    var dates=req.allParams()['dates'];

    var curr_date=new Date();
         curr_date.setHours(curr_date.getHours()+5);
        curr_date.setMinutes(curr_date.getMinutes()+30);
       curr_date= curr_date.toISOString().slice(0,10);
var curr_date1=new Date();
        var hh=curr_date1.getHours();
        var mm=curr_date1.getMinutes();
     curr_date=curr_date.split("-").reverse().join("-");
     var curr_block=Math.ceil(hh*4)+Math.ceil(mm/15.0);

    //console.log(dates);
    var gens=await Gen.find({});
     var cdate=[];
    for(var i=0;i<dates.length;i++){
      cdate.push({'date':dates[i],'data':[]});
     for(var g=0; g<gens.length;g++){
             var gsumup=0;
             var gsumdown=0;
    var gendata=await Gamspwc.find({'id':dates[i]+gens[g]['id']});
    //console.log(gendata[0]['sceddn'].length);
  for(var k=0;k<96;k++){
    var osch=0;
    var psch=0;
    
    //console.log(gendata[0]['sceddn'][k]);
if(typeof(gendata[0])!="undefined")
{    
  
  try {
    osch=parseFloat(gendata[0]['scedup'][k]);
    psch=parseFloat(gendata[0]['sceddn'][k]);
  } catch (error) {
    osch=0;
    psch=0;
  }
  
}else{

  osch=0;
  psch=0;
}

    
    try {
      if(typeof(gendata[0])!="undefined" && typeof(gendata[0]['scedup'][k])=="undefined"){
        osch=0;
  
      }
      if(typeof(gendata[0])!="undefined" && typeof(gendata[0]['sceddn'][k])=="undefined"){
        psch=0;
   }
    } catch (error) {
      psch=0;
      osch=0;
    }
     
  
      gsumup+=osch;
 
      gsumdown+=psch;
 

  }

     cdate[i]['data'].push({'genid':gens[g]['id']});

     cdate[i]['data'][g]['scedup']=gsumup;
     cdate[i]['data'][g]['sceddn']=gsumdown;

      }
        // console.log(cdate[i]);
    }


    res.send(JSON.stringify(cdate));

  },

  accountCostDate:async function(req,res){
    var dates=req.allParams()['dates'];
    var sgen=req.allParams()['selectedGen'];
    var curr_date=new Date();
         curr_date.setHours(curr_date.getHours()+5);
        curr_date.setMinutes(curr_date.getMinutes()+30);
       curr_date= curr_date.toISOString().slice(0,10);
var curr_date1=new Date();
        var hh=curr_date1.getHours();
        var mm=curr_date1.getMinutes();
     curr_date=curr_date.split("-").reverse().join("-");
     var curr_block=Math.ceil(hh*4)+Math.ceil(mm/15.0);

    //console.log(dates);
    var gens=await Gen.find({});
     var cdate=[];
   
      cdate.push({'date':dates,'data':[]});
     
             var gsumup=0;
             var gsumdown=0;
    if(sgen=="ALL"){



 // for(var i=0;i<)
 var gendata=await Gamspwc.find({'id':dates+sgen});
    //console.log(gendata[0]['sceddn'].length);
  for(var k=0;k<96;k++){
    var osch=0;
    var psch=0;
    
    //console.log(gendata[0]['sceddn'][k]);

    osch=parseFloat(gendata[0]['scedup'][k]);
    psch=parseFloat(gendata[0]['sceddn'][k]);


     if(typeof(gendata[0]['scedup'][k])=="undefined"){
      osch=0;

    }
      if(typeof(gendata[0]['sceddn'][k])=="undefined"){
         psch=0;
    }
    cdate[0]['data'].push({'scedup':osch});
     //cdate[i]['data']['scedup']=gsumup;
     cdate[0]['data'][k]['sceddn']=psch;

     
 

  }


    }

    else{
    var gendata=await Gamspwc.find({'id':dates+sgen});
    //console.log(gendata[0]['sceddn'].length);
  for(var k=0;k<96;k++){
    var osch=0;
    var psch=0;
    
    //console.log(gendata[0]['sceddn'][k]);

    osch=parseFloat(gendata[0]['scedup'][k]);
    psch=parseFloat(gendata[0]['sceddn'][k]);


     if(typeof(gendata[0]['scedup'][k])=="undefined"){
      osch=0;

    }
      if(typeof(gendata[0]['sceddn'][k])=="undefined"){
         psch=0;
    }
    cdate[0]['data'].push({'scedup':osch});
     //cdate[i]['data']['scedup']=gsumup;
     cdate[0]['data'][k]['sceddn']=psch;

     
 

  }
}
   

 
        // console.log(cdate[i]);
    


    res.send(JSON.stringify(cdate));

  },
  accountCostDateAll:async function(req,res){
    var dates=req.allParams()['dates'];
    var sgen=req.allParams()['selectedGen'];
    var curr_date=new Date();
         curr_date.setHours(curr_date.getHours()+5);
        curr_date.setMinutes(curr_date.getMinutes()+30);
       curr_date= curr_date.toISOString().slice(0,10);
var curr_date1=new Date();
        var hh=curr_date1.getHours();
        var mm=curr_date1.getMinutes();
     curr_date=curr_date.split("-").reverse().join("-");
     var curr_block=Math.ceil(hh*4)+Math.ceil(mm/15.0);

    //console.log(dates);
    var gens=await Gen.find({});
     var cdate=[];
   
      cdate.push({'date':dates,'data':{}});
     
             var gsumup=0;
             var gsumdown=0;
     var gens=await Gen.find({});
     for(var g=0;g<gens.length;g++)
{
     cdate[0]['data'][gens[g]['id']]=[];
    var gendata=await Gamspwc.find({'id':dates+gens[g]['id']});
    //console.log(gendata[0]['sceddn'].length);

  for(var k=0;k<96;k++){
    var osch=0;
    var psch=0;
    
    //console.log(gendata[0]['sceddn'][k]);

    osch=parseFloat(gendata[0]['scedup'][k]);
    psch=parseFloat(gendata[0]['sceddn'][k]);


     if(typeof(gendata[0]['scedup'][k])=="undefined"){
      osch=0;

    }
      if(typeof(gendata[0]['sceddn'][k])=="undefined"){
         psch=0;
    }
   
    cdate[0]['data'][gens[g]['id']].push({'scedup':osch});
     //cdate[i]['data']['scedup']=gsumup;
     cdate[0]['data'][gens[g]['id']][k]['sceddn']=psch;

     
 

  }

}

   

 
        // console.log(cdate[i]);
    


    res.send(JSON.stringify(cdate));

  },


  saving:async function(req,res){
  res.view('trends/savings');
}

};

