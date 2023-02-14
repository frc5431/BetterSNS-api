module.exports = {


  friendlyName: 'Post',


  description: 'Post feedback.',


  inputs: {
    author: {
      type: 'string',
      required: true
    },
    contact: {
      type: 'string',
      required: false
    },
    message: {
      type: 'string',
      required: true
    },
  },


  exits: {
    succeed: {
      statusCode: 200,
    }
  },


  fn: async function (inputs, exits) {
    await Feedback.create({
      author: inputs.author,
      contact: inputs.contact,
      message: inputs.message
    })
    

    // All done.
    return exits.succeed({message: 'feedback successfully submitted'});

  }


};
