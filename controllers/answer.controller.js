const db = require("../models");
const Answer = db.answer;

// Create and Save a new Answer
exports.createAnswer = (req, res) => {
    const { question_id, user_id, student_answer, attempt_id } = req.body;

    // Validate request
    if (!question_id || !user_id || !student_answer || !attempt_id) {
        return res.status(400).send({
            message: "Question ID, User ID, Student Answer, and Attempt ID cannot be empty!"
        });
    }

    // Create an Answer
    const answer = {
        question_id: question_id,
        user_id: user_id,
        student_answer: student_answer,
        attempt_id: attempt_id
    };

    // Save Answer in the database
    Answer.create(answer)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Answer."
            });
        });
};

// Retrieve all Answers for a specific Question
exports.findAllAnswersForQuestion = (req, res) => {
    const question_id = req.params.question_id;

    Answer.findAll({ where: { question_id: question_id } })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving answers."
            });
        });
};

// Retrieve a single Answer by ID
exports.findOneAnswer = (req, res) => {
    const answer_id = req.params.answer_id;

    Answer.findByPk(answer_id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Answer with id=${answer_id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Answer with id=" + answer_id
            });
        });
};

// Update an Answer by the ID in the request
exports.updateAnswer = (req, res) => {
    const answer_id = req.params.answer_id;

    Answer.update(req.body, {
        where: { answer_id: answer_id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Answer was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Answer with id=${answer_id}. Maybe Answer was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Answer with id=" + answer_id
            });
        });
};

// Delete an Answer with the specified ID in the request
exports.deleteAnswer = (req, res) => {
    const answer_id = req.params.answer_id;

    Answer.destroy({
        where: { answer_id: answer_id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Answer was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Answer with id=${answer_id}. Maybe Answer was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Answer with id=" + answer_id
            });
        });
};
