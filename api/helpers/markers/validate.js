module.exports = {


  friendlyName: 'Validate',


  description: 'Validate markers.',


  inputs: {
    markers: {
      type: "ref",
      required: true
    }
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs) {
    if(inputs.markers.length == 0) {
      return true;
    }
    for(let x of inputs.markers) {
      if(!await sails.helpers.markers.validateOne.with({marker: x})) {
        return false;
      }
    }
    return true;
  }


};

