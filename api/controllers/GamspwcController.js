/**
 * GamspwcController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
 getReport: async function (req, res) {

    startDate = req.allParams()['fromDate'];
    endDate = req.allParams()['toDate'];

    //console.log(startDate,endDate)
    generators = req.allParams()['gens']
    let month_names = ["Jan", "Feb", "Mar",
      "Apr", "May", "Jun",
      "Jul", "Aug", "Sep",
      "Oct", "Nov", "Dec"];

    sdate = startDate.split("-")[2] + "-" + month_names[parseInt(startDate.split("-")[1])-1] + "-" + startDate.split("-")[0]
    edate = endDate.split("-")[2] + "-" + month_names[parseInt(endDate.split("-")[1])-1] + "-" + endDate.split("-")[0]



    start_yy = new Date(startDate)
    end_yy = new Date(endDate)

    let dates_vals = []

    let avgaismp = 0

    for (let dt = start_yy; dt <= end_yy; dt.setDate(dt.getDate() + 1)) {
      //console.log(dt)
      dates_vals.push((dt.toISOString()).split("T")[0].split("-").reverse().join("-"));

    }



    // console.log(dates_vals)

    let noofdays = dates_vals.length
    if(noofdays > 365){
      res.send({label:"error"})
    }
    // let mcobj = {}
    // for (let d in dates_vals) {

    //   let mc = await MarginalCost.find({ on_date: { 'contains': dates_vals[d] } });
    //   mcobj[dates_vals[d]] = mc

    // }

    // for (let d in dates_vals) {
    //   for (let l in mcobj[dates_vals[d]]) {
    //     avgaismp += mcobj[dates_vals[d]][l]["cost"]["6"]
    //   }

    // }

    // console.log(avgaismp / (96 * noofdays))

    let sceddata = await Gamspwc.find({
      where: {
        dateString: {
          '<=': new Date(endDate),
          '>=': new Date(startDate)
        }
      }
    });

    console.log(sdate,edate)

    let vcJson = await sails.helpers.getVc.with({ sdate: sdate, edate: edate });

    let maxPrice = -1;
    let minPrice = 1000000;
    let maxgen = ''
    let mingen =''

    vcJson = JSON.parse(vcJson)

    console.log("VCJSON",(vcJson))

    for (let key in vcJson) {
      //console.log(key)
      for (let gen in vcJson[key]) {
        if(generators.includes(gen))
       { 
        if (parseFloat(vcJson[key][gen]) > maxPrice)
                { maxPrice = parseFloat(vcJson[key][gen])
                                  maxgen=gen}
               if (parseFloat(vcJson[key][gen]) < minPrice)
               {  minPrice = parseFloat(vcJson[key][gen])
                              mingen = gen}

             }
      }

    }


    for(let g=0;g<generators.length;g++){

    }

    //console.log((vcJson))

    avgSch = []
    avgOpt = []
    avgOcost = []
    avgPcost = []
    avgPert = []
    totalPert = []
    genUp = []
    genDown = []
    sched = []
    schedopt = []
    schVal = []
    optVal = []
    totalOpt = []
    for (let blk = 0; blk < 96; blk++) {
      let tempsch = 0
      let tempopt = 0
      let tempocost = 0
      let temppcost = 0
      let temppert = 0
      let totalpert = 0
      let genup = 0
      let gendown = 0
      let sch = 0
      let schopt = 0
      let schval = 0
      let optval = 0

      for (let l = 0; l < sceddata.length; l++)
        if (sceddata[l]['id'].length > 11 && generators.includes(sceddata[l]['id'].substring(10,(sceddata[l]['id']).length))) {
          tempsch += parseFloat(sceddata[l]['sch'][blk])
          tempopt += parseFloat(sceddata[l]['optimal'][blk])
          tempocost += parseFloat(sceddata[l]['ocost'][blk])
          temppcost += parseFloat(sceddata[l]['pcost'][blk])
          let ll = parseFloat(sceddata[l]['optimal'][blk]) - parseFloat(sceddata[l]['sch'][blk])
          let schchn = (blk == 95 ? 0 : Math.abs(parseFloat(sceddata[l]['sch'][blk]) - parseFloat(sceddata[l]['sch'][blk + 1])))
          let optchn = (blk == 95 ? 0 : Math.abs(parseFloat(sceddata[l]['optimal'][blk]) - parseFloat(sceddata[l]['optimal'][blk + 1])))
          //let schval = blk == 95 ? 0 : parseFloat(sceddata[l]['sch'][blk]) - parseFloat(sceddata[l]['sch'][blk + 1])
          temppert += ll > 0 ? ll : 0
          totalpert += ll > 0 ? ll : -1 * ll

          schval += schchn
          optval += optchn

          if (ll > 0)
            genup += 1
          if (ll < 0)
            gendown += 1

          if (schchn > 0)
            sch += 1
          if (optchn > 0)
            schopt += 1

        }
      avgSch.push(tempsch / noofdays)
      avgOpt.push(tempopt / noofdays)
      totalOpt.push(tempopt)
      avgOcost.push(tempocost)
      avgPcost.push(temppcost)
      avgPert.push(temppert / noofdays)
      totalPert.push(totalpert)
      genUp.push(genup / noofdays)
      genDown.push(gendown / noofdays)
      sched.push(sch)
      schedopt.push(schopt)
      schVal.push(schval)
      optVal.push(optval)

    }

    let diff = avgPcost.reduce((a, b) => a + b, 0) / 400 - avgOcost.reduce((a, b) => a + b, 0) / 400
    let diff1 = avgPcost.reduce((a, b) => a + b, 0) - avgOcost.reduce((a, b) => a + b, 0)
    let mw = avgSch.reduce((a, b) => a + b, 0) / 96
    let unit = diff1 / totalOpt.reduce((a, b) => a + b, 0)
    let tt=(totalOpt.reduce((a, b) => a + b, 0))
    let perturbation = totalPert.reduce((a, b) => a + b, 0)
    let uu = diff1 / perturbation
    let avgpert = avgPert.reduce((a, b) => a + b, 0) / 96
    //let perturbation = totalPert.reduce((a, b) => a + b, 0)
    let schedule_change = sched.reduce((a, b) => a + b, 0)
    let optimal_change = schedopt.reduce((a, b) => a + b, 0)
    let schedule_value = schVal.reduce((a, b) => a + b, 0)
    let optimal_value = optVal.reduce((a, b) => a + b, 0)
    let ocostv= avgOcost.reduce((a, b) => a + b, 0)/tt
    let pcostv= avgPcost.reduce((a, b) => a + b, 0)/tt

 

    res.send({ oc:ocostv*10000,scho:avgOpt,pc:pcostv*10000,days:noofdays,vc: maxPrice.toString()+"+"+maxgen+ ":" + minPrice.toString()+"+"+mingen, uu: uu * 10000, decval: 100 - (optimal_value / schedule_value * 100), dec: 100 - (optimal_change / schedule_change * 100), up: genUp.reduce((a, b) => a + b, 0) / 96, down: genDown.reduce((a, b) => a + b, 0) / 96, perturbation: perturbation * 0.00025 / 2, avgpert: avgpert, avgmw: mw, ocost: avgOcost.reduce((a, b) => a + b, 0) / 400, pcost: avgPcost.reduce((a, b) => a + b, 0) / 400, unit: unit * 10000 });


  },

  getGamsClamped:async function(req,res){

    var sdate=req.allParams()['selectedDate'];
    var gens=await Gen.find({});

var rup = {'5014':'90','5015':'70','5009':'35','5008':'135','5013':'180','3017':'100','3020':'135','3016':'100','3018':'100','5018':'70','5019':'70','5020':'70','5021':'35','5017':'90','1011':'38','5012':'120','4014':'100','1005':'50','1009':'90','1006':'112.5','1004':'67.5','5023':'25','4013':'18','4015':'36','1003':'120','1008':'37.5','4009':'50','4008':'160','1012':'30','4006':'180','4005':'48','4010':'100','4011':'100','3050':'35','5011':'70','5029':'70','2011':'30','3022':'30','3023':'30','3024':'15','4012':'112.5','4007':'37.5','3011':'50','3012':'50','4031':'180','3007':'80','5031':'30'};
var rdn = {'5014':'90','5015':'70','5009':'35','5008':'135','5013':'180','3017':'150','3020':'200','3016':'150','3018':'150','5018':'70','5019':'70','5020':'70','5021':'35','5017':'90','1011':'38','5012':'120','4014':'100','1005':'50','1009':'90','1006':'112.5','1004':'67.5','5023':'25','4013':'14','4015':'45','1003':'120','1008':'37.5','4009':'50','4008':'160','1012':'30','4006':'80','4005':'60','4010':'100','4011':'100','3050':'35','5011':'70','5029':'70','2011':'30','3022':'30','3023':'30','3024':'15','4012':'112.5','4007':'37.5','3011':'50','3012':'50','4031':'180','3007':'80','5031':'30'};

var sum=[];
for(var i=0;i<96;i++)
{
sum.push(0);

}


    for(var i=0;i<gens.length;i++)
{    
	var gamspwc=await Gamspwc.find({where:{'id':sdate+gens[i]['id']}});
//console.log(JSON.stringify(parseFloat(rdn[gens[i]['id']])));
	for(var j=1;j<96;j++)
{		

//console.log(parseFloat(gamspwc['optimal'][j]))

	if(typeof(gamspwc)!="undefined" && typeof(gamspwc[0]) !="undefined" && typeof(gamspwc[0]['sch']) !="undefined" && typeof(gamspwc[0]['optimal']) !="undefined"){
if(parseFloat(gamspwc[0]['optimal'][j])-parseFloat(gamspwc[0]['optimal'][j-1])>parseFloat(rup[gens[i]['id']])){

	sum[j]+=parseFloat(gamspwc[0]['optimal'][j-1])+parseFloat(rup[gens[i]['id']]) - parseFloat(gamspwc[0]['sch'][j]);

}else if(parseFloat(gamspwc[0]['optimal'][j-1])-parseFloat(gamspwc[0]['optimal'][j])>parseFloat(rdn[gens[i]['id']])){

sum[j]+=parseFloat(gamspwc[0]['optimal'][j-1])-parseFloat(rdn[gens[i]['id']]) - parseFloat(gamspwc[0]['sch'][j]);

}else{

sum[j]+=parseFloat(gamspwc[0]['optimal'][j]) - parseFloat(gamspwc[0]['sch'][j]);

}

   
}else{
	sum[j]+=0;
}
   
	}


}

var final=[];
var tt=[];
tt.push('block');
tt.push('totalDiff');
final.push(tt);
for(var i=0;i<96;i++){
	var temp=[];
	temp.push(i+1);
	temp.push(sum[i]);
	final.push(temp);
}
res.send(JSON.stringify(final));

  },
  getMillage:async function(req,res){
    var date1=req.allParams()['date1'];
    var date2=req.allParams()['date2'];
  var gens=await Gen.find({});
  var previous={};
  for(var i=0;i<gens.length;i++)
{   
	var previousData=await Gamspwc.find({'_id':date2+gens[i]['id']});
      previous[gens[i]['id']]={};
      if(typeof(previousData[0])!="undefined")
{      previous[gens[i]['id']]['optimal']=previousData[0]['optimal'][95];
      previous[gens[i]['id']]['schedule']=previousData[0]['sch'][95];

  }else{

   previous[gens[i]['id']]['optimal']=0;
      previous[gens[i]['id']]['schedule']=0;


  }

}

var millage=[];
for(var i=0;i<gens.length;i++){
      var todayData=await Gamspwc.find({'_id':date1+gens[i]['id']});
      millage.push({'id':gens[i]['id']});
      var msch=0;
      var mopt=0;
      var nsch=0;
      var nopt=0;
      if(typeof(todayData[0])!="undefined")

  {    msch+=Math.abs(todayData[0]['sch'][0]-previous[gens[i]['id']]['schedule']);
        mopt+=Math.abs(todayData[0]['optimal'][0]-previous[gens[i]['id']]['optimal']);

    }else{

          msch+=0;
          mopt+=0;

    }


      for(var j=2;j<=96;j++){

if(typeof(todayData[0])!="undefined")
{      	if(todayData[0]['sch'][j-1]!=0 && todayData[0]['optimal'][j-1]!=0)
     { 	
     	   var x=Math.abs(todayData[0]['sch'][j-1]-todayData[0]['sch'][j-2]);
     	   var y=Math.abs(todayData[0]['optimal'][j-1]-todayData[0]['optimal'][j-2]);
     		msch+=x;
           	mopt+=y;
           	if(x!=0){
           		nsch+=1;
           	}
           	if(y!=0){
           		nopt+=1;
           	}

           }

       }else{



msch+=0;
mopt+=0;
nsch+=0;
nopt+=0;

       }



      }
      millage[i]['dsch']=msch;
      millage[i]['dopt']=mopt;
      millage[i]['nsch']=nsch;
      millage[i]['nopt']=nopt;

}
res.send(JSON.stringify(millage));
     
  },
  getMillageRange:async function(req,res){
    var date1=req.allParams()['date1'];
    var date2=req.allParams()['date2'];
  //
  var millage=[];

	var gens=await Gen.find({});


for(var i=0;i<gens.length;i++){
	  var msch=0;
      var mopt=0;
      var nsch=0;
      var nopt=0;

       millage.push({'id':gens[i]['id']});
        for(var dd=0;dd<date1.length;dd++)

{  
	var previous={};

	if(dd==0){
			
  
	var previousData=await Gamspwc.find({'_id':date2+gens[i]['id']});
      previous[gens[i]['id']]={};

      if(typeof(previousData[0])!="undefined")
{      previous[gens[i]['id']]['optimal']=previousData[0]['optimal'][95];
      previous[gens[i]['id']]['schedule']=previousData[0]['sch'][95];

  }else{

     previous[gens[i]['id']]['optimal']=0;
      previous[gens[i]['id']]['schedule']=0;

  }




      var todayData=await Gamspwc.find({'_id':date1[dd]+gens[i]['id']});
      
      if(typeof(todayData[0])!="undefined")
{      msch+=Math.abs(todayData[0]['sch'][0]-previous[gens[i]['id']]['schedule']);
      mopt+=Math.abs(todayData[0]['optimal'][0]-previous[gens[i]['id']]['optimal']);

}else{

msch+=0;
mopt+=0;


}



      for(var j=2;j<=96;j++){


      	if(typeof(todayData[0])!="undefined")

 {     	if(todayData[0]['sch'][j-1]!=0 && todayData[0]['optimal'][j-1]!=0)
      { 	
      	   var x=Math.abs(todayData[0]['sch'][j-1]-todayData[0]['sch'][j-2]);
      	   var y=Math.abs(todayData[0]['optimal'][j-1]-todayData[0]['optimal'][j-2]);
      		msch+=x;
            	mopt+=y;
            	if(x!=0){
            		nsch+=1;
            	}
            	if(y!=0){
            		nopt+=1;
            	}
 
            }
 }else{

    msch+=0;
    mopt+=0;
    nsch+=0;
    nopt+=0;


 }




      }
  


}else{

	var previousData=await Gamspwc.find({'_id':date1[dd-1]+gens[i]['id']});
      previous[gens[i]['id']]={};

      if(typeof(previousData[0])!="undefined")
{      previous[gens[i]['id']]['optimal']=previousData[0]['optimal'][95];
      previous[gens[i]['id']]['schedule']=previousData[0]['sch'][95];


  }else{

 previous[gens[i]['id']]['optimal']=0;
      previous[gens[i]['id']]['schedule']=0;


      }




      var todayData=await Gamspwc.find({'_id':date1[dd]+gens[i]['id']});
      

     if(typeof(todayData[0])!="undefined")
{
      
      msch+=Math.abs(todayData[0]['sch'][0]-previous[gens[i]['id']]['schedule']);
      mopt+=Math.abs(todayData[0]['optimal'][0]-previous[gens[i]['id']]['optimal']);
}else{


	msch+=0;
	mopt+=0;
}


      for(var j=2;j<=96;j++){

if(typeof(todayData[0])!="undefined")
{      	if(todayData[0]['sch'][j-1]!=0 && todayData[0]['optimal'][j-1]!=0)
     { 	
     	   var x=Math.abs(todayData[0]['sch'][j-1]-todayData[0]['sch'][j-2]);
     	   var y=Math.abs(todayData[0]['optimal'][j-1]-todayData[0]['optimal'][j-2]);
     		msch+=x;
           	mopt+=y;
           	if(x!=0){
           		nsch+=1;
           	}
           	if(y!=0){
           		nopt+=1;
           	}

           }
}else{

msch+=0;
mopt+=0;
nsch+=0;
nopt+=0;


}


      }






}


}

    millage[i]['dsch']=msch;
      millage[i]['dopt']=mopt;
      millage[i]['nsch']=nsch;
      millage[i]['nopt']=nopt;

}
res.send(JSON.stringify(millage));
     
  },
getChangesSchedule:async function(req,res){
    var date1=req.allParams()['date1'];
    var date2=req.allParams()['date2'];

var schChange=[];
var gens=await Gen.find({});
 for(var loop=0;loop<date1.length;loop++)
 {
	

var previous={};
for(var i=0;i<gens.length;i++){
  
	var previousData=await Gamspwc.find({'_id':date2[loop]+gens[i]['id']});
      previous[gens[i]['id']]={};
      if(typeof(previousData[0])!="undefined")
{   if(typeof(previousData[0]['optimal'])!="undefined")   
	previous[gens[i]['id']]['optimal']=previousData[0]['optimal'][95];

	if(typeof(previousData[0]['sch'])!="undefined")
      previous[gens[i]['id']]['schedule']=previousData[0]['sch'][95];

  }else{

  previous[gens[i]['id']]['optimal']=0;
      previous[gens[i]['id']]['schedule']=0;

  }


}
var globalData=[];
for(var block=0;block<96;block++){
	var numgensup=0;
	var numgensdn=0;
	var schup=0;
	var schdown=0;
	for(var i=0;i<gens.length;i++){
		if(block==0)
	{	var currentData=await Gamspwc.find({'_id':date1[loop]+gens[i]['id']});
		globalData.push(currentData[0]);
}
		  if(typeof(globalData[i])!='undefined')
          if(block==0){
          var sch=globalData[i]['sch'][block];
          var oldsch=previous[gens[i]['id']]['schedule'];
         if(sch>oldsch){

          numgensup+=1;
          schup+=parseInt(sch-oldsch);

         }
         if(sch < oldsch){
            numgensdn+=1;
            schdown+=parseInt(sch-oldsch);

         }

          }else{

            var sch=globalData[i]['sch'][block];
          var oldsch=globalData[i]['sch'][block-1];
         if(sch>oldsch){

          numgensup+=1;
          schup+=parseInt(sch-oldsch);

         }
         if(sch < oldsch){
            numgensdn+=1;
            schdown+=parseInt(sch-oldsch);
         }

          }

	}
	schChange.push([date1[loop]+":"+(block+1).toString(),numgensup,numgensdn,schup,schdown]);

}

}

//console.log(schChange);
res.send(JSON.stringify(schChange));
     
  },
  getUtilAvail:async function(req,res){
  	var dates=req.allParams()['dates'];
    let startDate = dates[0].split("-").reverse().join("-")
    let endDate = dates[dates.length-1].split("-").reverse().join("-")

    let sceddata = await Gamspwc.find({
      where: {
        dateString: {
          '<=': new Date(endDate),
          '>=': new Date(startDate)
        }
      }
    });

    let scedMap = {}

    for(let l=0;l<sceddata.length;l++){
      scedMap[sceddata[l]['id']] = sceddata[l]
    }


    var final=[];
 //console.log(dates);
      var gens=await Gen.find({});

// var dcfinal={};
// var schfinal={};

// for(var d=0;d<dates.length;d++){
// var dctotalval=await Gamsopt.find({on_date:{'contains':dates[d]}});
// var schtotalval=await Gamspwc.find({id:{'contains':dates[d]}});
// for(var k=0;k<dctotalval.length;k++){
//  dcfinal[dctotalval[k]['on_date']]=dctotalval[k];

// }

// for(var k=0;k<schtotalval.length;k++){
//  schfinal[schtotalval[k]['id']]=schtotalval[k];
  
// }

//}

      for(var i=0;i<gens.length;i++)
  
  {   
 var DC=0;
 var SCH=0;
 var OPT=0;
 final.push({'id':gens[i]['id']});

 //var dcdata=await Gamsopt.find({on_date:{'contains':sdate[d]}});
//var schval=await Gamspwc.find({on_date:{'contains':sdate[d]}});

    for(var d=0;d<dates.length;d++){
      //var schopt=await Gamspwc.find({'_id':dates[d]+gens[i]['id']});
      //var dcval=await Gamsopt.find({on_date:{'contains':dates[d]}});
try{
      DC+= scedMap[dates[d]+gens[i]['id']]['dc'].reduce((a, b) => a + b, 0);
     
     
    }
    catch(error){
DC+=0
    }
    try{
 SCH+= scedMap[dates[d]+gens[i]['id']]['sch'].reduce((a, b) => a + b, 0);
    }catch(error){
SCH+=0
    }
    try{
 OPT += scedMap[dates[d]+gens[i]['id']]['optimal'].reduce((a, b) => a + b, 0);
    }catch(error){
OPT+=0
    }
      // var schopt=[];
      // schopt.push(schfinal[dates[d]+gens[i]['id']]);
      // for(var block=1;block<=96;block++){
    //       //console.log(dates[d]+":"+block.toString());
    //       var on_date=dates[d]+":"+block.toString();
    //       //var dc=await Gamsopt.find({where:{on_date:on_date}});
    //       var dc=[];
    //      dc.push(dcfinal[on_date]);
          // for(var l=0;l<dcval.length;l++){
          //  if(on_date==dcval[l]['on_date']){
          //    dc.push(dcval[l]);
          //    break;
          //  }
          // }
          //console.log(JSON.stringify(dc[0][gens[i]['id']]));
         //  if(typeof(dc)!="undefined" && typeof(dc[0])!="undefined" && typeof(dc[0][gens[i]['id']])!="undefined")
         // {  DC+=parseInt(dc[0][gens[i]['id']]['DC']);}else{
         //   DC+=0;
         // }
         // if(typeof(schopt[0])!='undefined')
         // {
         //   SCH+=parseInt(schopt[0]['sch'][block-1]);
         //   OPT+=parseInt(schopt[0]['optimal'][block-1]);
         // }
           

      //}
                
          
        }
        final[i]['sumdc']=DC;
        final[i]['sumsch']=SCH;
        final[i]['sumopt']=OPT;

      }

      res.send(JSON.stringify(final));
    

  },
  getReserve:async function(req,res){
       var date=req.allParams()['date'];
       var block=req.allParams()['block'];
       var gens=await Gen.find({});
 var month_names =["Jan","Feb","Mar",
                      "Apr","May","Jun",
                      "Jul","Aug","Sep",
                      "Oct","Nov","Dec"];
  var sdate=date;
   
   //var arrlen=sdate.length;
   var mon=parseInt(sdate.split("-")[1])-1;

      var vcDate=sdate.split("-")[0]+"-"+month_names[mon]+"-"+sdate.split("-")[2];
      console.log(vcDate);
      var pminJson= await sails.helpers.getPmin.with({sdate:vcDate,edate:vcDate});
      //console.log(typeof(vcJson));
      pminJson=JSON.parse(pminJson);

   var stdate=sdate.split("-")[0]+"-"+month_names[parseInt(sdate.split("-")[1])-1]+"-"+sdate.split("-")[2];
//var etdate=sdate[arrlen-1].split("-")[0]+"-"+month_names[parseInt(sdate[arrlen-1].split("-")[1])-1]+"-"+sdate[arrlen-1].split("-")[2];
var vcJson= await sails.helpers.getRamp.with({sdate:stdate});
var ramps=JSON.parse(vcJson);
       var gamsData=await Gamsopt.find({where:{on_date:date+":"+block.toString()}});
       var rdata=[];
       for(var i=0;i<gens.length;i++){
             var gamsPWC=await Gamspwc.find({'_id':date+gens[i]['id']});
             rdata.push({'id':gens[i]['id']});
           
             if(typeof(gamsData[0][gens[i]['id']])!="undefined")
             {
               try {
                rdata[i]['pmax']=parseInt(gamsData[0][gens[i]['id']]['DC on bar']);
                rdata[i]['opt']=parseInt(gamsPWC[0]['optimal'][block-1]);
           rdata[i]['sch']=parseInt(gamsPWC[0]['sch'][block-1]);


             rdata[i]['pmin']=parseInt(Math.min(Math.max(parseFloat(pminJson[gens[i]['id']]['NORMBAR'].split(",")[block-1])*0.55,parseFloat(pminJson[gens[i]['id']]['TM'].split(",")[block-1])),parseFloat(gamsPWC[0]['sch'][block-1])));
           rdata[i]['rup']=parseFloat(ramps[gens[i]['id']]['RUP'].split(",")[block-1]);
           rdata[i]['rdn']=parseFloat(ramps[gens[i]['id']]['RDN'].split(",")[block-1]);
               } catch (error) {
                rdata[i]['pmax']=0;
             	 rdata[i]['opt']=0;
             	 rdata[i]['sch']=0;

             	 rdata[i]['pmin']=0;
             	 rdata[i]['rup']=0;
             	 rdata[i]['rdn']=0;

               }
            


             }else{
             	 rdata[i]['pmax']=0;
             	 rdata[i]['opt']=0;
             	 rdata[i]['sch']=0;

             	 rdata[i]['pmin']=0;
             	 rdata[i]['rup']=0;
             	 rdata[i]['rdn']=0;


             }
            
           
       }
       res.send(JSON.stringify(rdata));
  },


  getChanges:async function(req,res){
   var dates = req.allParams()['date'];
   var gens=await Gen.find({});
   var changes=[];


   for(var loop=0;loop<dates.length;loop++)
   {
   	var sdate=dates[loop];


      var curr_date=new Date();
         curr_date.setHours(curr_date.getHours()+5);
        curr_date.setMinutes(curr_date.getMinutes()+30);
       curr_date= curr_date.toISOString().slice(0,10);
var curr_date1=new Date();
        var hh=curr_date1.getHours();
        var mm=curr_date1.getMinutes();
     curr_date=curr_date.split("-").reverse().join("-");
     var curr_block=Math.ceil(hh*4)+Math.ceil(mm/15.0);

     if(curr_date!=sdate){
     	curr_block=96;
     }



   var globalData=[];
   for(var i=0;i<curr_block;i++){
   	var upcount=0;
   	var downcount=0;
   	var upmw=0;
   	var downmw=0;
   	//var modTotal=0;
   	//var saving=0;
     for(var j=0;j<gens.length;j++){
        if(i==0)
 {    	var gendata=await Gamspwc.find({'_id':sdate+gens[j]['id']});

           globalData.push(gendata[0]);
}
		if(typeof(globalData[j])!='undefined')
     	var sch=parseInt(globalData[j]['sch'][i]);

     if(typeof(globalData[j])!='undefined')
     	var optimal=parseInt(globalData[j]['optimal'][i]);
     	//var ocost=parseInt(gendata[0]['ocost'][i]);
     	//var pcost=parseInt(gendata[0]['pcost'][i]);
     	if(optimal-sch>0){
     		upcount++;
     		upmw+=optimal-sch;
     		//modTotal+=optimal-sch;
     		//saving+=pcost-ocost;

     	}
     	if(optimal-sch < 0){
     		downcount++;
     		downmw+=optimal-sch;
     		//modTotal+=sch-optimal;
     		//saving+=pcost-ocost;
     	}
     }
     changes.push([dates[loop]+":"+(i+1).toString(),upcount,downcount,upmw,downmw]);

   }

}
   res.send(JSON.stringify(changes));

  }, getAveragePrice:async function(req,res){
   var dates = req.allParams()['date'];
   var region =req.allParams()['region'];
   var gens=await Gen.find({});
   var changes=[];


for(var loop=0;loop<dates.length;loop++)
{
	var sdate=dates[loop];




   var curr_date=new Date();
         curr_date.setHours(curr_date.getHours()+5);
        curr_date.setMinutes(curr_date.getMinutes()+30);
       curr_date= curr_date.toISOString().slice(0,10);
var curr_date1=new Date();
        var hh=curr_date1.getHours();
        var mm=curr_date1.getMinutes();
     curr_date=curr_date.split("-").reverse().join("-");
     var curr_block=Math.ceil(hh*4)+Math.ceil(mm/15.0);

     if(curr_date!=sdate){
     	curr_block=96;
     }
     var globalData=[];
   for(var i=0;i<curr_block;i++){

   	var modTotal=0;
   	var saving=0;
   	var optimalTotal=0;
   	var schTotal=0;
   	var ocostTotal=0;
   	var pcostTotal=0;
     for(var j=0;j<gens.length;j++){
     if(gens[j]['id'][0]==region || region=="0")
     {	
		if(i==0)
     	{	var gendata=await Gamspwc.find({'_id':sdate+gens[j]['id']});
     		//console.log(gendata[0]);
     		globalData.push(gendata[0]);
 		}
 		if(typeof(globalData[j])!='undefined')
 		{
 			var sch=parseInt(globalData[j]['sch'][i]);
          	var optimal=parseInt(globalData[j]['optimal'][i]);
          	var ocost=parseInt(globalData[j]['ocost'][i]);
          	var pcost=parseInt(globalData[j]['pcost'][i]);

 		}

 		else
 		{
 			var sch=0;
          	var optimal=0;
          	var ocost=0;
          	var pcost=0;

 		}
          	
          	optimalTotal+=optimal;
          	schTotal+=sch;
          	ocostTotal+=ocost;
          	pcostTotal+=pcost;
          	if(optimal-sch>0){
          		
          		modTotal+=optimal-sch;
          		saving+=pcost-ocost;
     
          	}
          	if(optimal-sch < 0){
          
          		modTotal+=sch-optimal;
          		saving+=pcost-ocost;
          	
          	}
          
          }
     }
     changes.push([i+1,modTotal,saving,optimalTotal,schTotal,ocostTotal,pcostTotal]);

   }

}
   res.send(JSON.stringify(changes));

  },getSystemReport:async function(req,res){

         var dates=req.allParams()['dates'];
        var fdata=[];

        var gens=await Gen.find();
         for(var i=0;i<dates.length;i++){
         	       // var temp=[];
                    var totalMWSCH=0;
                    var totalMWOPT=0;
                    var precost=0;
                    var postcost=0;
                    var ss=0;
            for(var j=0;j<gens.length;j++){

            var gamsgen=await Gamspwc.find({'_id':dates[i]+gens[j]['id']});

            for(var k=0;k<96;k++){
            	var opt=0;
            	var sch=0;
            	if(typeof(gamsgen[0])!="undefined")
          {  	totalMWSCH+=gamsgen[0]['sch'][k];
                      	totalMWOPT+=gamsgen[0]['optimal'][k];
                      	precost+=gamsgen[0]['pcost'][k];
                          postcost+=gamsgen[0]['ocost'][k];   
                           opt= gamsgen[0]['optimal'][k];
                           sch=gamsgen[0]['sch'][k];

                      }
                      else{


totalMWSCH+=0;
                      	totalMWOPT+=0;
                      	precost+=0;
                          postcost+=0;   
                           opt=0;
                           sch=0;


                      }

                if(opt-sch>0){
                	ss+=opt-sch;
                }
             
            }

            }

             fdata.push([dates[i],totalMWSCH,totalMWOPT,precost,postcost,ss]);

         }
         res.send(JSON.stringify(fdata));

  },
  getScatterPlot:async function(req,res){

  		  	var month_names =["Jan","Feb","Mar",
                      "Apr","May","Jun",
                      "Jul","Aug","Sep",
                      "Oct","Nov","Dec"];


         var dates=req.allParams()['dates'];
        var fdata=[];

        var gens=await Gen.find();
         for(var i=0;i<dates.length;i++){



            var mon=parseInt(dates[i].split("-")[1])-1;

      var vcDate=dates[i].split("-")[0]+"-"+month_names[mon]+"-"+dates[i].split("-")[2];
      //console.log(vcDate);
      var pminJson= await sails.helpers.getPmin.with({sdate:vcDate});
       var pmaxJson= await sails.helpers.getPmax.with({sdate:vcDate});

       pminJson=JSON.parse(pminJson);
       pmaxJson=JSON.parse(pmaxJson);

       let smp = await MarginalCost.find({on_date:{'contains':dates[i]}});
                 // var temp=[];
                // console.log(sm)
                 //console.log(JSON.stringify(pmaxJson));
                 var gendata=[];
                  for(var k=0;k<96;k++){

                let smpval = 0;

                  try{
smpval = smp[k]["cost"]["6"]
                  }catch(error){
                    console.log(error)
                  }
               var totalMWSCH=0;
                    var totalMWOPT=0;
                    var precost=0;
                    var postcost=0;
                    var ss=0;  

                        var upReserve=0;
                    var dnReserve=0; 



            for(var j=0;j<gens.length;j++){
                if(k==0)
        {    var gamsgen=await Gamspwc.find({'_id':dates[i]+gens[j]['id']});
                   gendata.push(gamsgen[0]);

              }

              var sch=0;
              var opt=0;

           if(typeof(gendata[j])!="undefined")
         {    totalMWSCH+=gendata[j]['sch'][k];
                      totalMWOPT+=gendata[j]['optimal'][k];
                      precost+=gendata[j]['pcost'][k];
                         postcost+=gendata[j]['ocost'][k];   
                         opt= gendata[j]['optimal'][k];
                         sch=gendata[j]['sch'][k];

                     }
                     else{

                      totalMWSCH+=0;
                      totalMWOPT+=0;
                      precost+=0;
                         postcost+=0;   
                         opt=0;
                         sch=0;




                     }

                
           if(typeof(pmaxJson[gens[j]['id']])!="undefined" && typeof(pminJson[gens[j]['id']])!="undefined" )
                 { upReserve+=parseInt(pmaxJson[gens[j]['id']]['DC'].split(",")[k])-sch;
                                 dnReserve+=Math.min(Math.max(parseFloat(pminJson[gens[j]['id']]['NORMBAR'].split(",")[k])*0.55,parseFloat(pminJson[gens[j]['id']]['TM'].split(",")[k])),sch)-sch;
                 }else{
                  upReserve+=0;
                  dnReserve+=0;
                 }

                if(opt-sch>0){
                  ss+=opt-sch;
                }

                
             
            }
            fdata.push([totalMWSCH,totalMWOPT,precost,postcost,ss,upReserve,dnReserve,smpval]);

            }

             

         }
         res.send(JSON.stringify(fdata));

  },
  getSupplyDemand:async function(req,res){
  	var month_names =["Jan","Feb","Mar",
                      "Apr","May","Jun",
                      "Jul","Aug","Sep",
                      "Oct","Nov","Dec"];


         var date=req.allParams()['date'];
         var block=req.allParams()['block'];


        var mon1=parseInt(date[date.length-1].split("-")[1])-1;
          var vcDate=date[date.length-1].split("-")[0]+"-"+month_names[mon1]+"-"+date[date.length-1].split("-")[2];
      var vcJson= await sails.helpers.getVc.with({sdate:vcDate,edate:vcDate});
      var vcJson=JSON.parse(vcJson);
      var dataDCOff=JSON.parse(await sails.helpers.getPmin.with({sdate:vcDate}));
      //sconsole.log(dataDCOff);

		var gens=await Gen.find();
		//console.log(gens);
		//console.log('end of printing of gens'); 

		var on_date=date[0].toString()+":"+block.toString();
		var gendata=[];
		//console.log(JSON.stringify(vcJson));
		var gopt=await Gamsopt.find({on_date:on_date});

		for(var j=0;j<gens.length;j++){

     

     var gc=await Gamspwc.find({'_id':date[0].toString()+gens[j]['id'].toString()});
     //console.log('printing gc');
     //console.log(gc);
     //console.log('end of printing of gc');
     
///console.log(JSON.stringify(gc));
if(typeof(gopt[0][gens[j]['id']])!="undefined")
{
	gendata.push({dc:gopt[0][gens[j]['id']]['DC'],vc:vcJson[vcDate][gens[j]['id']],opt:gc[0]['optimal'][block-1], dcoffon:parseInt(dataDCOff[gens[j]['id']]['OFFBAR'].split(',')[block-1]) + parseInt(gopt[0][gens[j]['id']]['DC'])});

}else{
gendata.push({dc:0,vc:vcJson[vcDate][gens[j]['id']],opt:gc[0]['optimal'][block-1]});	
}


		}

res.send([dataDCOff,gendata]);


  },

  getMCPByDates:async function(req,res){
  	var month_names =["Jan","Feb","Mar",
                      "Apr","May","Jun",
                      "Jul","Aug","Sep",
                      "Oct","Nov","Dec"];


      var dates=req.allParams()['dates'];

      var mon1=parseInt(dates[0].split("-")[1])-1;
      var mon2=parseInt(dates[dates.length-1].split("-")[1])-1;
      var vcDate1=dates[0].split("-")[0]+"-"+month_names[mon1]+"-"+dates[0].split("-")[2];
      var vcDate2=dates[dates.length-1].split("-")[0]+"-"+month_names[mon2]+"-"+dates[dates.length-1].split("-")[2];
      
      var vcJson= await sails.helpers.getVc.with({sdate:vcDate1,edate:vcDate2});
      var vcJson=JSON.parse(vcJson);

      

   
   var mcp=[];

   var gens=await Gen.find();
   var optdata=[];
   var dcdata=[];
   for(var i=0;i<dates.length;i++)
   {
		var dc=await Gamsopt.find({on_date:{'contains':dates[i]}});
		var opt=await Gamspwc.find({id:{'contains':dates[i]}});
		optdata.push(opt);
		dcdata.push(dc);
   }

   //res.send({optdata:optdata , dcdata:dcdata,gens:gens});


   for(let i=0;i<dates.length;i++)
   {
   	var eachdaydata=[];

   	

   		for(let j=0;j<96;j++)
   		{
   			//var on_date=dates[i].toString()+":"+(j+1).toString();
   			//var gopt=await Gamsopt.find({on_date:on_date});


   			
   			//console.log(gens);
   			var gendata=[];
   			//console.log('gopt value for en 5038');
   			//console.log(typeof(gopt[0]['5038']));
   			
   			//if(typeof(gopt[0]) != 'undefined')
   			for(k=0;k<gens.length;k++)
   			{
   				//var gc=await Gamspwc.find({'_id':dates[i].toString()+gens[k]['id'].toString()});
     			//console.log('printing gc');
     			//console.log(gc);
     			//console.log('end of printing of gc');
     			let mon=parseInt(dates[i].split("-")[1])-1;
     			let vcDate=dates[i].split("-")[0]+"-"+month_names[mon]+"-"+dates[i].split("-")[2];
      
				//console.log(on_date);
				//console.log(gens[k]['id']);
				if(typeof(dcdata[i][j]) != 'undefined' && typeof(dcdata[i][j][gens[k]['id']]) != 'undefined')
				{
					gendata.push({dc:dcdata[i][j][gens[k]['id']]['DC'],vc:vcJson[vcDate][gens[k]['id']]});
				}

   			}
   			eachdaydata.push(gendata);

   		}
   		mcp.push(eachdaydata);
   }


   var netdemanddata=[];

   for(let i =0;i<dates.length;i++)
   {
   		var daywisedata=[];

   		for(let j=0;j<96;j++)
   		{
   			daywisedata.push(0);
   		}

   		netdemanddata.push(daywisedata);
   }



   for(let i =0;i<dates.length;i++)
   {

   		for(let j=0;j<optdata[i].length;j++)
   		{
   			for(let k=0;k<optdata[i][j]['optimal'].length;k++)
   			{
   				netdemanddata[i][k] +=optdata[i][j]['optimal'][k];
   			}

   		}

   }

//res.send({mcp:mcp,netdemanddata:netdemanddata});

var dcvcdata=mcp;

var mcparr=[];
var xaxisdata=[];

        for(let i=0;i<dates.length;i++)
        {

          for(let j=0;j<96;j++)
          {

            //xaxisdata.push(dates[i] + ' : ' + (j+1).toString());
            xaxisdata.push((j+1).toString());

            dcvcdata[i][j].sort(function(a, b){return a.vc - b.vc});
            var cumm=0;
            var flag=0;
            if(netdemanddata[i][j]==0)
            {
                mcparr.push(0);
                flag=1;
                continue;
            }

            for(let k=0;k<dcvcdata[i][j].length;k++)
            {
                cumm += Number(dcvcdata[i][j][k]['dc']);
                if(cumm > netdemanddata[i][j])
                {
                  var vcdata=0;
                   if(((cumm - netdemanddata[i][j]) < (netdemanddata[i][j] - (cumm - Number(dcvcdata[i][j][k]['dc'])))) || k==0)
                    {
                      vcdata=dcvcdata[i][j][k]['vc'];
                    }

                    else
                      {
                        vcdata=dcvcdata[i][j][k-1]['vc'];
                      }
                  mcparr.push(Number(vcdata));
                  flag=1;
                  break;
                }

                else if(k==dcvcdata[i][j].length - 1)  //case where netdemand and supply doesnot meet/cut each other
                {
                  mcparr.push(Number(dcvcdata[i][j][k]['vc']));
                  flag=1;
                }
            }

            if(flag==0)
              mcparr.push(0);

          }

        }


        res.send({xaxisdata:xaxisdata,mcparr:mcparr});



  }







  ,
  changes:async function(req,res){
      res.view('trends/changes');
  },
    averageprice:async function(req,res){
      res.view('trends/averagePrice');
  },
  reserves:async function(req,res){
res.view('trends/reserves');
  },
  clamp:async function(req,res){
  	res.view('trends/clamped');
  },
  report:async function(req,res){
  	res.view('trends/report');
  },
  system:async function(req,res){
  	res.view('pages/system');
  }

};

