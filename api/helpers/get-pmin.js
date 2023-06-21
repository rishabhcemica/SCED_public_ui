module.exports = {


  friendlyName: 'Get pmin',


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
      outputFriendlyName: 'Pmin',
    },

  },


  fn: async function (inputs, exits) {
    const request = require('request');
    // Get pmin.
    var pmin;
    var url = 'http://10.5.134.44/pwcapi/techmin.php?sdate=' + inputs.sdate;
    //console.log(url);
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        pmin = body;
        //console.log(vc);

        // return vc;
        return exits.success(pmin);
      }
    });
    // TODO

    // Send back the result through the success exit.


  }


};

