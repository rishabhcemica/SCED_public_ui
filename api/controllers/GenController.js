/**
 * GenController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = { 
  diagnostics: async function (req, res) {

    // req.allParams()['fromDate'];
    // req.allParams()['toDate'];
    let fromDate = req.allParams()['fromDate'];
    let toDate = req.allParams()['toDate']; //25-05-2021

    console.log(toDate)

    let scedexclude = await Dailylog.find({
      where: {
        dateStr: {
          '<=': new Date(toDate),
          '>=': new Date(fromDate)
        }
      }
    });

    res.send(JSON.stringify(scedexclude))

  },
  getallgen:async function(req,res){
      var gens=await Gen.find({});
      var genl=[];
      for(var i=0;i<gens.length;i++){
      	genl.push({'id':gens[i]['id']});
      	genl[i]['name']=gens[i]['genname'];
      }
res.send(JSON.stringify(genl));

  },
  getRnaught: async function(req,res){

let startdate =req.allParams()['startdate']
let enddate = req.allParams()['enddate']

let seletedval = req.allParams()['selectedGen']
console.log("rnaught")



let runPy = new Promise(function(success, nosuccess) {

    const { spawn } = require('child_process');
    const pyprog = spawn('python', ["E:/gams/rnaught.py", startdate, enddate,seletedval]);

    pyprog.stdout.on('data', function(data) {

        success(data);
    });

    pyprog.stderr.on('data', (data) => {

        nosuccess(data);
    });
});

  runPy.then(function(fromRunpy) {
        //console.log(fromRunpy.toString());
        res.end(fromRunpy);
    });




// const spawn = require("child_process").spawn;

// const pythonProcess = spawn('python',["D:/gams/rnaught.py", startdate, enddate,seletedval]);

// pythonProcess.stdout.on('data', (data) => {
//     // Do something with the data returned from python script
//     //console.log(data)
//     res.write(data)
//     res.end('end')
// });


},

rrasPunchedVal: async function(req,res){

let dates = req.allParams()['selectedDate']
let pat = req.allParams()['selectedGen']

let punchedVal =  await Rraspunched.find({where:{datestr:{'<=':  new Date(dates[dates.length-1].split("-").reverse().join("-") ),
     '>=':  new Date(dates[0].split("-").reverse().join("-") ) }}}).sort('id DESC');

let rras = await Rraspwc.find({where:{dateString:{'<=':  new Date(dates[dates.length-1].split("-").reverse().join("-") ),
     '>=':  new Date(dates[0].split("-").reverse().join("-") ) }}}).sort('id DESC');


let final={'punch':new Array(96).fill(0),'rrasup':new Array(96).fill(0),'rrasdn':new Array(96).fill(0)}


//console.log("rras",rras)

for(let i=0;i<punchedVal.length;i++){
for(let j=0;j<punchedVal[i]["punched"].length;j++){
  final['punch'][j]=final['punch'][j]+parseInt(punchedVal[i]["punched"][j])
}
}

let year = dates[0].split("-")[2]
pat = pat == "ALL" ? year+"6" : (pat=="NR" ? year+"3":(pat=="NER" ? year+"2":(pat=="WR"?year+"5":(pat=="SR"?year+"4":(pat=="ER"?year+"1":pat))))) 

for(let i=0;i<rras.length;i++){
  if(rras[i]['id'].includes(pat)){
    for(let j=0;j<rras[i]['rrasup'].length;j++){
      final['rrasup'][j]=final['rrasup'][j]+parseInt(rras[i]['rrasup'][j])
    }
      for(let j=0;j<rras[i]['rrasdn'].length;j++){
      final['rrasdn'][j]=final['rrasdn'][j]+parseInt(rras[i]['rrasdn'][j])
    }
  }

}




for(let i=0;i<final["punch"].length;i++){
  final["punch"][i] = parseInt(final["punch"][i]/dates.length)
}
for(let i=0;i<final["rrasup"].length;i++){
  final["rrasup"][i] = parseInt(final["rrasup"][i]/dates.length)
}
for(let i=0;i<final["rrasdn"].length;i++){
  final["rrasdn"][i] = parseInt(final["rrasdn"][i]/dates.length)
}

res.send(JSON.stringify(final))

}

};

