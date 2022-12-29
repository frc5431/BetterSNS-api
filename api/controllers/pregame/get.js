module.exports = {


  friendlyName: 'Get',


  description: 'Get pregame.',


  inputs: {
    
  },


  exits: {

  },


  fn: async function (inputs) {
    const teamid = this.req.query.teamNumber;
    const teamName = this.req.query.name;
    date = new Date(this.req.query.date).valueOf() || 0;
    const limit = this.req.query.limit || 1;
    const conditions = {
      where: {}
    }
    if(teamid) {
      conditions.where.teamid = teamid;
    }
    if(teamName) {
      conditions.where.name = teamName;
    }
    if(date) {
      sails.log(date.valueOf())
      conditions.where.date = {">": date.valueOf()}
    }
    const pregame = await Pregame.find(conditions).limit(limit)
    for(let pg of pregame) {
      delete pg.createdAt
      delete pg.updatedAt
      delete pg.id
    }
    // All done.
    return pregame;
  }
};
