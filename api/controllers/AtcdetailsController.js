/**
 * AtcdetailsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  getATCIR:async function(req,res)
{

let fromdate = req.allParams()['fromdate'] 
let todate = req.allParams()['todate']
let region = req.allParams()['region']

let regionmap= {'NR':'3','WR':'5','SR':'4','ER':'1','NER':'2'}

let month_names =["Jan","Feb","Mar",
                      "Apr","May","Jun",
                      "Jul","Aug","Sep",
                      "Oct","Nov","Dec"];


fromdate = fromdate.split("-").reverse().join("-")
todate = todate.split("-").reverse().join("-")

let dates=[]

 for (let dt =new Date(fromdate); dt <=new Date(todate); dt.setDate(dt.getDate() + 1)) {
      //console.log(dt)
      dates.push((dt.toISOString()).split("T")[0].split("-").reverse().join("-"));

    }


let flag=0

let curr_date=new Date();
         curr_date.setHours(curr_date.getHours()+5);
        curr_date.setMinutes(curr_date.getMinutes()+30);
       curr_date= curr_date.toISOString().slice(0,10);
       curr_date = curr_date.split("-").reverse().join("-")

if(curr_date==dates[dates.length-1]){
  flag=1
}
let ATCIR = await Atcir.find({where:{id:{'<=':  new Date(todate),'>=':  new Date(fromdate) }}}).sort('id DESC');

let SCED =  await Gamspwc.find({where:{'dateString':{'<=':  new Date(todate),'>=':  new Date(fromdate) }}});



let mondate = curr_date.split("-")[0]+"-"+month_names[parseInt(curr_date.split("-")[1])-1]+"-"+curr_date.split("-")[2]

var irJson= await sails.helpers.getIr.with({sdate:mondate});

final={}



for(let d in dates){
final[dates[d]]={}
for(let l in ATCIR){
  if(ATCIR[l]["on_date"]==dates[d]){
final[dates[d]]=ATCIR[l]["data"][region]
  }
}
for(let l in SCED){
  if(SCED[l]['id']==dates[d]+regionmap[region]){
    let sced=[]
    for(let j=0;j<96;j++){
      sced.push(SCED[l]['scedup'][j]-SCED[l]['sceddn'][j])
    }


    final[dates[d]]["SCED"]=sced
  }
   if(SCED[l]['id']==dates[d]+"4014"){
    let talcher=[]
    for(let j=0;j<96;j++){
      talcher.push(SCED[l]['scedup'][j]-SCED[l]['sceddn'][j])
    }


    final[dates[d]]["TALCHER"]=talcher
  }

}


}


atcirdata ={}
let blocks =[]



for(let dateval in final){
  for(let l=1;l<97;l++){
    blocks.push(dateval+":"+l)
  }
  for(let key in final[dateval]){
atcirdata[key]=[]
  }
}



for(let dateval in final){
  for(let key in final[dateval]){
atcirdata[key]= atcirdata[key].concat(final[dateval][key])
  }
}


if(flag==1){
irJson = JSON.parse(irJson)

let end =atcirdata["IMPORT"].length
let start =  end-96

console.log(start)
console.log(end)

  atcirdata["IMPORT"].splice(start,end,...(irJson[region+"_"+"Import"]["ATC"].split(",").map( d=> parseInt(d))))
  atcirdata["EXPORT"].splice(start,end,...(irJson[region+"_"+"Export"]["ATC"].split(",").map( d=> parseInt(d))))
  atcirdata["IMPORT_SCH"].splice(start,end,...(irJson[region+"_"+"Import"]["SCHIR"].split(",").map( d=> parseInt(d))))

}



atcirdata["blocks"] = blocks



res.send(JSON.stringify(atcirdata))

},
  atcTrends:async function(req,res){

var curr_date=new Date();
         curr_date.setHours(curr_date.getHours()+5);
        curr_date.setMinutes(curr_date.getMinutes()+30);
       curr_date= curr_date.toISOString().slice(0,10);
var curr_date1=new Date();
        var hh=curr_date1.getHours();
        var mm=curr_date1.getMinutes();
     curr_date=curr_date.split("-").join("-");

let atcval = await Atcir.find({'id':{'<=':new Date(curr_date)}}).sort('id DESC');

res.send(JSON.stringify(atcval[0]));




  },

  //==================================================================================
  //==============================put ATC=============================================
  putATC:async function(req,res){
 
   var atcnr1=req.allParams()['atcnr'];
   var atcsr1=req.allParams()['atcsr'];
   var atcner1=req.allParams()['atcner'];

    var atcnrE1=req.allParams()['atcnrE'];
   var atcsrE1=req.allParams()['atcsrE'];
   var atcnerE1=req.allParams()['atcnerE'];

 var atcwr1=req.allParams()['atcwr'];

    var atcwrE1=req.allParams()['atcwrE'];
   var atcer1=req.allParams()['atcer'];
   var atcerE1=req.allParams()['atcerE'];


console.log(atcnerE1,atcwrE1,atcnr1,atcer1,atcsr1,atcwr1,atcner1,atcsrE1,atcnrE1,atcerE1)
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

   var data={block:curr_date,atcn:atcnr1,atcs:atcsr1,atcw:atcwr1,atce:atcer1,atcwE:atcwrE1,atceE:atcerE1,atcne:atcner1,atcsE:atcsrE1,atcnE:atcnrE1,atcneE:atcnerE1};

   var atc=await Atcdetails.find({block:curr_date});


   var atcarchive=await Atcarchive.find({id:curr_date});
   var usersr=new Array(96).fill(0);
   var usernr=new Array(96).fill(0);

     var userwr=new Array(96).fill(0);
   var userer=new Array(96).fill(0);

   var userner=new Array(96).fill(0);
 var usersrE=new Array(96).fill(0);
   var usernrE=new Array(96).fill(0);
   var usernerE=new Array(96).fill(0);

     var userwrE=new Array(96).fill(0);
   var usererE=new Array(96).fill(0);


     if(typeof(atcarchive[0])!="undefined"){
    var tempsr=atcarchive[0]['sr'];
    var tempnr=atcarchive[0]['nr'];
    var tempner=atcarchive[0]['ner'];

    var tempsrE=atcarchive[0]['srE'];
    var tempnrE=atcarchive[0]['nrE'];
    var tempnerE=atcarchive[0]['nerE'];

      var tempwr=atcarchive[0]['wr'];
    var temper=atcarchive[0]['er'];

       var tempwrE=atcarchive[0]['wrE'];
    var temperE=atcarchive[0]['erE'];


    tempsr.fill(atcsr1,curr_block-1,95);
    tempnr.fill(atcnr1,curr_block-1,95);
    tempner.fill(atcner1,curr_block-1,95);

       tempsrE.fill(atcsrE1,curr_block-1,95);
    tempnrE.fill(atcnrE1,curr_block-1,95);
    tempnerE.fill(atcnerE1,curr_block-1,95);

     tempwr.fill(atcwr1,curr_block-1,95);
    temper.fill(atcer1,curr_block-1,95);

    tempwrE.fill(atcwrE1,curr_block-1,95);
    temperE.fill(atcerE1,curr_block-1,95);

    var updatearchive=await Atcarchive.update({id:curr_date}).set({'sr':tempsr,'nr':tempnr,'wr':tempwr,'er':temper,'wrE':tempwrE,'erE':temperE,'ner':tempner,'srE':tempsrE,'nrE':tempnrE,'nerE':tempnerE});


     }else{

     usernr.fill(atcnr1,curr_block-1,95);
     userner.fill(atcner1,curr_block-1,95);
     usersr.fill(atcsr1,curr_block-1,95);

      userwr.fill(atcwr1,curr_block-1,95);
     userer.fill(atcer1,curr_block-1,95);

       userwrE.fill(atcwr1,curr_block-1,95);
     usererE.fill(atcer1,curr_block-1,95);

      usernrE.fill(atcnrE1,curr_block-1,95);
     usernerE.fill(atcnerE1,curr_block-1,95);
     usersrE.fill(atcsrE1,curr_block-1,95);

      await Atcarchive.create({id:curr_date,'sr':usersr,'nr':usernr,'ner':userner,'srE':usernrE,'nrE':usernrE,'nerE':usernerE,'wr':userwr,
        'er':userer,'wrE':userwrE,'erE':usererE});

     }


   if(typeof(atc[0])!="undefined"){

     var update=await Atcdetails.update({block:curr_date}).set({atcn:atcnr1,atcs:atcsr1,atcne:atcner1,atcnE:atcnrE1,atcsE:atcsrE1,atcneE:atcnerE1,atcw:atcwr1,
      atce:atcer1,atcwE:atcwrE1,atceE:atcerE1});

   }else{
     await Atcdetails.create(data);

   }

   res.send(JSON.stringify({'label':true}));

  },


  //================================GET ATC=======================================
  //==============================================================================

    getATC:async function(req,res){
 
   var atcnr1=req.allParams()['atcnr'];
   var atcsr1=req.allParams()['atcsr'];
   var atcner1=req.allParams()['atcner'];

//console.log(atcnr1);
var update;
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

   var data={block:curr_date,atcn:atcnr1,atcs:atcsr1,atcne:atcner1};

   var atc=await Atcdetails.find({block:curr_date});

   if(typeof(atc[0])!="undefined"){

      update=await Atcdetails.find({block:curr_date});

   }else{
     update=[{block:curr_date,atcn:'',atcs:'',atcne:'',atcnE:'',atcneE:'',atcsE:'',actw:'',atce:'',atcwE:'',atceE:''}];

   }

   res.send(JSON.stringify(update));

  },

  //==============================================================================
  //=========================ATC IR ==============================================
  atcir:async function(req,res){

var month_names =["Jan","Feb","Mar",
                      "Apr","May","Jun",
                      "Jul","Aug","Sep",
                      "Oct","Nov","Dec"];

    var curr_date=new Date();
         curr_date.setHours(curr_date.getHours()+5);
        curr_date.setMinutes(curr_date.getMinutes()+30);
       curr_date= curr_date.toISOString().slice(0,10);
 var currentDate=new Date();
      currentDate.setDate(currentDate.getDate() + 1);
         currentDate.setHours(currentDate.getHours()+5);
        currentDate.setMinutes(currentDate.getMinutes()+30);
       currentDate= currentDate.toISOString().slice(0,10);

var curr_date1=new Date();
        var hh=curr_date1.getHours();
        var mm=curr_date1.getMinutes();


     curr_date=curr_date.split("-").reverse().join("-");
     currentDate=currentDate.split("-").reverse().join("-");
     var curr_block=Math.ceil(hh*4)+Math.ceil(mm/15.0);
     var predictedBlock=curr_block+2;

     if(curr_block==95){
      predictedBlock=1;
      curr_date=currentDate;
     }

     if(curr_block==96){
      predictedBlock=2;
      curr_date=currentDate;
     }

var mon=parseInt(curr_date.split("-")[1])-1;
//console.log(curr_date);
var vcDate=curr_date.split("-")[0]+"-"+month_names[mon]+"-"+curr_date.split("-")[2];
//console.log(vcDate);
var irJson= await sails.helpers.getIr.with({sdate:vcDate});


res.send(irJson);
  }, 
  atcirDate:async function(req,res){

var month_names =["Jan","Feb","Mar",
                      "Apr","May","Jun",
                      "Jul","Aug","Sep",
                      "Oct","Nov","Dec"];

    var curr_date=new Date();
         curr_date.setHours(curr_date.getHours()+5);
        curr_date.setMinutes(curr_date.getMinutes()+30);
       curr_date= curr_date.toISOString().slice(0,10);
 var currentDate=new Date();
      currentDate.setDate(currentDate.getDate() + 1);
         currentDate.setHours(currentDate.getHours()+5);
        currentDate.setMinutes(currentDate.getMinutes()+30);
       currentDate= currentDate.toISOString().slice(0,10);

var curr_date1=new Date();
        var hh=curr_date1.getHours();
        var mm=curr_date1.getMinutes();


     curr_date=curr_date.split("-").reverse().join("-");
     currentDate=currentDate.split("-").reverse().join("-");
     var curr_block=Math.ceil(hh*4)+Math.ceil(mm/15.0);
     var predictedBlock=curr_block+2;

     if(curr_block==95){
      predictedBlock=1;
      curr_date=currentDate;
     }

     if(curr_block==96){
      predictedBlock=2;
      curr_date=currentDate;
     }
 curr_date=req.allParams()['date'];
var mon=parseInt(curr_date.split("-")[1])-1;
//console.log(curr_date);
var vcDate=curr_date.split("-")[0]+"-"+month_names[mon]+"-"+curr_date.split("-")[2];
//console.log(vcDate);
var irJson= await sails.helpers.getIr.with({sdate:vcDate});

//var useratc = await Atcarchive.find({id:curr_date});



res.send(irJson);
  },
  userAtcTrend:async function(req,res){

var curr_date=req.allParams()['date'];
var useratc = await Atcarchive.find({id:curr_date});


var usersr=new Array(96).fill(0);
   var usernr=new Array(96).fill(0);
   var userner=new Array(96).fill(0);

var usersrE=new Array(96).fill(0);
   var usernrE=new Array(96).fill(0);
   var usernerE=new Array(96).fill(0);


var data={};

if(useratc[0]!=undefined){

  for(let i=0;i<96;i++){

if(useratc[0]['sr'][i]==""){
  usersr[i]=0;
}else{
  usersr[i]=parseInt(useratc[0]['sr'][i]);
}


if(useratc[0]['srE'][i]==""){
  usersrE[i]=0;
}else{
  usersrE[i]=parseInt(useratc[0]['srE'][i]);
}



if(useratc[0]['nr'][i]==""){
  usernr[i]=0;
}else{
  usernr[i]=parseInt(useratc[0]['nr'][i]);
}


if(useratc[0]['nrE'][i]==""){
  usernrE[i]=0;
}else{
  usernrE[i]=parseInt(useratc[0]['nrE'][i]);
}





if(useratc[0]['ner'][i]==""){
  userner[i]=0;
}else{
  userner[i]=parseInt(useratc[0]['ner'][i]);
}

if(useratc[0]['nerE'][i]==""){
  usernerE[i]=0;
}else{
  usernerE[i]=parseInt(useratc[0]['nerE'][i]);
}




  }

data['sr']=usersr;
data['nr']=usernr;
data['ner']=userner;

data['srE']=usersrE;
data['nrE']=usernrE;
data['nerE']=usernerE;


}else{

data['sr']=usersr;
data['nr']=usernr;
data['ner']=userner;

data['srE']=usersrE;
data['nrE']=usernrE;
data['nerE']=usernerE;

}


res.send(JSON.stringify(data));

  },

  sendMessage:async function(req,res){
var es=req.allParams()['es'];
var ws=req.allParams()['ws'];
var nr=req.allParams()['nr'];
var ne=req.allParams()['ne'];
      var numbers="8423573511,9560665333,9910059972,9899091115,9873918443,8527077022,8527908282,8376969176,9971300869,9971117022";

      var msg="";
        const request= require('request');
        var url="http://www.smscountry.com:81/SMSCwebservice.asp?User=posoconldc&passwd=posoco@123&mobilenumber="+numbers+"&message=Date/Time: "+msg+" Regards NLDC, POSOCO";

      if(es==0){
        msg="ALERT!!!! ER SR ATC is Filled Zero";
        url="http://www.smscountry.com:81/SMSCwebservice.asp?User=posoconldc&passwd=posoco@123&mobilenumber="+numbers+"&message=Date/Time: "+msg+" Regards NLDC, POSOCO";
        request(url,function(error,response,body){
  if(!error && response.statusCode==200)
 { console.log(body);}
});

      }else if(ws==0){
        msg="ALERT!!!! WR SR ATC is Filled Zero";
        url="http://www.smscountry.com:81/SMSCwebservice.asp?User=posoconldc&passwd=posoco@123&mobilenumber="+numbers+"&message=Date/Time: "+msg+" Regards NLDC, POSOCO";
        request(url,function(error,response,body){
  if(!error && response.statusCode==200)
 { console.log(body);}
});

      }else if(ne==0){
        msg="ALERT!!!! NER ER ATC is Filled Zero";
        url="http://www.smscountry.com:81/SMSCwebservice.asp?User=posoconldc&passwd=posoco@123&mobilenumber="+numbers+"&message=Date/Time: "+msg+" Regards NLDC, POSOCO";
        request(url,function(error,response,body){
  if(!error && response.statusCode==200)
 { console.log(body);}
});

      }else if(nr==0){
        msg="ALERT!!!! WR NR ATC is Filled Zero";
        url="http://www.smscountry.com:81/SMSCwebservice.asp?User=posoconldc&passwd=posoco@123&mobilenumber="+numbers+"&message=Date/Time: "+msg+" Regards NLDC, POSOCO";
        request(url,function(error,response,body){
  if(!error && response.statusCode==200)
 { console.log(body);}
});

      }else{
        console.log("NO ERROR");
      }

    



res.send(JSON.stringify({label:true}));
  },
  irtrend:async function(req,res){
    res.view('trends/irtrend');
  }

};

