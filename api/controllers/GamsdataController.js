/**
 * GamsdataController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

getScheduleData:async function(req,res)
{

	var sdate=req.allParams()['dates'];
	var finalData=[];

	for(var d=0; d < sdate.length;d++)
	{
		var savdata = await Gamspwc.find({id:{'contains':sdate[d]}});
		//console.log(savdata);
		
       
		finalData.push(savdata);
	}

	//console.log(finalData);
	res.send(finalData);
		
},

getTodaySaving:async function(req,res){

var month_names =["Jan","Feb","Mar",
                      "Apr","May","Jun",
                      "Jul","Aug","Sep",
                      "Oct","Nov","Dec"];


var sdate=req.allParams()['selectedDate'];
var sgen=req.allParams()['selectedGen'];
var flag=req.allParams()['flag'];

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
     console.log(vcDate);
     var vcDatef=sdate[sdate.length-1].split("-")[0]+"-"+month_names[mon1]+"-"+sdate[sdate.length-1].split("-")[2];
      var vcJson= await sails.helpers.getVc.with({sdate:vcDates,edate:vcDatef});
      //console.log(typeof(vcJson));
      vcJson=JSON.parse(vcJson);
     // console.log(typeof(vcJson));
var final=[];
var final1=[];
var final2=[];
var tt=[];
tt.push("Generator");
tt.push("Savings");
final.push(tt);

var tt1=[];
var tt2=[];

tt1.push("generator");
tt1.push("up cost");
tt1.push("down coast");


tt2.push("generator");
tt2.push("optimal cost");
tt2.push("present cost");

final1.push(tt1);
final2.push(tt2);



if(curr_date!=sdate){
	curr_block=96;
}
if(sgen!='ALL' && sgen!='NR' && sgen!='ER' && sgen!='SR' && sgen!='AR' && sgen!='WR'){

for(var d=0;d<sdate.length;d++)
{
    var mon2=parseInt(sdate[d].split("-")[1])-1;
	var vcDate=sdate[d].split("-")[0]+"-"+month_names[mon2]+"-"+sdate[d].split("-")[2];
       if(curr_date!=sdate[d]){
	curr_block=96;
}else{
	curr_block=curr_block_dummy;
}

var gdata = await Gamspwc.find({where:{id:sdate[d]+sgen}});

	for(var i=1;i<=curr_block;i++){




	
	var grates = vcJson;
	var temp=[];
	var temp1=[];
	var temp2=[];
	//console.log(gdata);
	if(typeof(gdata[0])!="undefined" && typeof(gdata[0]['sch'])!="undefined" && typeof(gdata[0]['optimal'])!="undefined")
{	temp.push(sdate[d]+":"+(i).toString());
	temp1.push(sdate[d]+":"+(i).toString());
	temp2.push(sdate[d]+":"+(i).toString());
	var saving=(parseFloat(gdata[0]['optimal'][i-1])-parseFloat(gdata[0]['sch'][i-1]))*grates[vcDate][sgen]/10000;
	temp.push(saving);
	temp2.push((parseFloat(gdata[0]['sch'][i-1])+parseFloat(gdata[0]['scedup'][i-1])-parseFloat(gdata[0]['sceddn'][i-1]))*grates[vcDate][sgen]/10000);
	temp2.push(parseFloat(gdata[0]['sch'][i-1])*grates[vcDate][sgen]/10000);
    if(saving>=0){

        temp1.push(parseFloat(gdata[0]['scedup'][i-1])*grates[vcDate][sgen]/10000);
        temp1.push(0);
    }else{
    	temp1.push(0);
 temp1.push(parseFloat(gdata[0]['sceddn'][i-1])*grates[vcDate][sgen]/10000);
        
    }   
    

}else{
		temp.push(sdate[d]+":"+(i).toString());
		temp.push(0);

temp1.push(sdate[d]+":"+(i).toString());
		temp1.push(0);
		temp1.push(0);

		temp2.push(sdate[d]+":"+(i).toString());
		temp2.push(0);
		temp2.push(0);
	
	}


final.push(temp);
final1.push(temp1);
final2.push(temp2);
}

}

}else if(sgen=='ALL'){


    

for(var d=0;d<sdate.length;d++)
{	
  var globalData=[];
var mon2=parseInt(sdate[d].split("-")[1])-1;
	var vcDate=sdate[d].split("-")[0]+"-"+month_names[mon2]+"-"+sdate[d].split("-")[2];

	       if(curr_date!=sdate[d]){
	curr_block=96;
}else{
	curr_block=curr_block_dummy;
}
var savdata = await Gamspwc.find({id:{'contains':sdate[d]}});

	for(var i=1;i<=curr_block;i++){

	var temp=[];
	var temp1=[];
	var temp2=[];
	//console.log(gdata);
	var gens= await Gen.find({});
	var sopt=0;
	var sch=0;
	var sup=0;
	var sdn=0;
	var temp=[];
	for(var j=0;j<gens.length;j++)
{	
            if(i==1)
		{	var gdata =[];
			for(var l=0;l<savdata.length;l++)
			{
             if(savdata[l]['id']==sdate[d]+gens[j]['id']){
             	gdata.push(savdata[l]);
             	break;
             }
			}

				globalData.push(gdata[0]);
}
        	var grates = vcJson;
        	//console.log('vcJson is: ',vcJson,'vcdate is',vcDate);
	if(typeof(globalData[j])!="undefined" && typeof(globalData[j]['sch'])!="undefined" && typeof(globalData[j]['optimal'])!="undefined")
{	
	//console.log('global data is',globalData)
	if(grates[vcDate][gens[j]['id']] == undefined ){
		grates[vcDate][gens[j]['id']] = 0
	}
	sch+=parseFloat(globalData[j]['sch'][i-1])*parseFloat(grates[vcDate][gens[j]['id']])/10000;
	sopt+=(parseFloat(globalData[j]['sch'][i-1])+parseFloat(globalData[j]['scedup'][i-1])-parseFloat(globalData[j]['sceddn'][i-1]))*grates[vcDate][gens[j]['id']]/10000;
	sup+=parseFloat(globalData[j]['scedup'][i-1])*parseFloat(grates[vcDate][gens[j]['id']])/10000;
	sdn+=parseFloat(globalData[j]['sceddn'][i-1])*parseFloat(grates[vcDate][gens[j]['id']])/10000;

}

	else{
		sch+=0;
		sopt+=0;
		sup+=0;
		sdn+=0;
	}


}
//console.log('sup , sdn',sup,sdn);
temp.push(sdate[d]+":"+(i).toString());
temp1.push(sdate[d]+":"+(i).toString());
temp2.push(sdate[d]+":"+(i).toString());
temp.push(sup-sdn);
temp2.push(sopt);
temp2.push(sch);

if(sup-sdn>=0){
	temp1.push(sup-sdn);
	temp1.push(0);

}else{

	temp1.push(0);
temp1.push(sdn-sup);
}



final.push(temp);
final1.push(temp1);
final2.push(temp2);
	
}


}



}else{
	var r='';
	if(sgen=='NR'){
     r='3';
	}else if(sgen=='ER'){
		r='1';
	}else if(sgen=='AR'){
		r='2';
	}else if(sgen=='SR'){
		r='4'
	}else{
		r='5';
	}
for(var d=0;d<sdate.length;d++)
{	

  var globalData=[];
var mon2=parseInt(sdate[d].split("-")[1])-1;
	var vcDate=sdate[d].split("-")[0]+"-"+month_names[mon2]+"-"+sdate[d].split("-")[2];

	       if(curr_date!=sdate[d]){
	curr_block=96;
}else{
	curr_block=curr_block_dummy;
}

var savdata = await Gamspwc.find({id:{'contains':sdate[d]}});

	for(var i=1;i<=curr_block;i++){

	var temp=[];
	var temp1=[];
	var temp2=[];
	//console.log(gdata);
	var gens= await Gen.find({});
	var sopt=0;
	var sch=0;
	var sup=0;
	var sdn=0;
	var temp=[];
	for(var j=0;j<gens.length;j++)
{	

        if(gens[j]['id'][0]==r)
{var grates=vcJson;
var gdata=[];
//	if(i==1){

   for(var l=0;l<savdata.length;l++){

   	if(savdata[l]['id']==sdate[d]+gens[j]['id']){
          gdata.push(savdata[l]);
          break;
   	}

   }

	//}

	 	//var grates = await GenRates.find({where:{id:gens[j]['id']}});
	 	//var gdata = await Gamspwc.find({where:{id:sdate+gens[j]['id']}});
	if(typeof(gdata[0])!="undefined" && typeof(gdata[0]['sch'])!="undefined" && typeof(gdata[0]['optimal'])!="undefined")
{	

	
	sch+=parseFloat(gdata[0]['sch'][i-1])*grates[vcDate][gens[j]['id']]/10000;
	sopt+=(parseFloat(gdata[0]['sch'][i-1])+parseFloat(gdata[0]['scedup'][i-1])-parseFloat(gdata[0]['sceddn'][i-1]))*grates[vcDate][gens[j]['id']]/10000;
	sup+=parseFloat(gdata[0]['scedup'][i-1])*grates[vcDate][gens[j]['id']]/10000;
	sdn+=parseFloat(gdata[0]['sceddn'][i-1])*grates[vcDate][gens[j]['id']]/10000;

}

	else{
		sch+=0;
		sopt+=0;
		sup+=0;
		sdn+=0;
	}

}


}
temp.push(sdate[d]+":"+(i).toString());
temp1.push(sdate[d]+":"+(i).toString());
temp2.push(sdate[d]+":"+(i).toString());
temp2.push(sopt);
temp2.push(sch);
//temp.push(sch);
if(sup-sdn>=0){
	temp1.push(sup);
	temp1.push(0);

}else{

	temp1.push(0);
temp1.push(sdn);
}
temp.push(sup-sdn);

final.push(temp);
final1.push(temp1);
final2.push(temp2);
}

}


}
//console.log(JSON.stringify(final));
if(flag==0)
{res.send(JSON.stringify(final));}
else if(flag==1){
	res.send(JSON.stringify(final1));
}else{
	res.send(JSON.stringify(final2));
}


},  
getTodayData:async function(req,res){

var month_names =["Jan","Feb","Mar",
                      "Apr","May","Jun",
                      "Jul","Aug","Sep",
                      "Oct","Nov","Dec"];

var sdate=req.allParams()['selectedDate'];
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


var mon=parseInt(sdate.split("-")[1])-1;

      var vcDate=sdate.split("-")[0]+"-"+month_names[mon]+"-"+sdate.split("-")[2];
      //console.log(vcDate);
      var pminJson= await sails.helpers.getPmin.with({sdate:vcDate});
      var rampjson=await sails.helpers.getRamp.with({sdate:vcDate});
      //console.log(typeof(vcJson));
      //console.log(pminJson);
      pminJson=JSON.parse(pminJson);
      rampjson=JSON.parse(rampjson);
      //console.log(typeof(vcJson));
      
var final=[];
var tt=[];

tt.push("Generator");
tt.push("Schedule");
tt.push("Optimal Schedule ");
tt.push("Pmax");
tt.push("Pmin");
tt.push("UP Reserve");
tt.push("DOWN Reserve");

final.push(tt);
if(curr_date!=sdate){
	curr_block=96;
}
if(sgen!='ALL' && sgen!='NR' && sgen!='ER' && sgen!='SR' && sgen!='AR' && sgen!='WR'){
for(var i=1;i<=curr_block;i++){
	var on_date;
	if(i!=0)
	 on_date=sdate+":"+(i).toString();

    else
    	 on_date=sdate+":"+(i).toString();
   // console.log(on_date);
	var gdata = await Gamspwc.find({where:{id:sdate+sgen}});
	var dc=await Gamsopt.find({where:{on_date:on_date}});
	var temp=[];
	//console.log(gdata);
	if( typeof(gdata[0])!="undefined" && typeof(dc[0])!="undefined" && typeof(dc[0][sgen])!="undefined" && typeof(gdata[0]['sch'])!="undefined" && typeof(gdata[0]['optimal'])!="undefined")
{	temp.push(on_date);
	temp.push(parseFloat(gdata[0]['sch'][i-1]));
	temp.push(parseFloat(gdata[0]['sch'][i-1])+parseFloat(gdata[0]['scedup'][i-1])-parseFloat(gdata[0]['sceddn'][i-1]));
	temp.push(parseFloat(dc[0][sgen]['DC on bar']));
    temp.push(Math.min(Math.max(parseFloat(pminJson[sgen]['NORMBAR'].split(",")[i-1])*0.55,parseFloat(pminJson[sgen]['TM'].split(",")[i-1])),parseFloat(gdata[0]['sch'][i-1])));
	temp.push(Math.min(parseFloat(dc[0][sgen]['DC on bar'])-parseFloat(gdata[0]['optimal'][i-1]),parseFloat(rampjson[sgen]["RUP"].split(",")[i-1])));
	temp.push(-1*Math.max(parseFloat(rampjson[sgen]["RDN"].split(",")[i-1]),Math.min(Math.max(parseFloat(pminJson[sgen]['NORMBAR'].split(",")[i-1])*0.55,parseFloat(pminJson[sgen]['TM'].split(",")[i-1])),parseFloat(gdata[0]['optimal'][i-1]))-parseFloat(gdata[0]['optimal'][i-1])));

	//temp.push(parseFloat(dc[0][sgen]['DC on bar'])*0.55);
}else{
		temp.push(on_date);
		temp.push(0);
		temp.push(0);
		temp.push(0);
		temp.push(0);
		temp.push(0);
		temp.push(0);
	}


final.push(temp);
	
}
// final[1][1]=final[3][1];
// final[1][2]=final[3][2];

// final[2][1]=final[3][1];
// final[2][2]=final[3][2];

}else if(sgen=='ALL'){
	var globalData=[];
	for(var i=1;i<=curr_block;i++){
	var on_date;
	if(i!=0)
	 on_date=sdate+":"+(i).toString();
    else
    	 on_date=sdate+":"+(i).toString();
   // console.log(on_date);
	
	var temp=[];
	//console.log(gdata);
	var gens= await Gen.find({});
	var sopt=0;
	var sch=0;
	var pmax=0;
	var pmin=0;
	var rup=0;
	var rdn=0;
	var temp=[];
	var dc=await Gamsopt.find({where:{on_date:on_date}});
	for(var j=0;j<gens.length;j++)
{	
//console.log(JSON.stringify(gdata[0]));
if(i==1)
{
	var gdata = await Gamspwc.find({where:{id:sdate+gens[j]['id']}});
     globalData.push(gdata[0]);
}
//if(j==0)
	//console.log(JSON.stringify(gdata));

	if(typeof(globalData[j])!="undefined" &&  typeof(dc[0])!="undefined" && typeof(dc[0][gens[j]['id']])!="undefined"  && typeof(globalData[j]['sch'])!="undefined" && typeof(globalData[j]['optimal'])!="undefined")
{	

	
	sch+=parseFloat(globalData[j]['sch'][i-1]);
	sopt+=parseFloat(globalData[j]['sch'][i-1])+parseFloat(globalData[j]['scedup'][i-1])-parseFloat(globalData[j]['sceddn'][i-1]);
    pmax+=parseFloat(dc[0][gens[j]['id']]['DC on bar']);
     try{
    	 pmin+=Math.min(Math.max(parseFloat(pminJson[gens[j]['id']]['NORMBAR'].split(",")[i-1])*0.55,parseFloat(pminJson[gens[j]['id']]['TM'].split(",")[i-1])),parseFloat(globalData[j]['sch'][i-1]));
    		rup+=Math.min(parseFloat(rampjson[gens[j]['id']]['RUP'].split(",")[i-1]), parseFloat(dc[0][gens[j]['id']]['DC on bar'])-parseFloat(globalData[j]['optimal'][i-1]));
    rdn+=Math.max(-1*parseFloat(rampjson[gens[j]['id']]['RDN'].split(",")[i-1]),Math.min(Math.max(parseFloat(pminJson[gens[j]['id']]['NORMBAR'].split(",")[i-1])*0.55,parseFloat(pminJson[gens[j]['id']]['TM'].split(",")[i-1])),parseFloat(globalData[j]['optimal'][i-1]))-parseFloat(globalData[j]['optimal'][i-1]));

    }catch(error){
    	pmin+=0
    	rup+=0
    	rdn+=0
    }
}

	else{
		sch+=0;
		sopt+=0;
		pmax+=0;
		pmin+=0;
		rup+=0;
		rdn+=0;
	}


}
temp.push(on_date);
temp.push(sch);
temp.push(sopt);
temp.push(pmax);
temp.push(pmin);
temp.push(rup);
temp.push(rdn);

final.push(temp);
	
}

}else{
	var r='';
	if(sgen=='NR'){
     r='3';
	}else if(sgen=='ER'){
		r='1';
	}else if(sgen=='AR'){
		r='2';
	}else if(sgen=='SR'){
		r='4'
	}else{
		r='5';
	}

	var globalData=[];

	for(var i=1;i<=curr_block;i++){
	var on_date;
	if(i!=0)
	 on_date=sdate+":"+(i).toString();
    else
    	 on_date=sdate+":"+(i).toString();
   // console.log(on_date);
	
	var temp=[];
	//console.log(gdata);
	var gens= await Gen.find({});
	var sopt=0;
	var sch=0;
	var pmax=0;
	var pmin=0;
	var rup=0;
	var rdn=0;
	var temp=[];
	var dc=await Gamsopt.find({where:{on_date:on_date}});
	for(var j=0;j<gens.length;j++)
{	
	if(i==1)
{
	var gdata = await Gamspwc.find({where:{id:sdate+gens[j]['id']}});
	globalData.push(gdata[0]);

}
        if(gens[j]['id'][0]==r)
{	
	if(typeof(globalData[j])!="undefined" &&  typeof(dc[0])!="undefined" &&  typeof(dc[0][gens[j]['id']])!="undefined"  && typeof(globalData[j]['sch'])!="undefined" && typeof(globalData[j]['optimal'])!="undefined")
{	

	
	sch+=parseFloat(globalData[j]['sch'][i-1]);
	sopt+=parseFloat(globalData[j]['sch'][i-1])+parseFloat(globalData[j]['scedup'][i-1])-parseFloat(globalData[j]['sceddn'][i-1]);
	//console.log(sch);
	//console.log(sopt);
    pmax+=parseFloat(dc[0][gens[j]['id']]['DC on bar']);

      try{
    	 pmin+=Math.min(Math.max(parseFloat(pminJson[gens[j]['id']]['NORMBAR'].split(",")[i-1])*0.55,parseFloat(pminJson[gens[j]['id']]['TM'].split(",")[i-1])),parseFloat(globalData[j]['sch'][i-1]));
    		rup+=Math.min(parseFloat(rampjson[gens[j]['id']]['RUP'].split(",")[i-1]), parseFloat(dc[0][gens[j]['id']]['DC on bar'])-parseFloat(globalData[j]['optimal'][i-1]));
    rdn+=Math.max(-1*parseFloat(rampjson[gens[j]['id']]['RDN'].split(",")[i-1]),Math.min(Math.max(parseFloat(pminJson[gens[j]['id']]['NORMBAR'].split(",")[i-1])*0.55,parseFloat(pminJson[gens[j]['id']]['TM'].split(",")[i-1])),parseFloat(globalData[j]['optimal'][i-1]))-parseFloat(globalData[j]['optimal'][i-1]));

    }catch(error){
    	pmin+=0
    	rup+=0
    	rdn+=0
    }
     

}

	else{
		sch+=0;
		sopt+=0;
		pmax+=0;
		pmin+=0;
		rup+=0;
		rdn+=0;
	}
}


}
temp.push(on_date);
temp.push(sch);
temp.push(sopt);
temp.push(pmax);
temp.push(pmin);
temp.push(rup);
temp.push(rdn);

final.push(temp);




}
}
//console.log(JSON.stringify(final));
res.send(JSON.stringify(final));


},
getTodayDataDate:async function(req,res){


var month_names =["Jan","Feb","Mar",
                      "Apr","May","Jun",
                      "Jul","Aug","Sep",
                      "Oct","Nov","Dec"];

 var agcplants=["3011","4011","5029","1009","2011"];

 regmap = {"ALL":"6","NR":"3","WR":"5","SR":"4","ER":"1","AR":"1"}
var sdate=req.allParams()['selectedDate'];
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
     var curr_block1=curr_block;
    // console.log(sgen);
      
var final=[];
var tt=[];
tt.push("Generator");
tt.push("Schedule");
tt.push("Optimal Schedule ");
tt.push("Pmax");
tt.push("Pmin");
tt.push("rup");
tt.push("rdn");

final.push(tt);

///////FECTCHING MASTER TABEL DATA

let todate = sdate[sdate.length-1].split("-").reverse().join("-")
let fromdate = sdate[0].split("-").reverse().join("-")

let master = await Gamspwc.find({where:{'dateString':{'<=':  new Date(todate),'>=':  new Date(fromdate) }}});

// if(sgen!='ALL' && sgen!='NR' && sgen!='ER' && sgen!='SR' && sgen!='AR' && sgen!='WR' && sgen!='ALLAGC'){
// for(var d=0;d<sdate.length;d++)
// {	
// 	if(curr_date!=sdate[d]){
// 	curr_block=96;
// }else{
// 	curr_block=curr_block1;
// }



// var mon1=parseInt(sdate[d].split("-")[1])-1;

//       var vcDate1=sdate[d].split("-")[0]+"-"+month_names[mon1]+"-"+sdate[d].split("-")[2];
//       //console.log(vcDate);
   
//       var rampjson=await sails.helpers.getRamp.with({sdate:vcDate1});
//       //console.log(typeof(vcJson));
     
//       rampjson=JSON.parse(rampjson);


// var dcdata=await Gamsopt.find({on_date:{'contains':sdate[d]}});
// var savdata = await Gamspwc.find({id:{'contains':sdate[d]}});



// for(var i=1;i<=curr_block;i++){
// 	var on_date;
// 	if(i!=0)
// 	 on_date=sdate[d]+":"+(i).toString();
//     else
//     	 on_date=sdate[d]+":"+(i).toString();
//    // console.log(on_date);
// 	var gdata =[];
//  for(var k=0;k<savdata.length;k++){
//  	if(savdata[k]['id']==sdate[d]+sgen){
//          gdata.push(savdata[k]);
//          break;
//  	}
//  }

// 	var dc=[];
// 	for(var l=0;l<dcdata.length;l++){

// if(dcdata[l]['on_date']==on_date){
// 	dc.push(dcdata[l]);
// 	break;
// }
// 	}

// 	var temp=[];
// 	//console.log(gdata);
// 	if( typeof(dc[0])!="undefined" && typeof(dc[0][sgen])!="undefined" && typeof(gdata[0])!="undefined" && typeof(gdata[0]['sch'])!="undefined" && typeof(gdata[0]['optimal'])!="undefined" && typeof(dc[0])!="undefined")
// {	temp.push((i).toString());
// 	temp.push(parseFloat(gdata[0]['sch'][i-1]));
// 	temp.push(parseFloat(gdata[0]['optimal'][i-1]));
// 	temp.push(parseFloat(dc[0][sgen]['DC on bar']));
// 	temp.push(parseFloat(dc[0][sgen]['DC on bar'])*0.55);
// 	temp.push(Math.min((parseFloat(dc[0][sgen]['DC on bar'])-parseFloat(gdata[0]['sch'][i-1])),parseFloat(rampjson[sgen]['RUP'].split(",")[i-1])));
//    temp.push(Math.min((parseFloat(gdata[0]['sch'][i-1]-parseFloat(dc[0][sgen]['DC on bar'])*0.55)),parseFloat(rampjson[sgen]['RDN'].split(",")[i-1])));



// }else{
// 		temp.push((i).toString());
// 		temp.push(0);
// 		temp.push(0);
// 		temp.push(0);
// 		temp.push(0);
// 		temp.push(0);
// 		temp.push(0);
// 	}


// final.push(temp);
	
// }

// }
// // final[1][1]=final[3][1];
// // final[1][2]=final[3][2];

// // final[2][1]=final[3][1];
// // final[2][2]=final[3][2];

// }else if(sgen=='ALL'){

let regions = ["ALL","NR","AR","SR","ER","WR"]

let add = regions.indexOf(sgen) != -1  ? regmap[sgen] : sgen

let strlen = regions.indexOf(sgen) != -1  ? 11 : 10+sgen.length

	for(let i=0;i<master.length;i++){
		if(master[i]['id'].substring(10,strlen)==add && master[i]['id'].length == strlen && sgen!="ALLAGC" ){
			
			for(let j=0;j<96;j++){
				let temp = []
				temp.push(master[i]['id'].substring(0,10)+":"+(j+1).toString())
				temp.push(master[i]['sch'][j])
				temp.push(parseFloat(master[i]['sch'][j])+parseFloat(master[i]['scedup'][j])-parseFloat(master[i]['sceddn'][j]))
				temp.push(parseFloat(master[i]['dconbar'][j]))
				temp.push(parseFloat(master[i]['dconbar'][j])*0.55)
				temp.push(Math.min(parseFloat(master[i]['dconbar'][j])-parseFloat(master[i]['sch'][j]),master[i]['rampup'][j]))
				temp.push(Math.min(parseFloat(master[i]['sch'][j])-parseFloat(master[i]['dconbar'][j])*0.55,master[i]['rampdn'][j]))
				final.push(temp)
			}

		}
	}

	if(sgen == "ALLAGC"){
		for(let d=0;d<sdate.length;d++){
			for(let i=0;i<96;i++){
let temp  = []
temp.push(d+":"+(i+1).toString())
let sch = 0
let sced =0
let dconbar= 0
let tmin =0
let rup=0
let rdn =0
for(let j=0;j<master.length;j++){
	if(agcplants.indexOf(master[j]['id'].substring(10,master[j]['id'].length))!=-1){
sch += parseFloat(master[j]['sch'][i])
sced += parseFloat(master[j]['sch'][i])+parseFloat(master[j]['scedup'][i]) - parseFloat(master[j]['sceddn'][i])
dconbar += parseFloat(master[j]['dconbar'][i])
tmin+= parseFloat(master[j]['dconbar'][i])*0.55
rup += Math.min(parseFloat(master[j]['dconbar'][i])-parseFloat(master[j]['sch'][i]),parseFloat(master[j]['rampup'][i]))
rdn += Math.min(parseFloat(master[j]['sch'][i])-parseFloat(master[j]['dconbar'][i])*0.55,parseFloat(master[j]['rampdn'][i]))
	}
}

temp.push(sch)
temp.push(sced)
temp.push(dconbar)
temp.push(tmin)
temp.push(rup)
temp.push(rdn)
final.push(temp)


			}
		}
	}

//    for(var d=0;d<sdate.length;d++)
// {	

// 	//console.log(curr_date);
// 	if(curr_date!=sdate[d]){
// 	curr_block=96;
// }else{
// curr_block=curr_block1;
// }
// //console.log(curr_block);



// var mon1=parseInt(sdate[d].split("-")[1])-1;

//       var vcDate1=sdate[d].split("-")[0]+"-"+month_names[mon1]+"-"+sdate[d].split("-")[2];
//       //console.log(vcDate);
   
//       var rampjson=await sails.helpers.getRamp.with({sdate:vcDate1});
//       //console.log(typeof(vcJson));
//      //console.log(rampjson);
//       rampjson=JSON.parse(rampjson);





// var dcdata=await Gamsopt.find({on_date:{'contains':sdate[d]}});
// var savdata = await Gamspwc.find({id:{'contains':sdate[d]}});

// var globalData=[];
// 	for(var i=1;i<=curr_block;i++){
// 	var on_date;
// 	if(i!=0)
// 	 on_date=sdate[d]+":"+(i).toString();
//     else
//     	 on_date=sdate[d]+":"+(i).toString();
//    //console.log(on_date);
	
// 	var temp=[];
// 	//console.log(gdata);
// 	var gens= await Gen.find({});
// 	var sopt=0;
// 	var sch=0;
// 	var pmax=0;
// 	var pmin=0;
// 	var temp=[];

// 	var rup=0;
// 	var rdn=0;
	
// 	var dc=[];
//    for(var k=0;k<dcdata.length;k++){
//    		if(dcdata[k]['on_date']==on_date){
//    			dc.push(dcdata[k]);
//    			break;
//    		}
//    }

// 	for(var j=0;j<gens.length;j++)
// {	
// //console.log(JSON.stringify(gdata[0]));
// if(i==1)
// {
// 	//var gdata=[];
// for(var l=0;l<savdata.length;l++){
// 	if(savdata[l]['id']==sdate[d]+gens[j]['id']){
// 		globalData.push(savdata[l]);
// 		break;
// 	}
// }

// }
// //var gdata = await Gamspwc.find({where:{id:sdate[d]+gens[j]['id']}});
	
// 	if(typeof(dc[0])!="undefined" && typeof(dc[0][gens[j]['id']])!="undefined" && typeof(globalData[j])!="undefined"  && typeof(globalData[j]['sch'])!="undefined" && typeof(globalData[j]['optimal'])!="undefined")
// {	

// 	try{
// 	sch+=parseFloat(globalData[j]['sch'][i-1]);
// 	sopt+=parseFloat(globalData[j]['sch'][i-1])+parseFloat(globalData[j]['scedup'][i-1])-parseFloat(globalData[j]['sceddn'][i-1]);
//     pmax+=parseFloat(dc[0][gens[j]['id']]['DC on bar']);
//     pmin+=parseFloat(dc[0][gens[j]['id']]['DC on bar'])*0.55;
//    rup+=Math.min((parseFloat(dc[0][gens[j]['id']]['DC on bar'])-parseFloat(globalData[j]['sch'][i-1])),parseFloat(rampjson[gens[j]['id']]['RUP'].split(",")[i-1]));
//    rdn+=Math.min((parseFloat(globalData[j]['sch'][i-1]-parseFloat(dc[0][gens[j]['id']]['DC on bar'])*0.55)),parseFloat(rampjson[gens[j]['id']]['RDN'].split(",")[i-1]));
// }catch(error){
// 		sch+=0;
// 		sopt+=0;
// 		pmax+=0;
// 		pmin+=0;
// 		rup+=0;
// 		rdn+=0;
// }

// }

// 	else{
// 		sch+=0;
// 		sopt+=0;
// 		pmax+=0;
// 		pmin+=0;
// 		rup+=0;
// 		rdn+=0;
// 	}


// }
// temp.push((i).toString());
// temp.push(sch);
// temp.push(sopt);
// temp.push(pmax);
// temp.push(pmin);
// temp.push(rup);
// temp.push(rdn);

// final.push(temp);
	
// }


// }

//.log(final)

// }
// else if(sgen=='ALLAGC'){

//    for(var d=0;d<sdate.length;d++)
// {	

// 	//console.log(curr_date);
// 	if(curr_date!=sdate[d]){
// 	curr_block=96;
// }else{
// curr_block=curr_block1;
// }
// //console.log(curr_block);



// var mon1=parseInt(sdate[d].split("-")[1])-1;

//       var vcDate1=sdate[d].split("-")[0]+"-"+month_names[mon1]+"-"+sdate[d].split("-")[2];
//       //console.log(vcDate);
   
//       var rampjson=await sails.helpers.getRamp.with({sdate:vcDate1});
//       //console.log(typeof(vcJson));
     
//       rampjson=JSON.parse(rampjson);





// var dcdata=await Gamsopt.find({on_date:{'contains':sdate[d]}});
// var savdata = await Gamspwc.find({id:{'contains':sdate[d]}});
// var globalData=[];
// 	for(var i=1;i<=curr_block;i++){
// 	var on_date;
// 	if(i!=0)
// 	 on_date=sdate[d]+":"+(i).toString();
//     else
//     	 on_date=sdate[d]+":"+(i).toString();
//    //console.log(on_date);
	
// 	var temp=[];
// 	//console.log(gdata);
// 	var gens= await Gen.find({});
// 	var sopt=0;
// 	var sch=0;
// 	var pmax=0;
// 	var pmin=0;
// 	var temp=[];

// 	var rup=0;
// 	var rdn=0;
	
// 	var dc=[];
//    for(var k=0;k<dcdata.length;k++){
//    		if(dcdata[k]['on_date']==on_date){
//    			dc.push(dcdata[k]);
//    			break;
//    		}
//    }

// 	for(var j=0;j<gens.length;j++)
// {	

// 	//console.log(agcplants.indexOf(gens[j]['id']));

//    if(i==1)
// {
// 	//var gdata=[];
// for(var l=0;l<savdata.length;l++){
// 	if(savdata[l]['id']==sdate[d]+gens[j]['id']){
// 		globalData.push(savdata[l]);
// 		break;
// 	}
// }

// }




// 	if(agcplants.indexOf(gens[j]['id']) > -1)

// {
// 	//console.log("agcplant");
// //console.log(JSON.stringify(gdata[0]));

// //var gdata = await Gamspwc.find({where:{id:sdate[d]+gens[j]['id']}});
	
// 	if(typeof(dc[0])!="undefined" && typeof(dc[0][gens[j]['id']])!="undefined" && typeof(globalData[j])!="undefined"  && typeof(globalData[j]['sch'])!="undefined" && typeof(globalData[j]['optimal'])!="undefined")
// {	

	
// 	sch+=parseFloat(globalData[j]['sch'][i-1]);
// 	sopt+=parseFloat(globalData[j]['sch'][i-1])+parseFloat(globalData[j]['scedup'][i-1])-parseFloat(globalData[j]['sceddn'][i-1]);
//     pmax+=parseFloat(dc[0][gens[j]['id']]['DC on bar']);
//     pmin+=parseFloat(dc[0][gens[j]['id']]['DC on bar'])*0.55;
//    rup+=Math.min((parseFloat(dc[0][gens[j]['id']]['DC on bar'])-parseFloat(globalData[j]['sch'][i-1])),parseFloat(rampjson[gens[j]['id']]['RUP'].split(",")[i-1]));
//    rdn+=Math.min((parseFloat(globalData[j]['sch'][i-1]-parseFloat(dc[0][gens[j]['id']]['DC on bar'])*0.55)),parseFloat(rampjson[gens[j]['id']]['RDN'].split(",")[i-1]));

// }

// 	else{
// 		sch+=0;
// 		sopt+=0;
// 		pmax+=0;
// 		pmin+=0;
// 		rup+=0;
// 		rdn+=0;
// 	}

// }


// }
// temp.push((i).toString());
// temp.push(sch);
// temp.push(sopt);
// temp.push(pmax);
// temp.push(pmin);
// temp.push(rup);
// temp.push(rdn);
// //console.log(JSON.stringify(temp));
// final.push(temp);
	
// }


// }

// }
// else{
// 	var r='';
// 	if(sgen=='NR'){
//      r='3';
// 	}else if(sgen=='ER'){
// 		r='1';
// 	}else if(sgen=='AR'){
// 		r='2';
// 	}else if(sgen=='SR'){
// 		r='4'
// 	}else{
// 		r='5';
// 	}


// for(var d=0;d<sdate.length;d++)
// {	
// 	if(curr_date!=sdate[d]){
// 	curr_block=96;
// }else{
// curr_block=curr_block1;
// }



// var mon1=parseInt(sdate[d].split("-")[1])-1;

//       var vcDate1=sdate[d].split("-")[0]+"-"+month_names[mon1]+"-"+sdate[d].split("-")[2];
//       //console.log(vcDate);
   
//       var rampjson=await sails.helpers.getRamp.with({sdate:vcDate1});
//       //console.log(typeof(vcJson));
     
//       rampjson=JSON.parse(rampjson);


// var dcdata=await Gamsopt.find({on_date:{'contains':sdate[d]}});
// var savdata = await Gamspwc.find({id:{'contains':sdate[d]}});

// var globalData=[];
// 	for(var i=1;i<=curr_block;i++){
// 	var on_date;
// 	if(i!=0)
// 	 on_date=sdate[d]+":"+(i).toString();
//     else
//     	 on_date=sdate[d]+":"+(i).toString();
//    // console.log(on_date);
	
// 	var temp=[];
// 	//console.log(gdata);
// 	var gens= await Gen.find({});
// 	var sopt=0;
// 	var sch=0;
// 	var pmax=0;
// 	var pmin=0;
// 	var temp=[];
//      var rup=0;
//      var rdn=0;

// 	var dc=[];
//    for(var k=0;k<dcdata.length;k++){
//    		if(dcdata[k]['on_date']==on_date){
//    			dc.push(dcdata[k]);
//    			break;
//    		}
//    }




// 	for(var j=0;j<gens.length;j++)
// {	
// //var gdata = await Gamspwc.find({where:{id:sdate[d]+gens[j]['id']}});
// if(i==1){

// //var gdata=[];
// for(var l=0;l<savdata.length;l++){
// 	if(savdata[l]['id']==sdate[d]+gens[j]['id']){
// 		globalData.push(savdata[l]);
// 		break;
// 	}
// }


// }
//         if(gens[j]['id'][0]==r)
// {	





// 	if(typeof(globalData[j])!="undefined" && typeof(dc[0])!="undefined"  && typeof(globalData[j]['sch'])!="undefined" && typeof(globalData[j]['optimal'])!="undefined" && typeof(dc[0][gens[j]['id']])!='undefined')
// {	

	
// 	sch+=parseFloat(globalData[j]['sch'][i-1]);
// 	sopt+=parseFloat(globalData[j]['sch'][i-1])+parseFloat(globalData[j]['scedup'][i-1])-parseFloat(globalData[j]['sceddn'][i-1]);
//     pmax+=parseFloat(dc[0][gens[j]['id']]['DC on bar']);
//      pmin+=parseFloat(dc[0][gens[j]['id']]['DC on bar'])*0.55;

//  rup+=Math.min((parseFloat(dc[0][gens[j]['id']]['DC on bar'])-parseFloat(globalData[j]['sch'][i-1])),parseFloat(rampjson[gens[j]['id']]['RUP'].split(",")[i-1]));
//    rdn+=Math.min((parseFloat(globalData[j]['sch'][i-1]-parseFloat(dc[0][gens[j]['id']]['DC on bar'])*0.55)),parseFloat(rampjson[gens[j]['id']]['RDN'].split(",")[i-1]));


// }

// 	else{
// 		sch+=0;
// 		sopt+=0;
// 		pmax+=0;
// 		pmin+=0;
// 		rup+=0;
// 		rdn+=0;
// 	}
// }


// }
// temp.push((i).toString());
// temp.push(sch);
// temp.push(sopt);
// temp.push(pmax);
// temp.push(pmin);
// temp.push(rup);
// temp.push(rdn);



// final.push(temp);




// }

// }
// }
//console.log(JSON.stringify(final));
res.send(JSON.stringify(final));

}
,
getTodayDataDateLoss:async function(req,res){


var month_names =["Jan","Feb","Mar",
                      "Apr","May","Jun",
                      "Jul","Aug","Sep",
                      "Oct","Nov","Dec"];

    var pocloss={'3007':'0.8','3011':'0.8','3012':'0.8','3016':'2.42','3017':'2.42','3018':'2.42','3020':'2.49','3050':'1.36','3022':'1.36','3023':'1.36','3024':'1.36','5012':'1.48','5008':'2.1','5009':'2.1','5011':'1.6','5029':'1.6','5023':'1.1','5031':'1.35','5013':'2.04','5014':'1.73','5015':'1.73','5017':'2.35','5018':'2.35','5019':'2.35','5020':'2.35','5021':'2.35','1009':'0.71','1003':'0.77','1008':'0.77','1004':'1.02','1006':'1.02','1012':'0.65','1011':'1.16','1005':'1.15','4031':'1.21','4015':'1.15','4013':'1.15','4005':'1.15','4006':'1.15','4007':'1.9','4008':'1.15','4009':'1.15','4010':'0.71','4011':'0.77','4014':'2.02','4012':'0.65','2011':'1.72','1016':'0','1015':'0','5038':'0','5036':'0','3055':'0','5039':'0','1017':'0'};
      var nr=0,sr=0,ner=0,er=0,wr=0,all=0;
      for(var key in pocloss){
        if(key[0]=='1')
          er+=parseFloat(pocloss[key]);
        else if(key[0]=='2')
          ner+=parseFloat(pocloss[key]);
        else if(key[0]=='3')
          nr+=parseFloat(pocloss[key]);
        else if(key[0]=='4')
          sr+=parseFloat(pocloss[key]);
        else
          wr+=parseFloat(pocloss[key]);
      }
      all=er+ner+wr+sr+nr;
      pocloss['NR']=nr.toString();
      pocloss['WR']=wr.toString();
      pocloss['AR']=ner.toString();
      pocloss['SR']=sr.toString();
      pocloss['ER']=er.toString();
      pocloss['ALL']=all.toString();




 var agcplants=["3011","4011","5029","1009","2011"];

var sdate=req.allParams()['selectedDate'];
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
     var curr_block1=curr_block;
    // console.log(sgen);
      
var final=[];
var tt=[];
tt.push("Generator");
tt.push("Schedule");
tt.push("Optimal Schedule ");
tt.push("Pmax");
tt.push("Pmin");
tt.push("rup");
tt.push("rdn");
final.push(tt);

if(sgen!='ALL' && sgen!='NR' && sgen!='ER' && sgen!='SR' && sgen!='AR' && sgen!='WR' && sgen!='ALLAGC'){
for(var d=0;d<sdate.length;d++)
{	
	if(curr_date!=sdate[d]){
	curr_block=96;
}else{
	curr_block=curr_block1;
}



var mon1=parseInt(sdate[d].split("-")[1])-1;

      var vcDate1=sdate[d].split("-")[0]+"-"+month_names[mon1]+"-"+sdate[d].split("-")[2];
      //console.log(vcDate);
   
      var rampjson=await sails.helpers.getRamp.with({sdate:vcDate1});
      //console.log(typeof(vcJson));
     
      rampjson=JSON.parse(rampjson);


var dcdata=await Gamsopt.find({on_date:{'contains':sdate[d]}});
var savdata = await Gamspwc.find({id:{'contains':sdate[d]}});



for(var i=1;i<=curr_block;i++){
	var on_date;
	if(i!=0)
	 on_date=sdate[d]+":"+(i).toString();
    else
    	 on_date=sdate[d]+":"+(i).toString();
   // console.log(on_date);
	var gdata =[];
 for(var k=0;k<savdata.length;k++){
 	if(savdata[k]['id']==sdate[d]+sgen){
         gdata.push(savdata[k]);
         break;
 	}
 }

	var dc=[];
	for(var l=0;l<dcdata.length;l++){

if(dcdata[l]['on_date']==on_date){
	dc.push(dcdata[l]);
	break;
}
	}

	var temp=[];
	//console.log(gdata);
	if( typeof(dc[0])!="undefined" && typeof(dc[0][sgen])!="undefined" && typeof(gdata[0])!="undefined" && typeof(gdata[0]['sch'])!="undefined" && typeof(gdata[0]['optimal'])!="undefined" && typeof(dc[0])!="undefined")
{	temp.push((i).toString());
	temp.push(parseFloat(gdata[0]['sch'][i-1])*parseFloat(pocloss[sgen])/100);
	temp.push(parseFloat(gdata[0]['optimal'][i-1])*parseFloat(pocloss[sgen])/100);
	temp.push(parseFloat(dc[0][sgen]['DC on bar']));
	temp.push(parseFloat(dc[0][sgen]['DC on bar'])*0.55);
	temp.push(Math.min((parseFloat(dc[0][sgen]['DC on bar'])-parseFloat(gdata[0]['sch'][i-1])),parseFloat(rampjson[sgen]['RUP'].split(",")[i-1])));
   temp.push(Math.min((parseFloat(gdata[0]['sch'][i-1]-parseFloat(dc[0][sgen]['DC on bar'])*0.55)),parseFloat(rampjson[sgen]['RDN'].split(",")[i-1])));



}else{
		temp.push((i).toString());
		temp.push(0);
		temp.push(0);
		temp.push(0);
		temp.push(0);
		temp.push(0);
		temp.push(0);
	}


final.push(temp);
	
}

}
// final[1][1]=final[3][1];
// final[1][2]=final[3][2];

// final[2][1]=final[3][1];
// final[2][2]=final[3][2];

}else if(sgen=='ALL'){

   for(var d=0;d<sdate.length;d++)
{	

	//console.log(curr_date);
	if(curr_date!=sdate[d]){
	curr_block=96;
}else{
curr_block=curr_block1;
}
//console.log(curr_block);



var mon1=parseInt(sdate[d].split("-")[1])-1;

      var vcDate1=sdate[d].split("-")[0]+"-"+month_names[mon1]+"-"+sdate[d].split("-")[2];
      //console.log(vcDate);
   
      var rampjson=await sails.helpers.getRamp.with({sdate:vcDate1});
      //console.log(typeof(vcJson));
     //console.log(rampjson);
      rampjson=JSON.parse(rampjson);





var dcdata=await Gamsopt.find({on_date:{'contains':sdate[d]}});
var savdata = await Gamspwc.find({id:{'contains':sdate[d]}});
var globalData=[];
	for(var i=1;i<=curr_block;i++){
	var on_date;
	if(i!=0)
	 on_date=sdate[d]+":"+(i).toString();
    else
    	 on_date=sdate[d]+":"+(i).toString();
   //console.log(on_date);
	
	var temp=[];
	//console.log(gdata);
	var gens= await Gen.find({});
	var sopt=0;
	var sch=0;
	var pmax=0;
	var pmin=0;
	var temp=[];

	var rup=0;
	var rdn=0;
	
	var dc=[];
   for(var k=0;k<dcdata.length;k++){
   		if(dcdata[k]['on_date']==on_date){
   			dc.push(dcdata[k]);
   			break;
   		}
   }

	for(var j=0;j<gens.length;j++)
{	
//console.log(JSON.stringify(gdata[0]));
if(i==1)
{
	//var gdata=[];
for(var l=0;l<savdata.length;l++){
	if(savdata[l]['id']==sdate[d]+gens[j]['id']){
		globalData.push(savdata[l]);
		break;
	}
}

}
//var gdata = await Gamspwc.find({where:{id:sdate[d]+gens[j]['id']}});
	
	if(typeof(dc[0])!="undefined" && typeof(dc[0][gens[j]['id']])!="undefined" && typeof(globalData[j])!="undefined"  && typeof(globalData[j]['sch'])!="undefined" && typeof(globalData[j]['optimal'])!="undefined")
{	

	//console.log(JSON.stringify(globalData))
	sch+=parseFloat(globalData[j]['sch'][i-1])*parseFloat(pocloss[gens[j]['id']])/100;
	sopt+=(parseFloat(globalData[j]['sch'][i-1])+parseFloat(globalData[j]['scedup'][i-1])-parseFloat(globalData[j]['sceddn'][i-1]))*parseFloat(pocloss[gens[j]['id']])/100;
    pmax+=parseFloat(dc[0][gens[j]['id']]['DC on bar']);
    pmin+=parseFloat(dc[0][gens[j]['id']]['DC on bar'])*0.55;
   rup+=Math.min((parseFloat(dc[0][gens[j]['id']]['DC on bar'])-parseFloat(globalData[j]['sch'][i-1])),parseFloat(rampjson[gens[j]['id']]['RUP'].split(",")[i-1]));
   rdn+=Math.min((parseFloat(globalData[j]['sch'][i-1]-parseFloat(dc[0][gens[j]['id']]['DC on bar'])*0.55)),parseFloat(rampjson[gens[j]['id']]['RDN'].split(",")[i-1]));

}

	else{
		sch+=0;
		sopt+=0;
		pmax+=0;
		pmin+=0;
		rup+=0;
		rdn+=0;
	}


}
temp.push((i).toString());
temp.push(sch);
temp.push(sopt);
temp.push(pmax);
temp.push(pmin);
temp.push(rup);
temp.push(rdn);

final.push(temp);
	
}


}

}
else if(sgen=='ALLAGC'){

   for(var d=0;d<sdate.length;d++)
{	

	//console.log(curr_date);
	if(curr_date!=sdate[d]){
	curr_block=96;
}else{
curr_block=curr_block1;
}
//console.log(curr_block);



var mon1=parseInt(sdate[d].split("-")[1])-1;

      var vcDate1=sdate[d].split("-")[0]+"-"+month_names[mon1]+"-"+sdate[d].split("-")[2];
      //console.log(vcDate);
   
      var rampjson=await sails.helpers.getRamp.with({sdate:vcDate1});
      //console.log(typeof(vcJson));
     
      rampjson=JSON.parse(rampjson);





var dcdata=await Gamsopt.find({on_date:{'contains':sdate[d]}});
var savdata = await Gamspwc.find({id:{'contains':sdate[d]}});
var globalData=[];
	for(var i=1;i<=curr_block;i++){
	var on_date;
	if(i!=0)
	 on_date=sdate[d]+":"+(i).toString();
    else
    	 on_date=sdate[d]+":"+(i).toString();
   //console.log(on_date);
	
	var temp=[];
	//console.log(gdata);
	var gens= await Gen.find({});
	var sopt=0;
	var sch=0;
	var pmax=0;
	var pmin=0;
	var temp=[];

	var rup=0;
	var rdn=0;
	
	var dc=[];
   for(var k=0;k<dcdata.length;k++){
   		if(dcdata[k]['on_date']==on_date){
   			dc.push(dcdata[k]);
   			break;
   		}
   }

	for(var j=0;j<gens.length;j++)
{	

	//console.log(agcplants.indexOf(gens[j]['id']));

   if(i==1)
{
	//var gdata=[];
for(var l=0;l<savdata.length;l++){
	if(savdata[l]['id']==sdate[d]+gens[j]['id']){
		globalData.push(savdata[l]);
		break;
	}
}

}




	if(agcplants.indexOf(gens[j]['id']) > -1)

{
	//console.log("agcplant");
//console.log(JSON.stringify(gdata[0]));

//var gdata = await Gamspwc.find({where:{id:sdate[d]+gens[j]['id']}});
	
	if(typeof(dc[0])!="undefined" && typeof(dc[0][gens[j]['id']])!="undefined" && typeof(globalData[j])!="undefined"  && typeof(globalData[j]['sch'])!="undefined" && typeof(globalData[j]['optimal'])!="undefined")
{	

	
	sch+=parseFloat(globalData[j]['sch'][i-1]);
	sopt+=parseFloat(globalData[j]['sch'][i-1])+parseFloat(globalData[j]['scedup'][i-1])-parseFloat(globalData[j]['sceddn'][i-1]);
    pmax+=parseFloat(dc[0][gens[j]['id']]['DC on bar']);
    pmin+=parseFloat(dc[0][gens[j]['id']]['DC on bar'])*0.55;
   rup+=Math.min((parseFloat(dc[0][gens[j]['id']]['DC on bar'])-parseFloat(globalData[j]['sch'][i-1])),parseFloat(rampjson[gens[j]['id']]['RUP'].split(",")[i-1]));
   rdn+=Math.min((parseFloat(globalData[j]['sch'][i-1]-parseFloat(dc[0][gens[j]['id']]['DC on bar'])*0.55)),parseFloat(rampjson[gens[j]['id']]['RDN'].split(",")[i-1]));

}

	else{
		sch+=0;
		sopt+=0;
		pmax+=0;
		pmin+=0;
		rup+=0;
		rdn+=0;
	}

}


}
temp.push((i).toString());
temp.push(sch);
temp.push(sopt);
temp.push(pmax);
temp.push(pmin);
temp.push(rup);
temp.push(rdn);
//console.log(JSON.stringify(temp));
final.push(temp);
	
}


}

}
else{
	var r='';
	if(sgen=='NR'){
     r='3';
	}else if(sgen=='ER'){
		r='1';
	}else if(sgen=='AR'){
		r='2';
	}else if(sgen=='SR'){
		r='4'
	}else{
		r='5';
	}


for(var d=0;d<sdate.length;d++)
{	
	if(curr_date!=sdate[d]){
	curr_block=96;
}else{
curr_block=curr_block1;
}



var mon1=parseInt(sdate[d].split("-")[1])-1;

      var vcDate1=sdate[d].split("-")[0]+"-"+month_names[mon1]+"-"+sdate[d].split("-")[2];
      //console.log(vcDate);
   
      var rampjson=await sails.helpers.getRamp.with({sdate:vcDate1});
      //console.log(typeof(vcJson));
     
      rampjson=JSON.parse(rampjson);


var dcdata=await Gamsopt.find({on_date:{'contains':sdate[d]}});
var savdata = await Gamspwc.find({id:{'contains':sdate[d]}});

var globalData=[];
	for(var i=1;i<=curr_block;i++){
	var on_date;
	if(i!=0)
	 on_date=sdate[d]+":"+(i).toString();
    else
    	 on_date=sdate[d]+":"+(i).toString();
   // console.log(on_date);
	
	var temp=[];
	//console.log(gdata);
	var gens= await Gen.find({});
	var sopt=0;
	var sch=0;
	var pmax=0;
	var pmin=0;
	var temp=[];
     var rup=0;
     var rdn=0;

	var dc=[];
   for(var k=0;k<dcdata.length;k++){
   		if(dcdata[k]['on_date']==on_date){
   			dc.push(dcdata[k]);
   			break;
   		}
   }




	for(var j=0;j<gens.length;j++)
{	
//var gdata = await Gamspwc.find({where:{id:sdate[d]+gens[j]['id']}});
if(i==1){

//var gdata=[];
for(var l=0;l<savdata.length;l++){
	if(savdata[l]['id']==sdate[d]+gens[j]['id']){
		globalData.push(savdata[l]);
		break;
	}
}


}
        if(gens[j]['id'][0]==r)
{	





	if(typeof(globalData[j])!="undefined" && typeof(dc[0])!="undefined"  && typeof(globalData[j]['sch'])!="undefined" && typeof(globalData[j]['optimal'])!="undefined" && typeof(dc[0][gens[j]['id']])!='undefined')
{	

	
	sch+=parseFloat(globalData[j]['sch'][i-1])*parseFloat(pocloss[gens[j]['id']])/100;
	sopt+=(parseFloat(globalData[j]['sch'][i-1])+parseFloat(globalData[j]['scedup'][i-1])-parseFloat(globalData[j]['sceddn'][i-1]))*parseFloat(pocloss[gens[j]['id']])/100;
    pmax+=parseFloat(dc[0][gens[j]['id']]['DC on bar']);
     pmin+=parseFloat(dc[0][gens[j]['id']]['DC on bar'])*0.55;

 rup+=Math.min((parseFloat(dc[0][gens[j]['id']]['DC on bar'])-parseFloat(globalData[j]['sch'][i-1])),parseFloat(rampjson[gens[j]['id']]['RUP'].split(",")[i-1]));
   rdn+=Math.min((parseFloat(globalData[j]['sch'][i-1]-parseFloat(dc[0][gens[j]['id']]['DC on bar'])*0.55)),parseFloat(rampjson[gens[j]['id']]['RDN'].split(",")[i-1]));


}

	else{
		sch+=0;
		sopt+=0;
		pmax+=0;
		pmin+=0;
		rup+=0;
		rdn+=0;
	}
}


}
temp.push((i).toString());
temp.push(sch);
temp.push(sopt);
temp.push(pmax);
temp.push(pmin);
temp.push(rup);
temp.push(rdn);



final.push(temp);




}

}
}
//console.log(JSON.stringify(final));
res.send(JSON.stringify(final));

}
,
getRelaxationCost:async function(req,res){



	
var sdate=req.allParams()['selectedDate'];
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
     var curr_block1=curr_block;
      



  var finalData={};
   for(var d=0;d<sdate.length;d++)
{	

	

     finalData[sdate[d]]={}
    
	//console.log(curr_date);
	if(curr_date!=sdate[d]){
	curr_block=96;
}else{
curr_block=curr_block1;
}
//console.log(curr_block);
var gens= await Gen.find({});



var dcdata=await Gamsopt.find({on_date:{'contains':sdate[d]}});
//console.log(JSON.stringify(dcdata[1]));


	for(var j=0;j<gens.length;j++)
{
            


	finalData[sdate[d]][gens[j]['id']]=[];


var gdata = await Gamspwc.find({where:{id:sdate[d]+gens[j]['id']}});

	for(var i=1;i<=curr_block;i++){


	var on_date;
	var dc
	if(i!=0)
	 on_date=sdate[d]+":"+(i).toString();
    else
    	 on_date=sdate[d]+":"+(i).toString();

	for(var l=0;l<dcdata.length;l++){
		if(dcdata[l]['on_date']==on_date){
			dc=dcdata[l];
			break;

		}
	}

	//var dc=await Gamsopt.find({where:{on_date:on_date}});
	
	
//console.log(JSON.stringify(gdata[0]));

	if(typeof(gdata[0])!="undefined" && gens[j]['id'].length!=5  && typeof(gdata[0]['sch'])!="undefined" && typeof(gdata[0]['optimal'])!="undefined" && typeof(dc[gens[j]['id']])!="undefined")
{	
	finalData[sdate[d]][gens[j]['id']].push(parseInt(gdata[0]['optimal'][i-1])-parseInt(dc[gens[j]['id']]['Optimal Schedule']));
}

	else{
		finalData[sdate[d]][gens[j]['id']].push(0);
	
	}


}




	
}


}


//console.log(JSON.stringify(final));
res.send(JSON.stringify(finalData));
},
oands:async function(req,res){
	res.view('trends/oands');
},
relaxation:async function(req,res){
res.view('account/relaxation');
},
diffs:async function(req,res){
	res.view('trends/diffschedule');
}
,
diffoptimals:async function(req,res){
	res.view('trends/diffoptimals');
},
costs:async function(req,res){
	res.view('trends/cost');
},





getpminfromhelper: async function(req,res)
{

	var dates=req.allParams()['dates'];
	var genid=req.allParams()['genid'];
	//console.log(genid);
	var finalD=[];
	if(genid== 0)
	{
		let months=['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
		for(let i=0;i<dates.length;i++)
		{
			var dte=dates[i].split('-');
            dte[1]=months[parseInt(dte[1]) - 1];
            var d8=dte.join('-');
			let data=JSON.parse(await sails.helpers.getPmin.with({sdate:d8}));
			let tempdata=new Array(96).fill(0);
			//console.log('tempdata initially',tempdata);
			//finalD.push(data);
			for(var key in data)
			{
				data.hasOwnProperty(key)
				{
					let actdata=data[key]['OFFBAR'].split(','); 
					//console.log("actdata",actdata);
					for(var j=0;j<tempdata.length;j++)
					{
						tempdata[j]=tempdata[j] + parseFloat(actdata[j]);
					}
					//console.log('tempdata after',tempdata);
				}
			}
			let tempobj={};
			tempobj[genid]={'OFFBAR':tempdata.join(',')};
			finalD.push({date:dates[i],data:tempobj});
		}
		
	}

	else if(genid>=1 && genid<=5 )
	{
		finalD=await sails.helpers.getPminbyregionid.with({dates: dates, region_id:genid });
	}

	else
	{
	 finalD=await sails.helpers.getPminbygenid.with({dates: dates, genid:genid });
	}

	res.send(finalD);
}





        


};




