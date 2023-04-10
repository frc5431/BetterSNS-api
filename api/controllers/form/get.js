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
    let pregame = await Pregame.findOne({id: formId});
    if (!pregame) {
      return exits.fail({message: `No form found with ID ${formId}`});
    }
    return exits.succeed(await sails.helpers.form.getById.with({form_id: inputs.form_id}))
  }


};
