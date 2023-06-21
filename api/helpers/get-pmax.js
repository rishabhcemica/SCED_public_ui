module.exports = {


  friendlyName: 'Get pmax',


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
      outputFriendlyName: 'Pmax',
    },

  },


  fn: async function (inputs, exits) {
    const request = require('request');

    // Get pmax.
    var pmax;

    var url = 'http://10.5.134.44/pwcapi/pmax.php?sdate=' + inputs.sdate;
    // TODO

    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        pmax = body;
        //console.log(vc);

        // return vc;
        return exits.success(pmax);
      }
    });



    // Send back the result through the success exit.


  }


};

