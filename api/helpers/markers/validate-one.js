module.exports = {


  friendlyName: 'Validate one',


  description: '',


  inputs: {
    marker: {
      type: "ref"
    }
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs) {
    sails.log(inputs.marker)
    if(!inputs.marker.hasOwnProperty("x")) {
      sails.log("x failed")
      return false;
    }
    if(!inputs.marker.hasOwnProperty("y")) {
      sails.log("y failed")
      return false;
    }
    if(!inputs.marker.hasOwnProperty("positive")) {
      sails.log("success failed")
      return false;
    }
    if(!inputs.marker.hasOwnProperty("type")) {
      sails.log("type failed")
      return false;
    }
    return true;
  }


};

