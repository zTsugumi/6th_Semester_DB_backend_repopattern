var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    facebookId: String,
    admin: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Auto add user and hashed pwd
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);