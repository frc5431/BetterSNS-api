module.exports = {


  friendlyName: 'Validate',


  description: 'Validate robot attributes.',


  inputs: {
    robot_attributes: {
      type: "ref",
    },
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs) {
    return await sails.helpers.validation.validateSchema.with({
      names: [
        "arm_design",
        "drive_style",
        "agility",
        "speed",
        "intake_containables",
      ],
      data: inputs.robot_attributes
    })
  }


};

