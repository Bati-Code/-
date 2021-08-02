const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const boardSchema = new mongoose.Schema({
  post_num: Number,
  post_title: String,
  post_author: String,
  post_date: String,
  post_count: Number,
  post_recommend: Number,
  post_yn: String,
  post_content: String,
  post_fin_list: Object,
  post_comment: [{
    comment_content: String,
    comment_author: String, 
    comment_date: String,
    comment_recomment: [{
      recomment_content: String,
      recomment_author: String,
      recomment_date: String
    }]
  }],
  post_recommend_user: [{
    recommend_user: String,
  }]  
  
});

boardSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('board', boardSchema);