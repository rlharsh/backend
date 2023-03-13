const mongoose      = require('mongoose');
const Schema        = mongoose.Schema;

const pollSchema    = new Schema( {

    question: {
        type: String
    },
    response: {
        type: []
    },
    expiry: {
        type: Date
    },
    votes: {
        type: Array,
        'default': []
    },
    code: {
        type: String
    }
}, { timestamps: true });

const Poll = mongoose.model('Poll', pollSchema);
module.exports = Poll;