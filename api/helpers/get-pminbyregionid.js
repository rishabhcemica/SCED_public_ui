module.exports = {


  friendlyName: 'Get pminbyregionid',


  description: 'this helper is to get DC-offbar i.e cold resrve (DC-DC_onbar) using regionid',


  inputs: {

    dates: {
      type: "ref",
      required: true,
      value: ""
    },
    region_id: {
      type: 'number',
      required: true,
      value: ""
    }

  },



  exits: {

    success: {
      outputFriendlyName: 'Pminbyregionid',
    },

  },


  fn: async function (inputs, exits) {

    // Get pminbyregionid.
    var pminbyregionid = [];
    // TODO
    const axios = require('axios');
    let months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

    for (var i = 0; i < inputs.dates.length; i++) {
      var dte = inputs.dates[i].split('-');
      dte[1] = months[parseInt(dte[1]) - 1];
      var d8 = dte.join('-');

      var url = "http://10.5.134.44/pwcapi/techminregionwise.php?sdate=" + d8 + "&region_id=" + inputs.region_id;
      await axios.get(url)
        .then(res => {
          console.log('inside then');




          let data = res.data;
          let tempdata = new Array(96).fill(0);
          // console.log(data);
          //console.log('tempdata initially',tempdata);
          //finalD.push(data);
          for (var key in data) {
            data.hasOwnProperty(key)
            {
              let actdata = data[key]['OFFBAR'].split(',');
              //console.log("actdata",actdata);
              for (var j = 0; j < tempdata.length; j++) {
                tempdata[j] = tempdata[j] + parseFloat(actdata[j]);
              }
              //console.log('tempdata after',tempdata);
            }
          }
          let tempobj = {};
          tempobj[inputs.region_id] = { 'OFFBAR': tempdata.join(',') };
          pminbyregionid.push({ date: d8, data: tempobj });









          //pminbyregionid.push(res.data);
        })
        .catch(err => {
          console.log(err);
        });


    }






    // Send back the result through the success exit.
    return exits.success(pminbyregionid);
  }


};

