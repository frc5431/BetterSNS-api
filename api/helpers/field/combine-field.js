module.exports = {


  friendlyName: 'Combine field',


  description: '',


  inputs: {
    fields: {
      type: 'ref'
    }
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs) {
    const fields = inputs.fields;
    const combinedField = [];
    for(let i = 0; i < fields[0].length; i++) {
      combinedField.push(Object.assign({}, {
        x: fields[0][i].x,
        y: fields[0][i].y,
        difficulty: fields[0][i].difficulty,
        positive: fields[0][i].positive,
        type: fields[0][i].type
      }))
    }

    for(let field = 1; field < fields.length; field++) {
      const currentField = fields[field];
      for(let marker = 0; marker < fields[field].length; marker++) {
        if(!combinedField[marker].positive && currentField.positive) {
          combinedField[marker].positive = currentField.positive;
          combinedField[marker].type = currentField.type;
        }
        // 2023 specific code to filter out anything but floor nodes
        if(combinedField[marker].y == 2) {
          if(combinedField[marker].type != currentField[marker].type && currentField[marker].type !== null) {
            combinedField[marker].type = currentField[marker].type;
          }
        }
      }
    }
    
  }


};

