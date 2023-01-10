module.exports = {
  friendlyName: "Validate",

  description: "Validate postmatch.",

  inputs: {
    postmatch: {
      type: "json",
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs) {
    sails.log(inputs.postmatch);
    if (!inputs.postmatch.hasOwnProperty("notes")) {
      return "no notes";
    }
    if (!inputs.postmatch.hasOwnProperty("GeneralRating")) {
      return "no general rating";
    }
    if (!inputs.postmatch.hasOwnProperty("Teamwork")) {
      return "no teamwork";
    }
    if (!inputs.postmatch.hasOwnProperty("Defense")) {
      return "no defense";
    }
    if (!inputs.postmatch.hasOwnProperty("Offense")) {
      return "no offense";
    }
    return true;
  },
};
