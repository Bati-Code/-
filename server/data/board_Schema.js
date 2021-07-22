const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const boardSchema = new mongoose.Schema({
  post_title: String,
  post_author: String,
  post_date: String,
  post_count: Number,
  post_recommend: Number,
  post_yn: String,
  post_content: String
  
});

boardSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('board', boardSchema);