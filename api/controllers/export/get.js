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
      "cones (t)": [],
      "points": [],
      "penalties": [],
      "rank points": [],
      "final score": [],
      "team number": [],
      "left community": [],
      "preload": [],
      "charged (a)": [],
      "charged (t)": [],
      "carryables": [],
      "coop": [],
      "defense": [],
      "response": [],
      "drive train": [],
      "manipulator": [],
      "docking": [],
      "tried community": [],
      "tried activation": [],
      "activation bonus": []
    }

    const pregames = Pregame.find({where:{date: {">": new Date(new Date().getFullYear(), 0, 1)}}})
    const autons = Auton.find({where:{date: {">": new Date(new Date().getFullYear(), 0, 1)}}})
    const teleops = Auton.find({where:{date: {">": new Date(new Date().getFullYear(), 0, 1)}}})
    const postmatch = Auton.find({where:{date: {">": new Date(new Date().getFullYear(), 0, 1)}}})
    const robot_attributes = RobotAttributes.find({where:{date: {">": new Date(new Date().getFullYear(), 0, 1)}}})

    const cachedRounds = {
      
    }

    for(let i = 0; i < pregames.length; i++) {
      blueprint.author.push(pregames[i].author)
      blueprint.carryables.push(robot_attributes[i].intake_containable)
      blueprint.charged.push(autons[i].extra_goal_progress)
      blueprint["charged (t)"].push(teleop[i].extra_goal_progress)
      let cones = 0;
      let cubes = 0;
      for(let j = 0; j < autons[i].markers.length; j++) {
        if(autons[i].markers[j].type == "cone") {
          cones++;
        }
        if(autons[i].markers[j].types == "cube"){
          cubes++
        }
      }
      blueprint["cones (a)"].push(cones);
      blueprint["cubes (a)"].push(cubes);
      cubes = 0
      cones = 0
      for(let j = 0; j < teleops[i].markers.length; j++) {
        if(teleops[i].markers[j].type == "cone") {
          cones++;
        }
        if(teleops[i].markers[j].types == "cube"){
          cubes++
        }
      }
      blueprint["cones (t)"].push(cones)
      blueprint["cubes (t)"].push(cubes)
      blueprint.coop.push(teleops.attempted_collaboration || autons.attempted_collaboration)
      blueprint.defense.push(postmatch.defense)
      blueprint.docking.push(teleops.extra_goal_progress || autons.extra_goal_progress)
      blueprint["drive train"].push(robot_attributes.drive_style)
      blueprint["final score"].push(postmatch.final_score)
      blueprint["left community"].push(autons.markers)
      blueprint.manipulator.push(robot_attributes.arm_design)
      blueprint["match number"].push(pregames.match)
      blueprint.moved.push(autons.moved)
      blueprint.penalties.push(postmatch.penalties)
      blueprint.points.push(postmatch.points)
      blueprint.preload.push(pregames.preload)
      blueprint["rank points"].push(postmatch.rank_points)
      blueprint.response.push(postmatch.offense)
      blueprint["rows scored"].push(teleops.markers && autons.markers)
      blueprint["team number"].push(pregames.teamid)
      blueprint.timestamp.push(pregames.date)

      if(cachedRounds.hasOwnProperty(pregames[i].match)) {
        cachedRounds[pregames[i].match] = sails.helpers.rounds.getAllOfRoundNumber.with({
          round_number: pregames[i].match,
          date: pregames[i].date
        })
      }
      let activationBonus = 0;
      
      for(const cRound in cachedRounds[pregames[i].match]) {
        let ag = cRound.auton.extra_goal_progress;
        let tg = cRound.teleop.extra_goal_progress;
        activationBonus += ag == 1 ? 8 : ag == 2 ? 12 : 0
        activationBonus += tg == 1 ? 6 : tg == 2 ? 10 : 0
      }

      blueprint["tried activation"].push(activationBonus >= 1)
      blueprint["activation bonus"].push(activationBonus >= 26)

      blueprint["tried community"].push(teleops[i].attempted_collaboration || autons[i].attempted_collaboration)
    }
    let csv = "";
    for (const [key, value] of Object.entries(blueprint)) {
      csv += key + ",";
    }
    for(let form = 0; form < Object.entries(blueprint).length; form++) {
      for (const [key, value] of Object.entries(blueprint)) {
        form += blueprint[key][value][form] + ","
      }
    }
    
    // All done.
    return csv;

  }


};
