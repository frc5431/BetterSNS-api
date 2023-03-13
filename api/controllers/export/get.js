module.exports = {


  friendlyName: 'Get',


  description: 'Get export.',


  inputs: {

  },


  exits: {
    succeed: {
      statusCode: 200
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
      "startingPos": [],
      "poorlyFilled": [],
    }

    const pregames = await Pregame.find({where:{date: {">": new Date(new Date().getFullYear(), 0, 1).valueOf()}}})
    const autons = await Auton.find({where:{date: {">": new Date(new Date().getFullYear(), 0, 1).valueOf()}}})
    const teleops = await Teleop.find({where:{date: {">": new Date(new Date().getFullYear(), 0, 1).valueOf()}}})
    const postmatches = await Postmatch.find({where:{date: {">": new Date(new Date().getFullYear(), 0, 1).valueOf()}}})
    const robot_attributes = await RobotAttributes.find({where:{date: {">": new Date(new Date().getFullYear(), 0, 1).valueOf()}}})


    const compiler = {
      REQUIRE_AUTON: 'auton',
      REQUIRE_TELEOP: 'teleop',
      REQUIRE_POSTGAME: 'postgame',
      REQUIRE_ROBOT_ATTRIBUTES: 'robot',
      REQUIRE_PREGAME: 'pregame',
      compile: () => {
        for(const pregame of pregames) {
          const auton = autons.find(element => element.form_id === pregame.id)
          const teleop = teleops.find(element => element.form_id === pregame.id)
          const postgame = postmatches.find(element => element.form_id === pregame.id)
          const robot_attribute = robot_attributes.find(element => element.form_id === pregame.id)
          
          for(const action of compiler.actions) {
            let meets_req = true;

            if((auton === null || auton === undefined) && action.requirements.includes(compiler.REQUIRE_AUTON)) {
              meets_req = false;
            }
            if((teleop === null || teleop === undefined) && action.requirements.includes(compiler.REQUIRE_TELEOP)) {
              meets_req = false;
            }
            if((postgame === null || postgame === undefined) && action.requirements.includes(compiler.REQUIRE_POSTGAME)) {
              meets_req = false;
            }
            if((robot_attribute === null || robot_attribute === undefined) && action.requirements.includes(compiler.REQUIRE_ROBOT_ATTRIBUTES)) {
              meets_req = false;
            }
            if((pregame === null || pregame === undefined) && action.requirements.includes(compiler.REQUIRE_PREGAME)) {
              meets_req = false;
            }

            console.log(action.requirements)

            action.callback(meets_req, {pregame: pregame, auton: auton, teleop: teleop, postgame: postgame, robot_attribute: robot_attribute});
          }
        }
      },
      actions: [],
      addAction: (callback, requirements) => {
        let reqs = requirements;
        if(!Array.isArray(requirements)) {
          reqs = [requirements];
        }
        
        compiler.actions.push({callback: callback, requirements: reqs});
      }
    }

    console.log(pregames)

    compiler.addAction((s, r) => {
      if(!s) {
        return;
      }

      blueprint["charged (a)"].push(r.auton.extra_goal_progress)
      blueprint["left community"].push(r.auton.left_community || false)
      blueprint.moved.push(r.auton.moved)

      let cones = 0;
      let cubes = 0;

      for(let j = 0; j < r.auton.markers.length; j++) {
        if(r.auton.markers[j].type == "cone" && r.auton.markers[j].positive == true) {
          cones++;
        }
        if(r.auton.markers[j].types == "cube" && r.auton.markers[j].positive == true){
          cubes++
        }
      }

      blueprint["cones (a)"].push(cones);
      blueprint["cubes (a)"].push(cubes);
    }, compiler.REQUIRE_AUTON)

    compiler.addAction((s, r) => {
      if(!s) {
        return;
      }

      blueprint["charged (t)"].push(r.teleop.extra_goal_progress)

      cubes = 0
      cones = 0
      for(let j = 0; j < r.teleop.markers.length; j++) {
        if(r.teleop.markers[j].type == "cone" && r.teleop.markers[j].positive == true) {
          cones++;
        }
        if(r.teleop.markers[j].types == "cube" && r.teleop.markers[j].positive == true){
          cubes++
        }
      }
      blueprint["cones (t)"].push(cones)
      blueprint["cubes (t)"].push(cubes)
    }, compiler.REQUIRE_TELEOP)

    compiler.addAction((s, r) => {
      if(!s) {
        return;
      }


      blueprint.coop.push(r.teleop.attempted_collaboration || r.auton.attempted_collaboration)
      blueprint.docking.push((r.teleop.extra_goal_progress || r.auton.extra_goal_progress) >= 1 ? 'yes' : 'no')

      let activationBonus = 0;
      
      // for(const cRound in cachedRounds[pregame.match]) {
      //   let ag = cRound.auton.extra_goal_progress;
      //   let tg = cRound.teleop.extra_goal_progress;
      //   activationBonus += ag == 1 ? 8 : ag == 2 ? 12 : 0
      //   activationBonus += tg == 1 ? 6 : tg == 2 ? 10 : 0
      // }

      blueprint["tried activation"].push(activationBonus >= 1)
      blueprint["activation bonus"].push(activationBonus >= 26)
      blueprint["tried community"].push(r.teleop.attempted_collaboration || r.auton.attempted_collaboration)
    }, [compiler.REQUIRE_AUTON, compiler.REQUIRE_TELEOP])

    compiler.addAction((s, r) => {
      if(!s) {
        return;
      }

      blueprint.author.push(r.pregame.author)
      blueprint["match number"].push(r.pregame.match)
      blueprint.preload.push(r.pregame.preload)
      blueprint.startingPos.push(r.pregame.startingPos)
      blueprint["team number"].push(r.pregame.teamid)
      blueprint.timestamp.push(r.pregame.date)

      // if(cachedRounds.hasOwnProperty(pregame.match)) {
      //   sails.helpers.rounds.getAllOfRoundNumber.with({
      //     round_number: pregame.match,
      //     date: pregame.date
      //   }).then((res) => {
      //     cachedRounds[pregame.match] = res;
      //   })
      // }
    }, compiler.REQUIRE_PREGAME)

    compiler.addAction((s, r) => {
      if(!s) {
        blueprint["rank points"].push('unknown')
        blueprint.response.push('unknown')
        blueprint.defense.push('unknown')
        blueprint["final score"].push('unknown')
        blueprint.penalties.push('unknown')
        blueprint.points.push('unknown')
        return;
      }

      blueprint["rank points"].push(r.postgame.rank_points + " out of 5")
      blueprint.response.push(r.postgame.Offense + " out of 5")
      blueprint.defense.push(r.postgame.Defense)
      blueprint["final score"].push(r.postgame.final_score || 'not present')
      blueprint.penalties.push(r.postgame.penalties || 'not present')
      blueprint.points.push(r.postgame.points || 'not present')

    }, compiler.REQUIRE_POSTGAME)

    compiler.addAction((s, r) => {
      if(!s) {
        blueprint.carryables.push('not present')
        blueprint.manipulator.push('not present')
        blueprint["drive train"].push('not present')
        return;
      }
      blueprint.carryables.push(r.robot_attribute.intake_containables)
      blueprint.manipulator.push(r.robot_attribute.arm_design)
      blueprint["drive train"].push(r.robot_attribute.drive_style)
    }, compiler.REQUIRE_ROBOT_ATTRIBUTES)

    compiler.addAction((s, r) => {
      blueprint.poorlyFilled = 'always';
    })

    compiler.compile();

    /*for(let i = 0; i < pregames.length; i++) {
      // const pregame = pregames[i];
      // const auton = autons.find(element => element.form_id === pregames.id)
      // const teleop = teleops.find(element => element.form_id === pregames.id)
      // const postgame = postmatches.find(element => element.form_id === pregames.id)
      // const robot_attribute = robot_attributes.find(element => element.form_id === pregames.id)

      // blueprint.author.push(pregame.author)
      // blueprint.carryables.push(robot_attribute.intake_containables)
      // blueprint["charged (a)"].push(auton.extra_goal_progress)
      // blueprint["charged (t)"].push(teleop.extra_goal_progress)
      // let cones = 0;
      // let cubes = 0;
      // for(let j = 0; j < auton.markers.length; j++) {
      //   if(auton.markers[j].type == "cone" && auton.markers[j].positive == true) {
      //     cones++;
      //   }
      //   if(auton.markers[j].types == "cube" && auton.markers[j].positive == true){
      //     cubes++
      //   }
      // }
      // blueprint["cones (a)"].push(cones);
      // blueprint["cubes (a)"].push(cubes);
      // cubes = 0
      // cones = 0
      // for(let j = 0; j < teleop.markers.length; j++) {
      //   if(teleop.markers[j].type == "cone" && teleop.markers[j].positive == true) {
      //     cones++;
      //   }
      //   if(teleop.markers[j].types == "cube" && teleop.markers[j].positive == true){
      //     cubes++
      //   }
      // }
      // blueprint["cones (t)"].push(cones)
      // blueprint["cubes (t)"].push(cubes)
      // blueprint.coop.push(teleop.attempted_collaboration || auton.attempted_collaboration)
      // blueprint.defense.push(postgame.Defense)
      // blueprint.docking.push((teleop.extra_goal_progress || auton.extra_goal_progress) >= 1 ? 'yes' : 'no')
      // blueprint["drive train"].push(robot_attribute.drive_style)
      // blueprint["final score"].push(postgame.final_score)
      // blueprint["left community"].push(auton.left_community || false)
      // blueprint.manipulator.push(robot_attribute.arm_design)
      // blueprint["match number"].push(pregame.match)
      // blueprint.moved.push(auton.moved)
      // console.log(postgame)
      // blueprint.penalties.push(postgame.penalties)
      // blueprint.points.push(postgame.points)
      // blueprint.preload.push(pregame.preload)
      // blueprint["rank points"].push(postgame.rank_points + "/5")
      // blueprint.response.push(postgame.Offense + "/5")
      // blueprint.startingPos.push(pregame.startingPos)
      //blueprint["rows scored"].push(teleops.markers && autons.markers)
      // blueprint["team number"].push(pregame.teamid)
      // blueprint.timestamp.push(pregame.date)

      // if(cachedRounds.hasOwnProperty(pregame.match)) {
      //   cachedRounds[pregame.match] = await sails.helpers.rounds.getAllOfRoundNumber.with({
      //     round_number: pregame.match,
      //     date: pregame.date
      //   })
      // }
      // let activationBonus = 0;
      
      // for(const cRound in cachedRounds[pregame.match]) {
      //   let ag = cRound.auton.extra_goal_progress;
      //   let tg = cRound.teleop.extra_goal_progress;
      //   activationBonus += ag == 1 ? 8 : ag == 2 ? 12 : 0
      //   activationBonus += tg == 1 ? 6 : tg == 2 ? 10 : 0
      // }

      // blueprint["tried activation"].push(activationBonus >= 1)
      // blueprint["activation bonus"].push(activationBonus >= 26)

      // blueprint["tried community"].push(teleop.attempted_collaboration || auton.attempted_collaboration)
    }*/
    
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
