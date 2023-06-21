module.exports = {


  friendlyName: 'Get pminbygenid',


  description: 'this helper is to get DC-offbar i.e cold resrve (DC-DC_onbar)',


  inputs: {

    dates: {
      type: "ref",
      required: true,
      value: ""
    },
    genid: {
      type: "string",
      required: true,
      value: ""
    }

  },


  exits: {

    success: {
      outputFriendlyName: 'Pminbygenid',
    },

  },


  fn: async function (inputs, exits) {

    // Get pminbygenid.
    var pminbygenid = [];
    let max_batchlength = 80;
    let i = 0;
    while (i < inputs.dates.length) {
      let temp = max_batchlength < (inputs.dates.length - i) ? max_batchlength : (inputs.dates.length - i);
      let daata = await getdata(temp, i, inputs, pminbygenid);
      //pminbygenid.push(...daata);
      i = i + max_batchlength;

    }



    pminbygenid.sort(function (a, b) {
      return a['date'].localeCompare(b['date']);
    });

    console.log('sorting');
    //console.log(exits);
    return exits.success(pminbygenid);






  }

};


function getdata(max_batchlength, i, inputs, pminbygenid) {
  let months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  return new Promise((resolve, reject) => {

    let count = 0;
    const axios = require('axios');
    for (let j = 0; j < max_batchlength; i++, j++) {
      var dte = inputs.dates[i].split('-');
      dte[1] = months[parseInt(dte[1]) - 1];
      var d8 = dte.join('-');




      var url = "http://10.5.134.44/pwcapi/techminnew.php?sdate=" + d8 + "&genid='" + inputs.genid + "'";
      //console.log(url);
      axios.get(url).then(retn => {
        if (!retn.data[inputs.genid])
          reject('error')


        var splitd8 = retn.data[inputs.genid]['EFFECTIVE_FOR_DATE'].split('-');
        var mm = (months.findIndex(ele => ele == splitd8[1]) + 1);
        mm = mm < 10 ? ('0' + mm) : mm.toString();
        var newd8 = splitd8[2] + '-' + mm + '-' + splitd8[0];
        pminbygenid.push({ date: newd8, data: retn.data });
        count++;
        //console.log('count is:',count);
        if (count == max_batchlength) {
          console.log(max_batchlength, 'batch complete');
          resolve('done successfully');
        }

      }).catch(err => { console.log(err); reject(err); });

    }


  });
}



