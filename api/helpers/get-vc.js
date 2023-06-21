module.exports = {


  friendlyName: 'Get vc',


  description: '',


  inputs: {
    sdate: {
      type: "string",
      required: true,
      value: ""
    },
    edate: {
      type: "string",
      required: true,
      value: ""
    }

  },


  exits: {

    success: {
      outputFriendlyName: 'Vc',
    },

  },


  fn: async function (inputs, exits) {
    const request = require('request');
    // Get vc.
    var vc;

    //var url='http://10.5.112.157/rrasapi?sdate='+inputs.sdate+'&edate='+inputs.edate;

    var url = 'http://10.5.134.86:1500/rates/getRates?sdate=' + inputs.sdate + '&edate=' + inputs.edate;
    //console.log(url);
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        vc = body;
        //console.log(vc);

        // return vc;
        return exits.success(vc);
      }
    });




    // TODO

    // Send back the result through the success exit.


  }


};

