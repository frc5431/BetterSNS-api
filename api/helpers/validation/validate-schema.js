module.exports = {


  friendlyName: 'Validate schema',


  description: '',


  inputs: {
    schema: {
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
    //a schema is an object with a list of fields
    //each field has a type and a name
    //each field can have a list of subfields wich act like fields

    const testfield = (field, data) => {
      if(!data.hasOwnProperty(field.name)) {
        return false;
      }
      if(data[field.name] === undefined) {
        return false;
      }
      if(field.type !== typeof(data[field.name])) {
        return false;
      }
      return true;
    }
    for(let field of inputs.schema) {
      let result = testfield(field, inputs.data);
      if(result !== undefined) {
        return result;
      }
    }
      
  }


};

