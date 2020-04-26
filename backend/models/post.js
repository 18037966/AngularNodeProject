const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  title: { type: String, required: true},
  content: { type: String, required: true}
});

module.exports = mongoose.model('Post', postSchema); //model method gives a constructor. So we can use new keyword to create an instance
