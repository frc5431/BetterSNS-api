module.exports = {


  friendlyName: 'Get',


  description: 'Get export.',


  inputs: {

  },


  exits: {
    succeed: {
      statusCode: 200,
    },
    fail: {
      statusCode: 500,
    },
  },


  fn: async function (inputs) {
    const blueprint = {
      timestamp: [],
      author: [],
      "match number": [],
      moved: [],
      "cones (a)": [],
      "cubes (a)": [],
      "cubes (t)": [],
      "cubes (t)": [],
      "points": [],
      "penalties": [],
      "rank points": [],
      "final score": [],
      "team number": [],
      "left community": [],
      "preload": [],
      "charged": [],
      "carryables": [],
      "coop": [],
      "rows scored": [],
      "defense": [],
      "response": [],
      "drive train": [],
      "manipulator": [],
      "docking": [],
      "tried community": [],
      "tried activation": [],
    }

    const pregames = Pregame.find({where:{date: {">": new Date(new Date().getFullYear(), 0, 1)}}})
    const autons = Auton.find({where:{date: {">": new Date(new Date().getFullYear(), 0, 1)}}})
    const teleops = Auton.find({where:{date: {">": new Date(new Date().getFullYear(), 0, 1)}}})
    const postmatch = Auton.find({where:{date: {">": new Date(new Date().getFullYear(), 0, 1)}}})
    const robot_attributes = RobotAttributes.find({where:{date: {">": new Date(new Date().getFullYear(), 0, 1)}}})

    for(let i = 0; i < pregames.length; i++) {
      blueprint.author = pregames.author;
      //blueprint.carryables = 
    }

    // All done.
    return;

  }


};
