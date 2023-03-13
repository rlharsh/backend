const Poll = require('../models/Poll');
const bcrypt = require('bcryptjs');
const ref = require('referral-codes');



// Show list of Polls
const index = (req, res, next) => {
    Poll.find()
        .then(response => {
            res.json({
                response
            })
        })
        .catch(error => {
            res.json({
                message: 'An error has occured!'
            })
        })
}

// Show single Poll
const show = (req, res, next) => {
    let pollID = req.body.pollID
    Poll.findById(pollID)
        .then(response => {
            res.json({
                response
            })
        })
        .catch(error => {
            res.json({
                message: 'An error has occured!'
            })
        })
}

// Get a specific poll
const getSingle = async (req, res, next) => {
    let pollID = req.params.id;

    //const poll = await Poll.findOne({ code: pollID });

    Poll.findOne({code: pollID})
        .then(response => {
            res.json({
                response
            })
        })
        .catch(error => {
            res.json({
                message: 'An error has occured!'
            })
        });
}

// Process a vote
const vote = async (req, res, next) => {
    try {
        let id = req.body.id;

        Poll.findOne({ code: id })
            .then(response => {

                console.log(response._id)
                
                Poll.findByIdAndUpdate(response._id, 
                    { $push: {votes: req.body.response } }
                    )

                Poll.updateOne(
                    { '_id': response._id },
                    { $push: { votes: req.body.response } },
                    function(err, doc) {
                        if(err) {
                            console.log(err);
                        } else {
                            console.log("updated")
                        }
                    }
                )

                res.json({
                    response
                })
            })
            .catch(error => {
                res.json({
                    message: error
                })
            })
    } catch(err) {
        
    }
}

// Store poll to db
const store = async (req, res, next) => {
    try {
        const response = await generateRefCode();
        const poll = new Poll({
            question: req.body.question,
            response: req.body.responses,
            expiry: req.body.expiry,
            code: response[0]
        });

        const savedPoll = await poll.save()
            .then(() => {
                res.json({ message: response[0] });
            });

    } catch(error) {
        res.json({message: error})
    }
}

async function generateRefCode() {
    let codex = ref.generate({
        length: 32,
        count: 1
    })

    const query = { code: codex }
    try {
        const result = await Poll.findOne(query);
        if (result === null) {
            return codex;
        } else {
            return generateRefCode();
        }
    } catch(e) {
        console.log(e.message);
    }
}
 
// Update a poll
const update = (req, res, next) => {
    let pollID = req.body.pollID;

    let updatedData = {
        name: req.body.name,
        question: req.body.question,
        answers: req.body.answers,
        banner: req.body.banner
    }

    Poll.findByIdAndUpdate(pollID, {$set: updatedData})
        .then(() => {
            res.json({
                message: 'Record updated successfully!'
            })
        })
        .catch(error => {
            res.json({
                message: 'An error has occured!'
            })
        })
}

// Delete a poll
const destroy = (req, res, next) => {
    let pollID = req.body.pollID;
    Poll.findByIdAndRemove(pollID)
        .then(() => {
            req.json({
                message: 'Poll deleted successfully!'
            })
        })
        .catch(error => {
            req.json({
                message: 'An error has occured!'
            })
        })
}

module.exports = {
    index, show, store, update, destroy, getSingle, vote
}