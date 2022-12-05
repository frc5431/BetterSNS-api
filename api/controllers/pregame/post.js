module.exports = {


  friendlyName: 'Post',


  description: 'Post pregame.',


  inputs: {
    name: {
      type: "string",
      required: true,
    },
    teamid: {
      type: "number",
      required: true,
    },
    match: {
      type: "number",
      required: true,
    },
    preload: {
      type: "boolean",
      required: true,
    },
    human: {
      type: "boolean",
      required: true,
    },
    noshow: {
      type: "boolean",
      required: true,
    },
  },


  exits: {
    success: {
      description: 'good',
    },
    failure: {
      description: 'bad',
    },
  },


  fn: async function (inputs, exits) {
    sails.log(inputs);
    const data = {

    }
    const result = await Pregame.create(inputs);
    if (!result) {
      // failure
    }
    sails.log("success")

    // All done.
    return exits.success();

  }


};
