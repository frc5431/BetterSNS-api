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
    const postmatches = await Postmatch.find({where:{date: {">": new Date(new Date().getFullYear(), 0, 1).valueOf()}}})
    const robot_attributes = await RobotAttributes.find({where:{date: {">": new Date(new Date().getFullYear(), 0, 1).valueOf()}}})

    const cachedRounds = {
      
    }

    console.log(pregames)


    for(let i = 0; i < pregames.length; i++) {
      const pregame = pregame
      const auton = autons.find(element => element.form_id === pregames.id)
      const teleop = teleops.find(element => element.form_id === pregames.id)
      const postgame = postmatches.find(element => element.form_id === pregames.id)
      const robot_attribute = robot_attributes.find(element => element.form_id === pregames.id)



      blueprint.author.push(pregame.author)
      blueprint.carryables.push(robot_attribute.intake_containables)
      blueprint["charged (a)"].push(auton.extra_goal_progress)
      blueprint["charged (t)"].push(teleop.extra_goal_progress)
      let cones = 0;
      let cubes = 0;
      for(let j = 0; j < auton.markers.length; j++) {
        if(auton.markers[j].type == "cone" && auton.markers[j].positive == true) {
          cones++;
        }
        if(auton.markers[j].types == "cube" && auton.markers[j].positive == true){
          cubes++
        }
      }
      blueprint["cones (a)"].push(cones);
      blueprint["cubes (a)"].push(cubes);
      cubes = 0
      cones = 0
      for(let j = 0; j < teleop.markers.length; j++) {
        if(teleop.markers[j].type == "cone" && teleop.markers[j].positive == true) {
          cones++;
        }
        if(teleop.markers[j].types == "cube" && teleop.markers[j].positive == true){
          cubes++
        }
      }
      blueprint["cones (t)"].push(cones)
      blueprint["cubes (t)"].push(cubes)
      blueprint.coop.push(teleop.attempted_collaboration || auton.attempted_collaboration)
      blueprint.defense.push(postgame.Defense)
      blueprint.docking.push((teleop.extra_goal_progress || auton.extra_goal_progress) >= 1 ? 'yes' : 'no')
      blueprint["drive train"].push(robot_attribute.drive_style)
      blueprint["final score"].push(postgame.final_score)
      blueprint["left community"].push(auton.left_community || false)
      blueprint.manipulator.push(robot_attribute.arm_design)
      blueprint["match number"].push(pregame.match)
      blueprint.moved.push(auton.moved)
      console.log(postgame)
      blueprint.penalties.push(postgame.penalties)
      blueprint.points.push(postgame.points)
      blueprint.preload.push(pregame.preload)
      blueprint["rank points"].push(postgame.rank_points + "/5")
      blueprint.response.push(postgame.Offense + "/5")
      blueprint.startingPos.push(pregame.startingPos)
      //blueprint["rows scored"].push(teleops.markers && autons.markers)
      blueprint["team number"].push(pregame.teamid)
      blueprint.timestamp.push(pregame.date)

      if(cachedRounds.hasOwnProperty(pregame.match)) {
        cachedRounds[pregame.match] = await sails.helpers.rounds.getAllOfRoundNumber.with({
          round_number: pregame.match,
          date: pregame.date
        })
      }
      let activationBonus = 0;
      
      for(const cRound in cachedRounds[pregame.match]) {
        let ag = cRound.auton.extra_goal_progress;
        let tg = cRound.teleop.extra_goal_progress;
        activationBonus += ag == 1 ? 8 : ag == 2 ? 12 : 0
        activationBonus += tg == 1 ? 6 : tg == 2 ? 10 : 0
      }

      blueprint["tried activation"].push(activationBonus >= 1)
      blueprint["activation bonus"].push(activationBonus >= 26)

      blueprint["tried community"].push(teleop.attempted_collaboration || auton.attempted_collaboration)
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
