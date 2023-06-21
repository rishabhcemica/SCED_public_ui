/**
 * ExcludedgenController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
  getEmergency:async function(req,res){

      var curr_date=new Date();
      curr_date.setHours(curr_date.getHours()+5);
      curr_date.setMinutes(curr_date.getMinutes()+30);
      curr_date= curr_date.toISOString().slice(0,10);
      var curr_date1=new Date();
      var hh=curr_date1.getHours();
      var mm=curr_date1.getMinutes();
      curr_date=curr_date.split("-").join("-");

      let emerstop = await Estop.find({'id':{'<=':new Date(curr_date)}}).sort('id DESC');

      data=[0,0,0,0,0]

      //console.log(emerstop[0])

      if((emerstop[0])!=undefined){
          data = emerstop[0]['stop']
      }

      res.send(JSON.stringify(data));


  },

  putEmergency:async function(req,res){

        let stop = req.allParams()['data']
        var curr_date=new Date();
        curr_date.setHours(curr_date.getHours()+5);
        curr_date.setMinutes(curr_date.getMinutes()+30);
        curr_date= curr_date.toISOString().slice(0,10);
        var curr_date1=new Date();
        var hh=curr_date1.getHours();
        var mm=curr_date1.getMinutes();
        curr_date=curr_date.split("-").reverse().join("-");

        //console.log(curr_date)
        await Estop.destroy({'id':new Date(curr_date.split("-")[2]+"-"+curr_date.split("-")[1]+"-"+curr_date.split("-")[0]).toISOString()})
        await Estop.create({'id':new Date(curr_date.split("-")[2]+"-"+curr_date.split("-")[1]+"-"+curr_date.split("-")[0]).toISOString(),'stop':stop})

        res.send(true);

  },

//============================================================================================================
//============================================================================================================
  parmanentExclude:async function(req,res){
        var x;

        console.log("From controller");

        var pex = await Permanentex.find({});

        var genlist = await Gen.find({});

        var gen_name = [];
        x = pex[0]['sced'];

        for(var i=0;i<x.length;i++){
          for (var j=0;j<genlist.length;j++){
            if(genlist[j]['id'] == x[i]){
              gen_name.push(genlist[j]['genname'])
            }
          }
        }

        //console.log(gen_name);

        res.send(JSON.stringify(gen_name));        
  },

//============================================================================================================
//============================================================================================================


  getExcludedGen:async function(req,res){

        var x;
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

        var exludeones=await Excludedgen.find({});
        if(typeof(exludeones[0])!='undefined'){

            x=exludeones[0]["gens"];

        }else{

            x=['9999']  ;
        }

        res.send(JSON.stringify(x));

        
  },

  putExcludedGen:async function(req,res){
        var selected=req.allParams()['selectedgen'];
        var allselected=[];

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

        if(typeof(selected)=='undefined'){
            allselected.push('9999');
            selected=allselected;
        }
        var data={gens:selected};
        var exludeones=await Excludedgen.find({});
        if(typeof(exludeones[0])!='undefined'){
            var update=await Excludedgen.destroy({});
            var ex=await Excludedgen.create(data).fetch();

        }else{
            var ex=await Excludedgen.create(data).fetch();
        //console.log(ex);  
        }


        res.send({label:"success"});

  },


  excludeview:async  function(req,res){
        res.view('exclude/excludegen');
  },


  startSCED:async function(req,res){

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



      var exludeones=await Excludedgen.find({});
      if(typeof(exludeones[0])!='undefined'){
          var update=await Excludedgen.destroy({});

      }


      res.send({label:"success"});


  }
,
  stopSCED:async function(req,res){
      
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

      var gens=await Gen.find({});
      var genlist=[];
      for(var i=0;i<gens.length;i++){
          genlist.push(gens[i]['id']);
      }

      var data={block:curr_date,gens:genlist};
      var exludeones=await Excludedgen.find({block:curr_date});
      if(typeof(exludeones[0])!='undefined'){
          var update=await Excludedgen.update({block:curr_date}).set({gens:genlist});

      }else{
          var update=await Excludedgen.destroy({});
          var ex=await Excludedgen.create(data).fetch();
      //console.log(ex);  
      }

      res.send({label:"success"});

  },



//====================================================================================
//=====================SCED RRAS Exclude hist API=====================================
sced_rras_ExcludeHist:async function(req,res){
      
      var get_date = req.allParams()['date'];
      console.log(get_date)
     

      let select_date = get_date
      

      var excludehist = await Excludehist.find({'on_date':select_date})
      //console.log(excludehist[0])

      var scedexcludehist = await Scedexcludehist.find({'on_date':select_date})
      //console.log(scedexcludehist[0])
       
      var data = {};
      var scedarray = [];
      var rrasarray = [];

      var genlist = await Gen.find({});

      var count = 0;
      for (item in excludehist[0]["data"]){
        //console.log(item);
        var gen_name;
        for (var j=0;j<genlist.length;j++){
            if(genlist[j]['id'] == item){
              gen_name = genlist[j]['genname'];
            }
        }
        rrasarray[count] = [];
        rrasarray[count].push(gen_name);
        rrasarray[count].push(...excludehist[0]["data"][item]);
        count+=1
      }

      count = 0;
      for (item in scedexcludehist[0]["data"]){
        //console.log(item);
        var gen_name;
        for (var j=0;j<genlist.length;j++){
            if(genlist[j]['id'] == item){
              gen_name = genlist[j]['genname'];
            }
        }
        scedarray[count] = [];
        scedarray[count].push(gen_name);
        scedarray[count].push(...scedexcludehist[0]["data"][item]);
        count+=1
      }

      data['sced'] = scedarray;
      data['rras'] = rrasarray;
      
      res.send(JSON.stringify(data));

  }

//====================================================================================
//====================================================================================


};

