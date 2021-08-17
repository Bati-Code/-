const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  member_name: String,
  member_Fin_Interest: Array

});

module.exports = mongoose.model('member', memberSchema);