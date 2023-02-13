module.exports = {


  friendlyName: 'Post',


  description: 'Post form.',


  inputs: {
    data: {
      type: "json",
      required: true
    }
  },


  exits: {
    succeed: {
      statusCode: 200,
    },
    fail: {
      statusCode: 500,
    },
  },


  fn: async function (inputs, exits) {
    if(!inputs.data.hasOwnProperty("prematch")) {
      return exits.fail({message: "Prematch not found"});
    }
    let pregame_validate = await sails.helpers.prematch.validate.with({prematch: inputs.data.prematch});
    if(pregame_validate !== true) {
      return exits.fail({message: "Prematch was unable to validate " + pregame_validate});
    }

    let prematch = inputs.data.prematch;
    prematch.date = Date.now();
    sails.log(prematch)

    let auton = {};
    let teleop = {};
    let postmatch = {};

    if(!prematch.noshow) {
      if(!inputs.data.hasOwnProperty("auton")) {
        return exits.fail({message: "Auton not found"});
      }
      let auton_validate = await sails.helpers.auton.validate.with({auton: inputs.data.auton});
      if(auton_validate !== true) {
        return exits.fail({message: "Auton was unable to validate because " + auton_validate});
      }
  
      auton = inputs.data.auton;
      auton.date = Date.now();
      auton.startpos = auton.markers[0]
      auton.endpos = auton.markers[auton.markers.length - 1]
      sails.log(auton)
  
      if(!inputs.data.hasOwnProperty("teleop")) {
        return exits.fail({message: "Teleop not found"});
      }
      let teleop_validate = await sails.helpers.auton.validate.with({auton: inputs.data.teleop});
      if(teleop_validate !== true) {
        return exits.fail({message: "Teleop was unable to validate because " + teleop_validate});
      }
  
      teleop = inputs.data.teleop;
      teleop.date = Date.now();
      teleop.startpos = teleop.markers[0]
      teleop.endpos = teleop.markers[teleop.markers.length - 1]
      sails.log(teleop)

      if(!inputs.data.hasOwnProperty("postmatch")) {
        return exits.fail({message: "Postmatch not found"});
      }
      let postmatch_validate = await sails.helpers.postmatch.validate.with({postmatch: inputs.data.postmatch});
      if(postmatch_validate !== true) {
        return exits.fail({message: "Postmatch was unable to validate because " + postmatch_validate});
      }

      postmatch = inputs.data.postmatch;
      postmatch.date = Date.now();
      sails.log(postmatch)
    }

    

    //create new Pregame
    let new_pregame = await Pregame.create(prematch).fetch();
    sails.log(new_pregame);
    //add the id to all the other objects as form_id
    auton.form_id = new_pregame.id;
    teleop.form_id = new_pregame.id;
    postmatch.form_id = new_pregame.id;
    //create new Auton
    let new_auton = await Auton.create(auton).fetch();
    sails.log(new_auton);
    //create new Teleop
    let new_teleop = await Teleop.create(teleop).fetch();
    sails.log(new_teleop);
    //create new Postmatch
    let new_postmatch = await Postmatch.create(postmatch).fetch();
    sails.log(new_postmatch);

    destroyAll = () => {
      Pregame.destroy({id: new_pregame.id});
      Auton.destroy({form_id: new_auton.form_id});
      Teleop.destroy({form_id: new_teleop.form_id});
      Postmatch.destroy({form_id: new_postmatch.form_id});
    }

    //validate all the objects
    //if any of them fail, delete all the objects and return fail
    if(await sails.helpers.pregame.validate.with({pregame: new_pregame}) !== true) {
      destroyAll();
      return exits.fail({message: "Pregame was unable to validate"});
    }
    if(await sails.helpers.auton.validate.with({auton: new_auton}) !== true) {
      destroyAll();
      return exits.fail({message: "Auton was unable to validate"});
    }
    if(await sails.helpers.teleop.validate.with({teleop: new_teleop}) !== true) {
      destroyAll();
      return exits.fail({message: "Teleop was unable to validate"});
    }
    if(await sails.helpers.postmatch.validate.with({postmatch: new_postmatch}) !== true) {
      destroyAll();
      return exits.fail({message: "Postmatch was unable to validate"});
    }

    // All done.
    return exits.succeed({message: "Succeed with no errors"});

  }


};
