module.exports = {


  friendlyName: 'Get by id',


  description: '',


  inputs: {
    form_id: {
      type: 'string'
    }
  },


  exits: {

    success: {
      outputFriendlyName: 'By id',
    },

  },


  fn: async function (inputs) {
    let formId = inputs.form_id;

    let pregame = await Pregame.findOne({id: formId});

    let auton = await Auton.findOne({form_id: formId});
    let teleop = await Teleop.findOne({form_id: formId});
    let postmatch = await Postmatch.findOne({form_id: formId});
    let robotAttributes = await RobotAttributes.findOne({form_id: formId});

    return {
      pregame,
      auton,
      teleop,
      postmatch,
      robotAttributes
    }
  }


};

