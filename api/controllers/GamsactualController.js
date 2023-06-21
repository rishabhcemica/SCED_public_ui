/**
 * GamsactualController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {


	getTodayDataActual:async function(req,res){

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



      
var final=[];
var tt=[];
tt.push("Generator");

tt.push("Optimal Schedule ");
tt.push("Actual");
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
	var adata= await Gamsactual.find({where:{id:sdate+sgen}});
	var temp=[];
	//console.log(gdata);
	if( typeof(gdata[0])!="undefined" && typeof(adata[0])!="undefined" && typeof(gdata[0]['sch'])!="undefined" && typeof(gdata[0]['optimal'])!="undefined")
{	temp.push((i).toString());

	temp.push(parseFloat(gdata[0]['sch'][i-1])+parseFloat(gdata[0]['scedup'][i-1])-parseFloat(gdata[0]['sceddn'][i-1]));
		temp.push(parseFloat(adata[0]['actual'][i-1]));
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
	var alobalData=[];

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
   
   globalData.push(gdata[0]);

var adata = await Gamsactual.find({where:{id:sdate+gens[j]['id']}});

alobalData.push(adata[0]);
}

	//console.log(JSON.stringify(gdata));

	if(typeof(globalData[j])!="undefined" &&  typeof(alobalData[j])!="undefined" && typeof(globalData[j]['sch'])!="undefined" && typeof(globalData[j]['optimal'])!="undefined")
{	

	
	sopt+=parseFloat(alobalData[j]['actual'][i-1]);
	sch+=parseFloat(globalData[j]['sch'][i-1])+parseFloat(globalData[j]['scedup'][i-1])-parseFloat(globalData[j]['sceddn'][i-1]);
    

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
     var alobalData=[];


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
var adata = await Gamsactual.find({where:{id:sdate+gens[j]['id']}});

alobalData.push(adata[0]);


}
        if(gens[j]['id'][0]==r)
{	
	if(typeof(globalData[j])!="undefined" &&  typeof(alobalData[j])!="undefined"  && typeof(globalData[j]['sch'])!="undefined" && typeof(globalData[j]['optimal'])!="undefined")
{	

	
	sopt+=parseFloat(alobalData[j]['actual'][i-1]);
	sch+=parseFloat(globalData[j]['sch'][i-1])+parseFloat(globalData[j]['scedup'][i-1])-parseFloat(globalData[j]['sceddn'][i-1]);
	
    


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

getTodayDataDateActual:async function(req,res){

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
      
var final=[];
var tt=[];
tt.push("Generator");

tt.push("Optimal Schedule ");
tt.push("Actual");
final.push(tt);

if(sgen!='ALL' && sgen!='NR' && sgen!='ER' && sgen!='SR' && sgen!='AR' && sgen!='WR'){
for(var d=0;d<sdate.length;d++)
{	
	if(curr_date!=sdate[d]){
	curr_block=96;
}else{
	curr_block=curr_block1;
}


var globalData=[];
var alobalData=[];

for(var i=1;i<=curr_block;i++){
	var on_date;
	if(i!=0)
	 on_date=sdate[d]+":"+(i).toString();
    else
    	 on_date=sdate[d]+":"+(i).toString();
   // console.log(on_date);
   if(i==1)
{	var gdata = await Gamspwc.find({where:{id:sdate[d]+sgen}});
      
      globalData.push(gdata[0]);
	var adata = await Gamsactual.find({where:{id:sdate[d]+sgen}});

	alobalData.push(adata[0]);


}
	var temp=[];
	//console.log(gdata);
	if( typeof(globalData[0])!="undefined" && typeof(alobalData[0])!="undefined"   && typeof(globalData[0]['sch'])!="undefined" && typeof(globalData[0]['optimal'])!="undefined")
{	temp.push((i).toString());
	
	temp.push(parseFloat(globalData[0]['optimal'][i-1]));
	temp.push(parseFloat(alobalData[0]['actual'][i-1]));
}else{
		temp.push((i).toString());
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

var globalData=[];
var alobalData=[];

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
	
	var temp=[];

	for(var j=0;j<gens.length;j++)
{	
//console.log(JSON.stringify(gdata[0]));

if(i==1){
var gdata = await Gamspwc.find({where:{id:sdate[d]+gens[j]['id']}});
var adata = await Gamsactual.find({where:{id:sdate[d]+gens[j]['id']}});

globalData.push(gdata[0]);
alobalData.push(adata[0]);
}

//console.log(JSON.stringify(adata));
	if(typeof(globalData[j])!="undefined"  && typeof(alobalData[j])!="undefined"  && typeof(globalData[j]['sch'])!="undefined" && typeof(globalData[j]['optimal'])!="undefined")
{	

	//console.log(parseFloat(gdata[0]['actual'][i-1]));
	sopt+=parseFloat(alobalData[j]['actual'][i-1]);
	sch+=parseFloat(globalData[j]['sch'][i-1])+parseFloat(globalData[j]['scedup'][i-1])-parseFloat(globalData[j]['sceddn'][i-1]);
   


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
	if(curr_date!=sdate[d]){
	curr_block=96;
}else{
curr_block=curr_block1;
}


var globalData=[];
var alobalData=[];

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

	var temp=[];

	for(var j=0;j<gens.length;j++)
{

if(i==1)	
{


var gdata = await Gamspwc.find({where:{id:sdate[d]+gens[j]['id']}});

globalData.push(gdata[0]);
var adata = await Gamsactual.find({where:{id:sdate[d]+gens[j]['id']}});
alobalData.push(adata[0]);

}


        if(gens[j]['id'][0]==r)
{	
	if(typeof(globalData[j])!="undefined"  && typeof(alobalData[j])!="undefined"  && typeof(globalData[j]['sch'])!="undefined" && typeof(globalData[j]['optimal'])!="undefined")
{	

	
	sopt+=parseFloat(alobalData[j]['actual'][i-1]);
	sch+=parseFloat(globalData[j]['sch'][i-1])+parseFloat(globalData[j]['scedup'][i-1])-parseFloat(globalData[j]['sceddn'][i-1]);
 


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
}
//console.log(JSON.stringify(final));
res.send(JSON.stringify(final));

},
actual:async function(req,res){
	res.view('trends/actual');
}
  

};

