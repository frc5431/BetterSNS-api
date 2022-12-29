module.exports = {


  friendlyName: 'Validate',


  description: 'Validate auton.',


  inputs: {
    auton: {
      type: "json"
    }
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs) {
    /*
      markers: {
        type: "json",
      },
      moved: {
        type: "boolean",
      },
      startpos: {
        type: "json",
      },
      endpos: {
        type: "json",
      },
      author: {
        type: "string",
      }
    */
    if(!inputs.auton.hasOwnProperty("markers")) {
      return "no markers";
    }
    if(!await sails.helpers.markers.validate.with({markers: inputs.auton.markers})) {
      return "invalid markers";
    }
    return true;
  }


};

