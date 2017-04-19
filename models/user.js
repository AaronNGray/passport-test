var mongoose = require('mongoose');

// create a user model
var User = mongoose.model('User', {
  oauthID: String,
  service: String,
  profile: Object,
  name: String,
  created: Date
});


module.exports = User;
