const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    year:Number,
    team_name:String,
    game_name:String,
    score:Number
})

const TeamScore = mongoose.model('TeamScore', schema);

module.exports = TeamScore;