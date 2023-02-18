module.exports = {


  friendlyName: 'Validate',


  description: 'Validate prematch.',


  inputs: {
    prematch: {
      type: "json"
    }
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs) {
    sails.log(inputs.prematch)
    if (!inputs.prematch.hasOwnProperty("author")) {
      return "author";
    }
    if (!inputs.prematch.hasOwnProperty("teamid")) {
      return "teamid";
    }
    if (!inputs.prematch.hasOwnProperty("match")) {
      return "match";
    }
    if (!inputs.prematch.hasOwnProperty("startingPos")) {
      return "startingPos";
    }
    if (!inputs.prematch.hasOwnProperty("preload")) {
      return "preload";
    }
    if (!inputs.prematch.hasOwnProperty("noshow")) {
      return "noshow";
    }
    if (!inputs.prematch.hasOwnProperty("alliance")) {
      return "alliance";
    }
    if (!inputs.prematch.hasOwnProperty("preload_type")) {
      return "preload_type";
    }
    return true;
  }


};

