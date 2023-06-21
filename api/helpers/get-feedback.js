module.exports = {


  friendlyName: 'Get feedback',


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
      outputFriendlyName: 'Feedback',
    },

  },


  fn: async function (inputs, exits) {
    const request = require('request');
    // Get feedback.
    var feedback;

    // var ir;

    var url = 'http://10.5.134.44/pwcapi/feedback.php?sdate=' + inputs.sdate;
    //console.log(url);
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        feedback = body;
        //console.log(vc);

        // return vc;
        return exits.success(feedback);
      }
      // TODO

      // Send back the result through the success exit.
      //return feedback;

    });
  }

};

