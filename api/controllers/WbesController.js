/**
 * WbesController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  

getGenSchedule: async function(req,res){


let dt = req.allParams()['fromdate']

let region = req.allParams()['region']


let schdata =  await Gendata.find({'id':dt})
let ipp=[]
let isgs=[]

let schedules = schdata[0][region+"_"+"GEN"]

const isEmpty = inputObject => {
  return Object.keys(inputObject).length === 0;
};

for(let key in schedules ){
if(isEmpty(schedules[key]["declaredList"])){
	ipp.push({"gen":key,"val":schedules[key]})
}else{
	isgs.push({"gen":key,"val":schedules[key]})
}

}
//a.sort((a,b)=> (a.name > b.name ? 1 : -1))

isgs.sort((a,b) => (a.gen > b.gen? 1 : -1));
ipp.sort((a,b) => (a.gen > b.gen? 1 : -1));

//res.send(schdata[0][region+"_"+"GEN"])
res.send({"isgs":isgs,"ipp":ipp,"rev":(schdata[0][region+"_"+"REV"])})



}


};

