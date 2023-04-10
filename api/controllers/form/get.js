module.exports = {


  friendlyName: 'Get',


  description: 'Get form.',


  inputs: {
    form_id: {
      type: 'string'
    }
  },


  exits: {
    succeed: {
      statusCode: 200,
    },
    fail: {
      statusCode: 404,
    },
  },


  fn: async function (inputs, exits) {
    let formId = inputs.form_id;

    let pregame = await Pregame.findOne({id: formId});
    if (!pregame) {
      return exits.fail({message: `No form found with ID ${formId}`});
    }

    let auton = await Auton.findOne({id: pregame.auton});
    let teleop = await Teleop.findOne({id: pregame.teleop});
    let postmatch = await Postmatch.findOne({id: pregame.postmatch});
    let robotAttributes = await RobotAttributes.findOne({id: pregame.robot_attributes});

    return exits.success({
      pregame,
      auton,
      teleop,
      postmatch,
      robotAttributes
    });
  }


};
