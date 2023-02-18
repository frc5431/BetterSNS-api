module.exports = {


  friendlyName: 'Get match field',


  description: '',


  inputs: {
    id: {
      type: 'number'
    },
    date: {
      type: 'ref'
    }
  },


  exits: {

    success: {
      outputFriendlyName: 'Match field',
    },

  },


  fn: async function (inputs) {
    const fields = []
    const markers = await sails.helpers.rounds.getAllOfRoundNumber.with({
      id: inputs.id,
      date: inputs.date
    })
    for(const match of markers) {
      fields.push(match.auton.markers)
      fields.push(match.teleop.markers)
    }


    // Get match field.
    const matchField = await sails.helpers.field.combineField.with({
      fields: markers
    });
    


    // Send back the result through the success exit.
    return matchField;

  }


};

