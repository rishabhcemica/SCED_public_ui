module.exports = {


  friendlyName: 'Feedback',


  description: 'Feedback something.',


  fn: async function () {

var month_names =["Jan","Feb","Mar",
                      "Apr","May","Jun",
                      "Jul","Aug","Sep",
                      "Oct","Nov","Dec"];

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
      var mon=parseInt(curr_date.split("-")[1])-1;
      var vcDate=curr_date.split("-")[0]+"-"+month_names[mon]+"-"+curr_date.split("-")[2];

      var feedback=await sails.helpers.getFeedback.with({sdate:vcDate});
      feedback=JSON.parse(feedback);
      var arr=[];
      for(var i=0;i<96;i++){
      	arr.push(0);
      }
      var gens=await Gen.find({});

      if(curr_block==1){
      	for(var i=0;i<gens.length;i++){
      		var scedup;
      		var sceddn;
      		if(parseInt(feedback[gens[i]['id']]['SUP'].split(",")[curr_block-1])>0){
      			var temp;
      			temp=arr;
      			temp[curr_block-1]=parseFloat(feedback[gens[i]['id']]['SUP'].split(",")[curr_block-1]);
             scedup=temp;
             sceddn=arr;
      		}else{

      				var temp;
      			temp=arr;
      			temp[curr_block-1]=parseFloat(feedback[gens[i]['id']]['SDN'].split(",")[curr_block-1]);
             sceddn=temp;
             scedup=arr;

      		}
      		await Gamsimplemented.create({"id":curr_date.toString()+gens[i]['id'].toString(),fup:scedup,fdn:sceddn});
            

      	}

      }else{

      	   	for(var i=0;i<gens.length;i++){
      	   	
      		var scedup;
      		var sceddn;
      		var gfeedback=await Gamsimplemented.find({'_id':curr_date+gens[i]['id']});
      	


      		if(typeof(gfeedback[0])!="undefined")
      	{	
      		
      			scedup=gfeedback[0]['fup'];
      		sceddn=gfeedback[0]['fdn'];
      		if(parseInt(feedback[gens[i]['id']]['SUP'].split(",")[curr_block-1])>0){
      	      			
      	             scedup[curr_block-1]=parseFloat(feedback[gens[i]['id']]['SUP'].split(",")[curr_block-1]);
      	             
      	      		}else{
      	
      	      		
      	             sceddn[curr_block-1]=parseFloat(feedback[gens[i]['id']]['SDN'].split(",")[curr_block-1]);
      	          
      	
      	      		}
      	      		await Gamsimplemented.update({"id":curr_date+gens[i]['id']}).set({fup:scedup,fdn:sceddn});
      	            
                 if(gens[i]['id']=='4031'){
                 	console.log(feedback[gens[i]['id']]['SDN'].split(","));
                 	console.log(JSON.stringify(sceddn));
                 }
      	            }else{



      		if(parseInt(feedback[gens[i]['id']]['SUP'].split(",")[curr_block-1])>0){
      			var temp;
      			temp=arr;
      			temp[curr_block-1]=parseFloat(feedback[gens[i]['id']]['SUP'].split(",")[curr_block-1]);
             scedup=temp;
             sceddn=arr;
      		}else{

      				var temp;
      			temp=arr;
      			temp[curr_block-1]=parseFloat(feedback[gens[i]['id']]['SDN'].split(",")[curr_block-1]);
             sceddn=temp;
             scedup=arr;

      		}
      		var x=curr_date.toString()+gens[i]['id'].toString();
      		await Gamsimplemented.create({"id":x,fup:scedup,fdn:sceddn});



      	            }

      	}


      }

   // sails.log('Running custom shell script... (`sails run feedback`)');

  }


};

