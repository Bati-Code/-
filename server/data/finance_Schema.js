const mongoose = require('mongoose');

const financeSchema = new mongoose.Schema({
  finance_name: String,
  finance_code: String,
  finance_Up_Count: { type: Number, default: 0 },
  finance_Up_Count_User: Array,
  finance_Down_Count: { type: Number, default: 0 },
  finance_Down_Count_User: Array,
  finance_Interest_Count: { type: Number, default: 0 },
});

module.exports = mongoose.model('finance', financeSchema);