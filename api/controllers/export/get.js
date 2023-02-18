module.exports = {


  friendlyName: 'Get',


  description: 'Get export.',


  inputs: {

  },


  exits: {
    succeed: {
      statusCode: 200,
      'Content-Type': 'text/csv'
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
      "activation bonus": [],
      "startingPos": []
    }

    const pregames = await Pregame.find({where:{date: {">": new Date(new Date().getFullYear(), 0, 1).valueOf()}}})
    const autons = await Auton.find({where:{date: {">": new Date(new Date().getFullYear(), 0, 1).valueOf()}}})
    const teleops = await Teleop.find({where:{date: {">": new Date(new Date().getFullYear(), 0, 1).valueOf()}}})
    const postmatch = await Postmatch.find({where:{date: {">": new Date(new Date().getFullYear(), 0, 1).valueOf()}}})
    const robot_attributes = await RobotAttributes.find({where:{date: {">": new Date(new Date().getFullYear(), 0, 1).valueOf()}}})

    const cachedRounds = {
      
    }

    console.log(pregames)


    for(let i = 0; i < pregames.length; i++) {
      blueprint.author.push(pregames[i].author)
      blueprint.carryables.push(robot_attributes[i].intake_containables)
      blueprint["charged (a)"].push(autons[i].extra_goal_progress)
      blueprint["charged (t)"].push(teleops[i].extra_goal_progress)
      let cones = 0;
      let cubes = 0;
      for(let j = 0; j < autons[i].markers.length; j++) {
        if(autons[i].markers[j].type == "cone" && autons[i].markers[j].positive == true) {
          cones++;
        }
        if(autons[i].markers[j].types == "cube" && autons[i].markers[j].positive == true){
          cubes++
        }
      }
      blueprint["cones (a)"].push(cones);
      blueprint["cubes (a)"].push(cubes);
      cubes = 0
      cones = 0
      for(let j = 0; j < teleops[i].markers.length; j++) {
        if(teleops[i].markers[j].type == "cone" && teleops[i].markers[j].positive == true) {
          cones++;
        }
        if(teleops[i].markers[j].types == "cube" && teleops[i].markers[j].positive == true){
          cubes++
        }
      }
      blueprint["cones (t)"].push(cones)
      blueprint["cubes (t)"].push(cubes)
      blueprint.coop.push(teleops[i].attempted_collaboration || autons[i].attempted_collaboration)
      blueprint.defense.push(postmatch[i].Defense)
      blueprint.docking.push((teleops[i].extra_goal_progress || autons[i].extra_goal_progress) >= 1 ? 'yes' : 'no')
      blueprint["drive train"].push(robot_attributes[i].drive_style)
      blueprint["final score"].push(postmatch[i].final_score)
      blueprint["left community"].push(autons[i].left_community || false)
      blueprint.manipulator.push(robot_attributes[i].arm_design)
      blueprint["match number"].push(pregames[i].match)
      blueprint.moved.push(autons[i].moved)
      console.log(postmatch[i])
      blueprint.penalties.push(postmatch[i].penalties)
      blueprint.points.push(postmatch[i].points)
      blueprint.preload.push(pregames[i].preload)
      blueprint["rank points"].push(postmatch[i].rank_points + "/5")
      blueprint.response.push(postmatch[i].Offense + "/5")
      blueprint.startingPos.push(pregames[i].startingPos)
      //blueprint["rows scored"].push(teleops.markers && autons.markers)
      blueprint["team number"].push(pregames[i].teamid)
      blueprint.timestamp.push(pregames[i].date)

      if(cachedRounds.hasOwnProperty(pregames[i].match)) {
        cachedRounds[pregames[i].match] = await sails.helpers.rounds.getAllOfRoundNumber.with({
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
    csv += "\n"
    console.log(blueprint)
    for(let form = 0; form < blueprint.timestamp.length; form++) {
      for (const [key, value] of Object.entries(blueprint)) {
        csv += value[form] + ","
      }
      csv += "\n"
    }
    csv = csv.substring(0, csv.length - 1)
    // All done.
    return csv;

  }


};
