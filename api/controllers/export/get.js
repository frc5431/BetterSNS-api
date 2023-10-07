const fetch = require('node-fetch');

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
    // return JSON.stringify({test: await Pregame.find()}, null, ' ')
    const blueprint = {
      // "passed_tba_check": [],
      "team number": [],
      timestamp: [],
      author: [],
      "match number": [],
      moved: [],
      "cones Total (a)": [],
      "cones High (a)": [],
      "cones Mid (a)": [],
      "cones Hybrid (a)": [],
      "cubes Total (a)": [],
      "cubes High (a)": [],
      "cubes Mid (a)": [],
      "cubes Hybrid (a)": [],
      "cubes Total (t)": [],
      "cubes High (t)": [],
      "cubes Mid (t)": [],
      "cubes Hybrid (t)": [],
      "cones Total (t)": [],
      "cones High (t)": [],
      "cones Mid (t)": [],
      "cones Hybrid (t)": [],
      // "Average Cone Location": [],
      // "Average Cube Location": [],
      "points": [],
      "penalties": [],
      "rank points": [],
      "final score": [],
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
      // "tried activation": [],
      // "activation bonus": [],
      "startingPos": [],
      "notes": [],
      "poorlyFilled": [],
      // "tbaScore": [],
    }

    const pregames = await Pregame.find({where:{date: {">": new Date(new Date().getFullYear(), 0, 1).valueOf()}}})
    const autons = await Auton.find({where:{date: {">": new Date(new Date().getFullYear(), 0, 1).valueOf()}}})
    const teleops = await Teleop.find({where:{date: {">": new Date(new Date().getFullYear(), 0, 1).valueOf()}}})
    const postmatches = await Postmatch.find({where:{date: {">": new Date(new Date().getFullYear(), 0, 1).valueOf()}}})
    const robot_attributes = await RobotAttributes.find({where:{date: {">": new Date(new Date().getFullYear(), 0, 1).valueOf()}}})

    let tba = await fetch('https://www.thebluealliance.com/api/v3/event/2023txntx/matches', {
      headers: {
        'X-TBA-Auth-Key': '4636Bn6fKHqHpLwvPqmJDX6QLOHRkNQhSUEM4ciFnKYlnNMxm7dCraEKYvxnZm5B' // Quick and dirty. NEVER STORE API KEY IN PLAINTEXT
      } // guess who uploaded it to prod, lmao
    })

    const tba_json = await tba.json();

    const compiler = {
      REQUIRE_AUTON: 'auton',
      REQUIRE_TELEOP: 'teleop',
      REQUIRE_POSTGAME: 'postgame',
      REQUIRE_ROBOT_ATTRIBUTES: 'robot',
      REQUIRE_PREGAME: 'pregame',
      global_compile_vars: {},
      cur_idx: 0,
      compile: () => {
        for(const pregame of pregames) {
          const auton = autons.find(element => element.form_id === pregame.id)
          const teleop = teleops.find(element => element.form_id === pregame.id)
          const postgame = postmatches.find(element => element.form_id === pregame.id)
          const robot_attribute = robot_attributes.find(element => element.form_id === pregame.id)
          for(const action of compiler.actions) {
            global_compile_vars = {};
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

            // console.log(action.requirements)

            action.callback(meets_req, {pregame: pregame, auton: auton, teleop: teleop, postgame: postgame, robot_attribute: robot_attribute});
            compiler.cur_idx += 1;
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

    // console.log(pregames)

    compiler.addAction((s, r) => {
      if(!s) {
        return;
      }

      blueprint["charged (a)"].push(r.auton.extra_goal_progress)
      blueprint["left community"].push(r.auton.left_community || false)
      blueprint.moved.push(r.auton.moved)

      let poskey = ['mid', 'top', 'hybrid']
      cubes = {top: 0, mid: 0, hybrid: 0}
      cones = {top: 0, mid: 0, hybrid: 0}

      for(let marker of r.auton.markers) {
        if(!marker.positive) {
          continue;
        }

        if(marker.type == "cone") {
          cubes[poskey[marker.y]]++;
        }
        else if(marker.type == 'cube') {
          cones[poskey[marker.y]]++;
        }
      }
      blueprint["cones Total (a)"].push(cones.top + cones.mid + cones.hybrid)
      blueprint["cones High (a)"].push(cones.top)
      blueprint["cones Mid (a)"].push(cones.mid)
      blueprint["cones Hybrid (a)"].push(cones.hybrid)
      
      blueprint["cubes Total (a)"].push(cubes.top + cones.mid + cones.hybrid)
      blueprint["cubes High (a)"].push(cubes.top)
      blueprint["cubes Mid (a)"].push(cubes.mid)
      blueprint["cubes Hybrid (a)"].push(cubes.hybrid)
    }, compiler.REQUIRE_AUTON)

    compiler.addAction((s, r) => {
      if(!s) {
        return;
      }

      blueprint["charged (t)"].push(r.teleop.extra_goal_progress)
      let poskey = ['mid', 'top', 'hybrid']
      cubes = {top: 0, mid: 0, hybrid: 0}
      cones = {top: 0, mid: 0, hybrid: 0}

      for(let marker of r.teleop.markers) {
        if(!marker.positive) {
          continue;
        }

        if(marker.type == "cone") {
          cubes[poskey[marker.y]]++;
        }
        else if(marker.type == 'cube') {
          cones[poskey[marker.y]]++;
        }
      }
      blueprint["cones Total (t)"].push(cones.top + cones.mid + cones.hybrid)
      blueprint["cones High (t)"].push(cones.top)
      blueprint["cones Mid (t)"].push(cones.mid)
      blueprint["cones Hybrid (t)"].push(cones.hybrid)
      
      blueprint["cubes Total (t)"].push(cubes.top + cubes.mid + cubes.hybrid)
      blueprint["cubes High (t)"].push(cubes.top)
      blueprint["cubes Mid (t)"].push(cubes.mid)
      blueprint["cubes Hybrid (t)"].push(cubes.hybrid)
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

      // blueprint["tried activation"].push(activationBonus >= 1)
      // blueprint["activation bonus"].push(activationBonus >= 26)
      blueprint["tried community"].push(r.teleop.attempted_collaboration || r.auton.attempted_collaboration)
    }, [compiler.REQUIRE_AUTON, compiler.REQUIRE_TELEOP])

    compiler.addAction((s, r) => {
      if(!s) {
        return;
      }

      blueprint.author.push(r.pregame.author)
      blueprint["match number"].push(r.pregame.match)
      //just in case
      // if(match.match_number !== r.pregame.match - 1)
      let match = null;

      for (let i = 0; i < tba_json.length; i++) {
        const tempMatch = tba_json[i];
        if (tempMatch.match_number === r.pregame.match) {
          match = tempMatch;
          console.log('found')
          break;
        }
      }
      if(match !== null) {
        const alliance = []
        alliance.push(...match.alliances.red.team_keys)
        alliance.push(...match.alliances.blue.team_keys)
        compiler.global_compile_vars.match = match

        if(alliance.includes("frc" + r.pregame.teamid)) {
          //All good
          blueprint["team number"].push(r.pregame.teamid)
        }else {
          //Bad Data
          blueprint["team number"].push(r.pregame.teamid + " &TBA_DISAGREES&")
          // blueprint.passed_tba_check.push(false)
        }
      }else {
        console.log('null')
        blueprint["team number"].push(r.pregame.teamid)
      }
      

      

      blueprint.preload.push(r.pregame.preload_type)
      blueprint.startingPos.push(r.pregame.startingPos)

      // TODO: Make it so that this becomes which comp this was at instead of date
      let date = new Date(r.pregame.date);
      blueprint.timestamp.push(`${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`)

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
        blueprint.notes.push('')
        return;
      }

      blueprint["rank points"].push(r.postgame.rank_points + " out of 5")
      blueprint.response.push(r.postgame.Offense + " out of 5")
      blueprint.defense.push(r.postgame.Defense)
      blueprint["final score"].push(r.postgame.final_score || 'not present')
      blueprint.penalties.push(r.postgame.penalties || 'not present')
      blueprint.points.push(r.postgame.points || 'not present')
      blueprint.notes.push(r.postgame.Notes || '')
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

    // compiler.addAction((s, r) => {
    //   if(s) {
    //     const match = compiler.global_compile_vars.match
    //     if(blueprint.passed_tba_check.length - 1 === compiler.cur_idx) {
    //       blueprint.tbaScore.push('passed')
    //       return;
    //     }
    //     if(match) {
    //       if(!match.score_breakdown) {
    //         blueprint.passed_tba_check.push(false);
    //         return;
    //       }
    //       const score = match.score_breakdown[r.pregame.alliance === true ? 'blue' : 'red'].totalPoints;
    //       if(score !== r.postgame.points) {
    //         console.log(`${score} was the score from tba, but we reported: ${r.postgame.points}`)
    //         blueprint.passed_tba_check.push(false);
    //       }else {
    //         blueprint.passed_tba_check.push(true);
    //       }
    //     }else {
    //       blueprint.tbaScore.push('lol')
    //       blueprint.passed_tba_check.push(true);
    //     }
    //   }
    // }, [compiler.REQUIRE_PREGAME, compiler.REQUIRE_POSTGAME])

    compiler.addAction((s, r) => {
      let poorlyFilled = false;

      // if(blueprint.passed_tba_check[compiler.cur_idx] === false) {
      //   poorlyFilled = true;
      // }

      blueprint.poorlyFilled.push(poorlyFilled ? 'yes' : 'no');
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
    // console.log(blueprint)
    for(let form = 0; form < blueprint.timestamp.length; form++) {
      for (const [key, value] of Object.entries(blueprint)) {
        csv += value[form] + ","
      }
      csv += "\n"
    }
    csv = csv.substring(0, csv.length - 1)
    // console.log(blueprint.tbaScore.length)
    // All done.
    return csv;

  }


};
