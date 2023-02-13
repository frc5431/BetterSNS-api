module.exports = {


  friendlyName: 'Get all of round number',


  description: '',


  inputs: {
    round_number: {
      type: 'number'
    },
    date: {
      type: 'number'
    }
  },


  exits: {

    success: {
      outputFriendlyName: 'All of round number',
    },

  },


  fn: async function (inputs) {

    // Get all of round number.
    let allOfRoundNumber = [];
    
    const forms = Pregame.find({where:{date: inputs.date, match: inputs.round_number}})

    for(const form of forms) {
      const auton = Auton.find({where:{form_id: form.id}})
      const teleop = Teleop.find({where:{form_id: form.id}})

      allOfRoundNumber.push({
        form: form,
        auton: auton,
        teleop: teleop
      });
    }

    // Send back the result through the success exit.
    return allOfRoundNumber;

  }


};

