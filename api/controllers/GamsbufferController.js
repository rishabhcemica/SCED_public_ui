/**
 * GamsbufferController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
	getOverallBuffer:async function(req,res){

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
     var curr_block1=curr_block;

var artMap={};
for(var d=0;d<dates.length;d++){
//var dctotalval=await Gamsopt.find({on_date:{'contains':dates[d]}});
	var gdata = await Gamsbuffer.find({on_date:{'contains':dates[d]}});
	for(var b=0;b<gdata.length;b++){
		artMap[gdata[b]['on_date']]=gdata[b];
	}

}

curr_block=96;
var gens= await Gen.find({});
var finalMap={};

for(var g=0;g<gens.length;g++)
{	

	finalMap[gens[g]['id']]={'rupcount':0,'rdowncount':0,'rup':0,'rdn':0};

	for(var d=0;d<dates.length;d++){

		if(curr_date!=dates[d]){
			curr_block=96;
		}else{
			curr_block=curr_block1;
		}


		for(var block=1;block<=curr_block;block++){



      	if( typeof(artMap[dates[d]+":"+block.toString()])!="undefined" && typeof(artMap[dates[d]+":"+block.toString()][gens[g]['id']])!="undefined")
{	
	
		if(typeof(artMap[dates[d]+":"+block.toString()][gens[g]['id']]["artRampUp"])!="undefined" && parseInt(artMap[dates[d]+":"+block.toString()][gens[g]['id']]["artRampUp"])){
		//temp.push(parseFloat(gdata[0][sgen]["artRampUp"]));
		finalMap[gens[g]['id']]['rupcount']+=1;
		finalMap[gens[g]['id']]['rup']+=parseInt(artMap[dates[d]+":"+block.toString()][gens[g]['id']]["artRampUp"]);
	}else{
		finalMap[gens[g]['id']]['rupcount']+=0;
		finalMap[gens[g]['id']]['rup']+=0;
		
	}

		if(typeof(artMap[dates[d]+":"+block.toString()][gens[g]['id']]["artRampDown"])!="undefined" && parseInt(artMap[dates[d]+":"+block.toString()][gens[g]['id']]["artRampDown"])!=0){
			//console.log(artMap[dates[d]+":"+block.toString()][gens[g]['id']]["artRampDown"])
		finalMap[gens[g]['id']]['rdowncount']+=1;
		finalMap[gens[g]['id']]['rdn']+=parseInt(artMap[dates[d]+":"+block.toString()][gens[g]['id']]["artRampDown"]);
	}else{
		finalMap[gens[g]['id']]['rdowncount']+=0;
		finalMap[gens[g]['id']]['rdn']+=0;
	}







	// 	if(typeof(gdata[0][sgen]["dual4"])!="undefined"){
	// 	temp.push(parseFloat(gdata[0][sgen]["dual4"]));
	// }else{
	// 	temp.push(0);
	// }
	
	//temp.push(parseFloat(gdata[0]['optimal'][i-1])+parseFloat(gdata[0]['scedup'][i-1])-parseFloat(gdata[0]['sceddn'][i-1]));
}else{
	
		finalMap[gens[g]['id']]['rupcount']+=0;
		finalMap[gens[g]['id']]['rup']+=0;
			finalMap[gens[g]['id']]['rdowncount']+=0;
		finalMap[gens[g]['id']]['rdn']+=0;
	
	
	}





		}

	}

}


res.send(JSON.stringify(finalMap));

	},
  getBufferTrend:async function(req,res){

var sdate=req.allParams()['selectedDate'];
var sgen=req.allParams()['selectedGen'];
//var flag=req.allParams()['flag'];

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


     var final=[];
var tt=[];
tt.push("Generator");
tt.push("Schedule");
tt.push("Ramp Up");
tt.push("Ramp Down");

tt.push("NR IR");
tt.push("SR IR");
tt.push("NER IR");

final.push(tt);

if(sgen!='ALL' && sgen!='NR' && sgen!='ER' && sgen!='SR' && sgen!='AR' && sgen!='WR'){

for(var d=0;d<sdate.length;d++)

{

	if(curr_date!=sdate[d]){
	curr_block=96;
}else{
	curr_block=curr_block1;
}


	for(var i=1;i<=curr_block;i++){

	var on_date;
	if(i!=0)
	 on_date=sdate[d]+":"+(i).toString();
    else
    	 on_date=sdate[d]+":"+(i).toString();
   // console.log(on_date);
	var gdata = await Gamsbuffer.find({where:{on_date:on_date}});
	var temp=[];
	//console.log(gdata);
	if( typeof(gdata[0])!="undefined" && typeof(gdata[0][sgen])!="undefined")
{	temp.push((i).toString());
	if(typeof(gdata[0][sgen]["artSched"])!="undefined"){
		temp.push(parseFloat(gdata[0][sgen]["artSched"]));
	}else{
		temp.push(0);
	}
		if(typeof(gdata[0][sgen]["artRampUp"])!="undefined"){
		temp.push(parseFloat(gdata[0][sgen]["artRampUp"]));
	}else{
		temp.push(0);
	}

		if(typeof(gdata[0][sgen]["artRampDown"])!="undefined"){
		temp.push(parseFloat(gdata[0][sgen]["artRampDown"]));
	}else{
		temp.push(0);
	}



if(typeof(gdata[0][sgen]["N"])!="undefined"){
		temp.push(parseFloat(gdata[0][sgen]["N"]));
	}else{
		temp.push(0);
	}
		if(typeof(gdata[0][sgen]["S"])!="undefined"){
		temp.push(parseFloat(gdata[0][sgen]["S"]));
	}else{
		temp.push(0);
	}

		if(typeof(gdata[0][sgen]["NE"])!="undefined"){
		temp.push(parseFloat(gdata[0][sgen]["NE"]));
	}else{
		temp.push(0);
	}
	




	// 	if(typeof(gdata[0][sgen]["dual4"])!="undefined"){
	// 	temp.push(parseFloat(gdata[0][sgen]["dual4"]));
	// }else{
	// 	temp.push(0);
	// }
	
	//temp.push(parseFloat(gdata[0]['optimal'][i-1])+parseFloat(gdata[0]['scedup'][i-1])-parseFloat(gdata[0]['sceddn'][i-1]));
}else{
		temp.push(sdate[d]+":"+(i).toString());
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


   var bufferdata=await Gamsbuffer.find({on_date:{'contains':sdate[d]}});


if(curr_date!=sdate[d]){
	curr_block=96;
}else{
	curr_block=curr_block1;
}


	for(var i=1;i<curr_block+1;i++){

		
	var on_date;
	if(i!=0)
	 on_date=sdate[d]+":"+(i).toString();
    else
    	 on_date=sdate[d]+":"+(i).toString();

   // console.log(on_date);
   var gdata;
   for(var l=0;l<bufferdata.length;l++){

   		if(bufferdata[l]["on_date"]==on_date){
   			gdata=bufferdata[l];
   			break;
   		}

   }
	
	var temp=[];
	//console.log(gdata);
	var gens= await Gen.find({});
	var d1=0;
	var d2=0;
	var d3=0;
	var d4=0;
	var d5=0;
	var d6=0;

	var temp=[];
	for(var j=0;j<gens.length;j++)
{	
//console.log(JSON.stringify(gdata[0]));
//var gdata = await Gamsbuffer.find({where:{on_date:on_date}});
	if(typeof(gdata)!="undefined"  && typeof(gdata[gens[j]['id']])!="undefined")
{	

	if(typeof(gdata[gens[j]['id']]["artSched"])!="undefined"){
		d1+=parseFloat(gdata[gens[j]['id']]["artSched"]);
	}else{
		d1+=0;
	}
		if(typeof(gdata[gens[j]['id']]["artRampUp"])!="undefined"){
		d2+=parseFloat(gdata[gens[j]['id']]["artRampUp"]);
		//console.log(d2);
	}else{
		d2+=0;
	}

		if(typeof(gdata[gens[j]['id']]["artRampDown"])!="undefined"){
		d3+=parseFloat(gdata[gens[j]['id']]["artRampDown"]);
	}else{
	d3+=0;
	}


	if(typeof(gdata[gens[j]['id']]["N"])!="undefined"){
		d4+=parseFloat(gdata[gens[j]['id']]["N"]);
	}else{
		d4+=0;
	}
		if(typeof(gdata[gens[j]['id']]["S"])!="undefined"){
		d5+=parseFloat(gdata[gens[j]['id']]["S"]);
		//console.log(d2);
	}else{
		d5+=0;
	}

		if(typeof(gdata[gens[j]['id']]["NE"])!="undefined"){
		d6+=parseFloat(gdata[gens[j]['id']]["NE"]);
	}else{
	d6+=0;
	}



// 		if(typeof(gdata[0][gens[j]['id']]["dual4"])!="undefined"){
// 		d4+=parseFloat(gdata[0][gens[j]['id']]["dual4"]);
// 	}else{
// d4+=0;
// 	}

	
	//sch+=parseFloat(gdata[0]['sch'][i-1]);
	//opt+=parseFloat(gdata[0]['optimal'][i-1])+parseFloat(gdata[0]['scedup'][i-1])-parseFloat(gdata[0]['sceddn'][i-1]);

}

	else{
		d1+=0;
		d2+=0;
		d3+=0;

		d4+=0;
		d5+=0;
		d6+=0;
		
	}


}
temp.push(sdate[d]+":"+(i).toString());
temp.push(d1);
temp.push(d2);
temp.push(d3);

temp.push(d4);
temp.push(d5);
temp.push(d6);


final.push(temp);
	
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

	var bufferdata=await Gamsbuffer.find({on_date:{'contains':sdate[d]}});


  
if(curr_date!=sdate[d]){
	curr_block=96;
}else{
	curr_block=curr_block1;
}

	for(var i=1;i<curr_block;i++){
	var on_date;
	if(i!=0)
	 on_date=sdate[d]+":"+(i).toString();
    else
    	 on_date=sdate[d]+":"+(i).toString();
   // console.log(on_date);


      var gdata;
   for(var l=0;l<bufferdata.length;l++){

   		if(bufferdata[l]["on_date"]==on_date){
   			gdata=bufferdata[l];
   			break;
   		}

   }

	
	var temp=[];
	//console.log(gdata);
	var gens= await Gen.find({});
	var sopt=0;
	var sch=0;
	var d1=0;
	var d2=0;
	var d3=0;
		var d4=0;
	var d5=0;
	var d6=0;

	var temp=[];
	for(var j=0;j<gens.length;j++)
{	
//var gdata = await Gamsbuffer.find({where:{on_date:on_date}});
        if(gens[j]['id'][0]==r)
{	
	if(typeof(gdata)!="undefined"  && typeof(gdata[gens[j]['id']])!="undefined")
{	

		if(typeof(gdata[gens[j]['id']]["artSched"])!="undefined"){
		d1+=parseFloat(gdata[gens[j]['id']]["artSched"]);
	}else{
		d1+=0;
	}
		if(typeof(gdata[gens[j]['id']]["artRampUp"])!="undefined"){
		d2+=parseFloat(gdata[gens[j]['id']]["artRampUp"]);
	}else{
		d2+=0;
	}

		if(typeof(gdata[gens[j]['id']]["artRampDown"])!="undefined"){
		d3+=parseFloat(gdata[gens[j]['id']]["artRampDown"]);
	}else{
	d3+=0;
	}




	if(typeof(gdata[gens[j]['id']]["N"])!="undefined"){
		d4+=parseFloat(gdata[gens[j]['id']]["N"]);
	}else{
		d4+=0;
	}
		if(typeof(gdata[gens[j]['id']]["S"])!="undefined"){
		d5+=parseFloat(gdata[gens[j]['id']]["S"]);
		//console.log(d2);
	}else{
		d5+=0;
	}

		if(typeof(gdata[gens[j]['id']]["NE"])!="undefined"){
		d6+=parseFloat(gdata[gens[j]['id']]["NE"]);
	}else{
	d6+=0;
	}



// 		if(typeof(gdata[0][gens[j]['id']]["dual4"])!="undefined"){
// 		d4+=parseFloat(gdata[0][gens[j]['id']]["dual4"]);
// 	}else{
// d4+=0;
// 	}
	//sch+=parseFloat(gdata[0]['sch'][i-1]);
	//sopt+=parseFloat(gdata[0]['optimal'][i-1])+parseFloat(gdata[0]['scedup'][i-1])-parseFloat(gdata[0]['sceddn'][i-1]);

}

	else{
	d1+=0;
	d2+=0;
	d3+=0;
 
   	d4+=0;
		d5+=0;
		d6+=0;


}


}


}

temp.push(sdate[d]+":"+(i).toString());
temp.push(d1);
temp.push(d2);
temp.push(d3);

temp.push(d4);
temp.push(d5);
temp.push(d6);
final.push(temp);

}
}

}

//console.log(JSON.stringify(final));
res.send(JSON.stringify(final));
},
totalBuffers:async function(req,res){
	var sdate=req.allParams()['selectedDate'];
	var bufferdata=await Gamsbuffer.find({on_date:{'contains':sdate}});

	res.send(JSON.stringify(bufferdata));


},
buffers:async function(req,res){


	res.view('trends/buffers');
}

};

