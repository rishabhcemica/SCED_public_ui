module.exports = {


  friendlyName: 'Get ramp',


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
      outputFriendlyName: 'Ramp',
    },

  },


  fn: async function (inputs, exits) {

    // Get ramp.
    var ramp;

    const request = require('request');
    // Get pmin.

    var url = 'http://10.5.134.44/pwcapi/ramp.php?sdate=' + inputs.sdate;
    //console.log(url);
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        ramp = body;
        //console.log(vc);

        // return vc;
        return exits.success(ramp);
      }
    });
    // TODO

    // Send back the result through the success exit.


  }


};

