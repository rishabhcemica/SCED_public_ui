module.exports = {


  friendlyName: 'Get curtail',


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
      outputFriendlyName: 'Curtail',
    },

  },


  fn: async function (inputs, exits) {

    // Get curtail.
    var curtail;
    // TODO

    const request = require('request');
    // Get pmin.

    var url = 'http://10.5.134.44/pwcapi/curtail.php?sdate=' + inputs.sdate;
    //console.log(url);
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        curtail = body;
        //console.log(vc);

        // return vc;
        return exits.success(curtail);
      }
    });

    // Send back the result through the success exit.


  }


};

