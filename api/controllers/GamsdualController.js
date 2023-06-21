/**
 * GamsdualController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
getDualTrend:async function(req,res){

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
tt.push("rampUpViolation");
tt.push("rampDownViolation ");
tt.push("atc1");
tt.push("atc2");
final.push(tt);

if(sgen!='ALL' && sgen!='NR' && sgen!='ER' && sgen!='SR' && sgen!='AR' && sgen!='WR'){

for(var d=0;d<sdate.length;d++)

{


var dualdata=await Gamsdual.find({on_date:{'contains':sdate[d]}});


	if(curr_date==sdate[d]){
	curr_block=curr_block1;
}else{
	curr_block=96;
}

for(var i=1;i<=curr_block;i++){
	var on_date;
	if(i!=0)
	 on_date=sdate[d]+":"+(i).toString();
    else
    	 on_date=sdate[d]+":"+(i).toString();
   // console.log(on_date);
	//var gdata = await Gamsdual.find({where:{on_date:on_date}});
	var temp=[];
	//console.log(gdata);
var gdata=[];
for(var l=0;l<dualdata.length;l++){
	if(dualdata[l]['on_date']==on_date){
            gdata.push(dualdata[l]);
            break;
	}
}

	if( typeof(gdata[0])!="undefined" && typeof(gdata[0][sgen])!="undefined")
{	temp.push((i).toString());
	if(typeof(gdata[0][sgen]["dual1"])!="undefined"){
		temp.push(parseFloat(gdata[0][sgen]["dual1"]));
	}else{
		temp.push(0);
	}
		if(typeof(gdata[0][sgen]["dual2"])!="undefined"){
		temp.push(parseFloat(gdata[0][sgen]["dual2"]));
	}else{
		temp.push(0);
	}

		if(typeof(gdata[0][sgen]["dual3"])!="undefined"){
		temp.push(parseFloat(gdata[0][sgen]["dual3"]));
	}else{
		temp.push(0);
	}



		if(typeof(gdata[0][sgen]["dual4"])!="undefined"){
		temp.push(parseFloat(gdata[0][sgen]["dual4"]));
	}else{
		temp.push(0);
	}
	
	//temp.push(parseFloat(gdata[0]['optimal'][i-1])+parseFloat(gdata[0]['scedup'][i-1])-parseFloat(gdata[0]['sceddn'][i-1]));
}else{
		temp.push((i).toString());
		temp.push(0);
		temp.push(0);
		temp.push(0);
		temp.push(0);
	}


final.push(temp);
	
}

}

}else if(sgen=='ALL'){

	for(var i=1;i<curr_block+1;i++){
	var on_date;
	if(i!=0)
	 on_date=sdate+":"+(i).toString();
    else
    	 on_date=sdate+":"+(i).toString();
   // console.log(on_date);
	
	var temp=[];
	//console.log(gdata);
	var gens= await Gen.find({});
	var d1=0;
	var d2=0;
	var d3=0;
	var d4=0;
	var temp=[];
	for(var j=0;j<gens.length;j++)
{	
//console.log(JSON.stringify(gdata[0]));
var gdata = await Gamsdual.find({where:{on_date:on_date}});
	if(typeof(gdata[0])!="undefined"  && typeof(gdata[0][gens[j]['id']])!="undefined")
{	

	if(typeof(gdata[0][gens[j]['id']]["dual1"])!="undefined"){
		d1+=parseFloat(gdata[0][gens[j]['id']]["dual1"]);
	}else{
		d1+=0;
	}
		if(typeof(gdata[0][gens[j]['id']]["dual2"])!="undefined"){
		d2+=parseFloat(gdata[0][gens[j]['id']]["dual2"]);
	}else{
		d2+=0;
	}

		if(typeof(gdata[0][gens[j]['id']]["dual3"])!="undefined"){
		d3+=parseFloat(gdata[0][gens[j]['id']]["dual3"]);
	}else{
	d3+=0;
	}



		if(typeof(gdata[0][gens[j]['id']]["dual4"])!="undefined"){
		d4+=parseFloat(gdata[0][gens[j]['id']]["dual4"]);
	}else{
d4+=0;
	}

	
	//sch+=parseFloat(gdata[0]['sch'][i-1]);
	//opt+=parseFloat(gdata[0]['optimal'][i-1])+parseFloat(gdata[0]['scedup'][i-1])-parseFloat(gdata[0]['sceddn'][i-1]);

}

	else{
		d1+=0;
		d2+=0;
		d3+=0;
		d4+=0;
	}


}
temp.push((i).toString());
temp.push(d1);
temp.push(d2);
temp.push(d3);
temp.push(d4);

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

	for(var i=1;i<curr_block+1;i++){
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
var gdata = await Gamsdual.find({where:{on_date:on_date}});
        if(gens[j]['id'][0]==r)
{	
	if(typeof(gdata[0])!="undefined"  && typeof(gdata[0][gens[j]['id']])!="undefined")
{	

		if(typeof(gdata[0][gens[j]['id']]["dual1"])!="undefined"){
		d1+=parseFloat(gdata[0][gens[j]['id']]["dual1"]);
	}else{
		d1+=0;
	}
		if(typeof(gdata[0][gens[j]['id']]["dual2"])!="undefined"){
		d2+=parseFloat(gdata[0][gens[j]['id']]["dual2"]);
	}else{
		d2+=0;
	}

		if(typeof(gdata[0][gens[j]['id']]["dual3"])!="undefined"){
		d3+=parseFloat(gdata[0][gens[j]['id']]["dual3"]);
	}else{
	d3+=0;
	}



		if(typeof(gdata[0][gens[j]['id']]["dual4"])!="undefined"){
		d4+=parseFloat(gdata[0][gens[j]['id']]["dual4"]);
	}else{
d4+=0;
	}
	//sch+=parseFloat(gdata[0]['sch'][i-1]);
	//sopt+=parseFloat(gdata[0]['optimal'][i-1])+parseFloat(gdata[0]['scedup'][i-1])-parseFloat(gdata[0]['sceddn'][i-1]);

}

	else{
	d1+=0;
	d2+=0;
	d3+=0;
	d4+=0;
}


}
}
temp.push((i).toString());
temp.push(d1);
temp.push(d2);
temp.push(d3);
temp.push(d4);

}
final.push(temp);




}

//console.log(JSON.stringify(final));
res.send(JSON.stringify(final));
},
getDualAll:async function(req,res){

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


	var gens= await Gen.find({});
final={};

for(var v=0;v<gens.length;v++){

		final[gens[v]['id']]={};
		final[gens[v]['id']]['pmax']=0;
		final[gens[v]['id']]['pmin']=0;
		final[gens[v]['id']]['rup']=0;
		final[gens[v]['id']]['rdn']=0;
		final[gens[v]['id']]['crdn']=0;
		final[gens[v]['id']]['crup']=0;
		final[gens[v]['id']]['cpmax']=0;
		final[gens[v]['id']]['cpmin']=0;

}

//console.log(final);


     for(var d=0;d<sdate.length;d++){

        var dualdata=await Gamsdual.find({on_date:{'contains':sdate[d]}});


	if(curr_date==sdate[d]){
	curr_block=curr_block1;
}else{
	curr_block=96;
}


for(var i=1;i<curr_block+1;i++){

	var on_date;
	if(i!=0)
	 on_date=sdate[d]+":"+(i).toString();
    else
    	 on_date=sdate[d]+":"+(i).toString();

    var gdata=[];

    for(var l=0;l<dualdata.length;l++){

    	if(dualdata[l]['on_date']==on_date){
    		gdata.push(dualdata[l]);
    		break;
    	}
    }

 for(var j=0;j<gens.length;j++){



	if(typeof(gdata[0])!="undefined"  && typeof(gdata[0][gens[j]['id']])!="undefined")
{



if(typeof(gdata[0][gens[j]['id']]["dual1"])!="undefined" && gdata[0][gens[j]['id']]["dual1"]!="Eps" ){
		final[gens[j]['id']]['pmax']+=parseInt(gdata[0][gens[j]['id']]["dual1"]);
		if(parseInt(gdata[0][gens[j]['id']]["dual1"])!=0){
			final[gens[j]['id']]['cpmax']+=1;
		}
	}else{
		final[gens[j]['id']]['pmax']+=0;
	}




		if(typeof(gdata[0][gens[j]['id']]["dual2"])!="undefined" && gdata[0][gens[j]['id']]["dual2"]!="Eps"){
		final[gens[j]['id']]['pmin']+=parseInt(gdata[0][gens[j]['id']]["dual2"]);
			if(parseInt(gdata[0][gens[j]['id']]["dual2"])!=0){
			final[gens[j]['id']]['cpmin']+=1;
		}

	}else{
		final[gens[j]['id']]['pmin']+=0;
	}




		if(typeof(gdata[0][gens[j]['id']]["dual3"])!="undefined" && gdata[0][gens[j]['id']]["dual3"]!="Eps"){
		final[gens[j]['id']]['rup']+=parseInt(gdata[0][gens[j]['id']]["dual3"]);


	if(parseInt(gdata[0][gens[j]['id']]["dual3"])!=0){
			final[gens[j]['id']]['crup']+=1;
		}

	}else{
	final[gens[j]['id']]['rup']+=0;
	}



		if(typeof(gdata[0][gens[j]['id']]["dual4"])!="undefined" && gdata[0][gens[j]['id']]["dual4"]!="Eps"){
		final[gens[j]['id']]['rdn']+=parseInt(gdata[0][gens[j]['id']]["dual4"]);
       	if(parseInt(gdata[0][gens[j]['id']]["dual4"])!=0){
			final[gens[j]['id']]['crdn']+=1;
		}


	}else{
final[gens[j]['id']]['rdn']+=0;
	}


}

else{

//console.log(gens[j]['id']);
final[gens[j]['id']]['pmax']+=0;
final[gens[j]['id']]['pmin']+=0;
final[gens[j]['id']]['rup']+=0;
final[gens[j]['id']]['rdn']+=0;

}	




 }

}
			



       

     }


      //console.log(JSON.stringify(final));
     res.send(JSON.stringify(final));


},
duals:async function(req,res){


	res.view('trends/duals');
}

};

