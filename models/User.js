const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema( {
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    displayName: {
        type: String,
        'default': 'PollMe User'
    }
}, {timestamps: true})

const User = mongoose.model('User', userSchema);
module.exports = User;