const db = require("../models");
const Attempt = db.attempt;
const Answer = db.answer;
const Test = db.test;
const Question = db.question;

// Retrieve all attempts for a user
exports.findAllAttempts = (req, res) => {
    const user_id = req.params.user_id;

    Attempt.findAll({where: {user_id: user_id}})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving attempts."
            });
        });
};

// Retrieve all answers for an attempt
exports.findAnswersForAttempt = async (req, res) => {
    const attempt_id = req.params.attempt_id;
    const userId = req.userId;
    const userRole = req.userRole;
    try {
        let attempt;
        if (userRole === 'admin' || userRole === 'teacher') {
            attempt = await Attempt.findOne({
                where: {attempt_id: attempt_id},
                include: [{
                    model: Test,
                    as: 'Test',
                    include: [{
                        model: Question,
                        as: 'questions',
                        include: [{
                            model: Answer,
                            as: 'Answers'
                        }]
                    }]
                }]
            });
        } else {
            attempt = await Attempt.findOne({
                where: {attempt_id: attempt_id, user_id: userId},
                include: [{
                    model: Test,
                    as: 'Test',
                    include: [{
                        model: Question,
                        as: 'questions',
                        include: [{
                            model: Answer,
                            as: 'Answers'
                        }]
                    }]
                }]
            });
        }

        if (!attempt) {
            console.log(`No attempt found for attempt_id ${attempt_id} and user_id ${userId}`);
            return res.status(404).send({
                message: "No attempt found with this id for the user."
            });
        }

        if (!attempt.Test || !attempt.Test.questions) {
            console.log(`No questions found for test_id ${attempt.test_id}`);
            return res.status(404).send({
                message: "No questions found for the test associated with this attempt."
            });
        }

        res.status(200).send(attempt);
    } catch (err) {
        console.error('Error while retrieving answers:', err);
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving answers."
        });
    }
};

// Delete an attempt
exports.deleteAttempt = (req, res) => {
    const id = req.params.id;

    Attempt.destroy({
        where: {attempt_id: id}
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Attempt was deleted successfully!"
                });
            } else {
                res.status(404).send({
                    message: `Cannot delete Attempt with id=${id}. Maybe Attempt was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Attempt with id=" + id
            });
        });
};
