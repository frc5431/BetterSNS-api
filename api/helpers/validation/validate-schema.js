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
    for(const name of names) {
      if(!data.hasOwnProperty(names)) {
        return name;
      }
    }
    return true; 
  }


};

