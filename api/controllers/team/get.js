module.exports = {


  friendlyName: 'Get',


  description: 'Get team.',


  inputs: {
    id: {
      type: 'string'
    }
  },


  exits: {

  },


  fn: async function (inputs) {
    const prematches = await Pregame.find({teamid: inputs.id})
    const forms = []

    for(const match of prematches) {
      forms.push(await sails.helpers.form.getById.with({form_id: match.id}))
    }

    // All done.
    return forms;

  }


};
