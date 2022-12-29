module.exports = {


  friendlyName: 'Validate',


  description: 'Validate teleop.',


  inputs: {
    teleop: {
      type: "json"
    }
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs) {
    if(!inputs.teleop.hasOwnProperty("markers")) {
      return "no markers";
    }
    if(!await sails.helpers.markers.validate.with({markers: inputs.teleop.markers})) {
      return "invalid markers";
    }
    if(!inputs.teleop.hasOwnProperty("extra_goal_progress")) {
      return "no extra goal progress";
    }
    return true;
  }
};

