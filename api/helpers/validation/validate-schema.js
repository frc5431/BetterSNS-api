module.exports = {


  friendlyName: 'Validate schema',


  description: '',


  inputs: {
    names: {
      type: 'ref'
    },
    data: {
      type: 'ref'
    }
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs) {
    console.log(inputs.data)
    for(const name of inputs.names) {
      if(!inputs.data.hasOwnProperty(name)) {
        return name;
      }
    }
    return true; 
  }


};

