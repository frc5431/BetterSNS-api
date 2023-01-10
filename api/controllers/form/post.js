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
    let formdata = inputs.data;

    if(!formdata.hasOwnProperty("prematch")) {
      return exits.fail({message: "Prematch not found"});
    }
    let pregame_validate = await sails.helpers.prematch.validate.with({prematch: formdata.prematch});
    if(pregame_validate !== true) {
      return exits.fail({message: "Prematch was unable to validate " + pregame_validate});
    }

    let prematch = formdata.prematch;
    prematch.date = Date.now();
    sails.log(prematch)

    if(!formdata.hasOwnProperty("auton")) {
      return exits.fail({message: "Auton not found"});
    }
    let auton_validate = await sails.helpers.auton.validate.with({auton: formdata.auton});
    if(auton_validate !== true) {
      return exits.fail({message: "Auton was unable to validate because " + auton_validate});
    }

    let auton = formdata.auton;
    auton.date = Date.now();
    auton.startpos = auton.markers[0]
    auton.endpos = auton.markers[auton.markers.length - 1]
    sails.log(auton)

    if(!formdata.hasOwnProperty("teleop")) {
      return exits.fail({message: "Teleop not found"});
    }
    let teleop_validate = await sails.helpers.auton.validate.with({auton: formdata.teleop});
    if(teleop_validate !== true) {
      return exits.fail({message: "Teleop was unable to validate because " + teleop_validate});
    }

    let teleop = formdata.teleop;
    teleop.date = Date.now();
    teleop.startpos = teleop.markers[0]
    teleop.endpos = teleop.markers[teleop.markers.length - 1]
    sails.log(teleop)

    if(!formdata.hasOwnProperty("postmatch")) {
      return exits.fail({message: "Postmatch not found"});
    }
    let postmatch_validate = await sails.helpers.postmatch.validate.with({postmatch: formdata.postmatch});
    if(postmatch_validate !== true) {
      return exits.fail({message: "Postmatch was unable to validate because " + postmatch_validate});
    }

    let postmatch = formdata.postmatch;
    postmatch.date = Date.now();
    sails.log(postmatch)
    

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
    // All done.
    return exits.succeed({message: "Succeed with no errors"});

  }


};
