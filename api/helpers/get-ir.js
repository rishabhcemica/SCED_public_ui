module.exports = {


  friendlyName: 'Get ir',


  description: '',


  inputs: {
    sdate: {
      type: "string",
      required: true,
      value: ""
    }

  },


  exits: {

    success: {
      outputFriendlyName: 'Ir',
    },

  },


  fn: async function (inputs, exits) {


    const request = require('request');
    // Get vc.
    var ir;

    var url = 'http://10.5.134.44/pwcapi/atc.php?sdate=' + inputs.sdate;
    console.log(url);
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        ir = body;
        //console.log(vc);

        // return vc;
        return exits.success(ir);
      }
    });


    // Get ir.

    // TODO

    // Send back the result through the success exit.

  }


};

