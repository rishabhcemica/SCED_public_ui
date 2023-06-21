/**
 * GamsimplementedController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

getImplemented:async function(req,res){

	

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



      
var final=[];
var tt=[];
tt.push("Generator");
tt.push("Schedule");
tt.push("FeedBack Schedule");
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
	var fdata = await Gamsimplemented.find({where:{id:sdate+sgen}});
	
	var temp=[];
	//console.log(gdata);
	if( typeof(gdata[0])!="undefined"  && typeof(gdata[0]['sch'])!="undefined" && typeof(gdata[0]['optimal'])!="undefined")
{	temp.push((i).toString());
	temp.push(parseFloat(gdata[0]['sch'][i-1])+parseFloat(gdata[0]['scedup'][i-1])-parseFloat(gdata[0]['sceddn'][i-1]));
	temp.push(parseFloat(gdata[0]['sch'][i-1])+parseFloat(fdata[0]['fup'][i-1])-parseFloat(fdata[0]['fdn'][i-1]));
	
	//temp.push(parseFloat(dc[0][sgen]['DC on bar'])*0.55);
}else{
		temp.push((i).toString());
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
	var flobalData=[];
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
	
	var temp=[];
	
	for(var j=0;j<gens.length;j++)
{	
//console.log(JSON.stringify(gdata[0]));
if(i==1)
{

	var gdata = await Gamspwc.find({where:{id:sdate+gens[j]['id']}});
	globalData.push(gdata[0])
var fdata = await Gamsimplemented.find({where:{id:sdate+gens[j]['id']}});
flobalData.push(fdata[0]);

}


	if(typeof(globalData[j])!="undefined" &&  typeof(globalData[j]['sch'])!="undefined" && typeof(globalData[j]['optimal'])!="undefined")
{	

	
	try{
sch+=parseFloat(globalData[j]['sch'][i-1])+parseFloat(globalData[j]['scedup'][i-1])-parseFloat(globalData[j]['sceddn'][i-1]);
  sopt+=parseFloat(globalData[j]['sch'][i-1])+parseFloat(flobalData[j]['fup'][i-1])-parseFloat(flobalData[j]['fdn'][i-1]);
	}
	catch(error){
		sch+=0
		sopt+=0
	}
	


}

	else{
		sch+=0;
		sopt+=0;
	
	}


}
temp.push((i).toString());
temp.push(sch);
temp.push(sopt);


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
   var flobalData=[];
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

	var temp=[];
	
	for(var j=0;j<gens.length;j++)
{	

	if(i==1)
{
	var gdata = await Gamspwc.find({where:{id:sdate+gens[j]['id']}});
	globalData.push(gdata[0]);
var fdata = await Gamsimplemented.find({where:{id:sdate+gens[j]['id']}});
flobalData.push(fdata[0]);

}
        if(gens[j]['id'][0]==r)
{	
	if(typeof(globalData[j])!="undefined" &&   typeof(globalData[j]['sch'])!="undefined" && typeof(globalData[j]['optimal'])!="undefined")
{	

	
	
	sch+=parseFloat(globalData[j]['sch'][i-1])+parseFloat(globalData[j]['scedup'][i-1])-parseFloat(globalData[j]['sceddn'][i-1]);
	sopt+=parseFloat(globalData[j]['sch'][i-1])+parseFloat(flobalData[j]['fup'][i-1])-parseFloat(flobalData[j]['fdn'][i-1]);
	



}

	else{
		sch+=0;
		sopt+=0;
	
	}
}


}
temp.push((i).toString());
temp.push(sch);
temp.push(sopt);


final.push(temp);




}
}
//console.log(JSON.stringify(final));
res.send(JSON.stringify(final));

},
feedback:async function(req,res){
	res.view('trends/feedback');
}
  

};

