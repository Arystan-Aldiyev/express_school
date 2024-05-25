const db = require("../models");
const AnswerOption = db.answerOption;

// Create and Save one or more AnswerOptions
exports.createAnswerOptions = (req, res) => {
    if (!req.body.answerOptions && !req.body.option_text) {
        return res.status(400).send({
            message: "AnswerOptions should be an array or option_text should be provided!"
        });
    }

    let answerOptions = [];

    if (Array.isArray(req.body.answerOptions)) {
        answerOptions = req.body.answerOptions.map(option => ({
            question_id: option.question_id,
            option_text: option.option_text,
            is_correct: option.is_correct || false
        }));
    } else {
        answerOptions.push({
            question_id: req.body.question_id,
            option_text: req.body.option_text,
            is_correct: req.body.is_correct || false
        });
    }

    AnswerOption.bulkCreate(answerOptions)
        .then(data => {
            res.status(201).send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the AnswerOptions."
            });
        });
};

// Retrieve all AnswerOptions for a question
exports.findAllAnswerOptions = (req, res) => {
    const question_id = req.params.question_id;

    AnswerOption.findAll({ where: { question_id: question_id } })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving answer options."
            });
        });
};

// Find a single AnswerOption with an id
exports.findOneAnswerOption = (req, res) => {
    const id = req.params.id;

    AnswerOption.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find AnswerOption with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving AnswerOption with id=" + id
            });
        });
};

// Update an AnswerOption by the id in the request
exports.updateAnswerOption = (req, res) => {
    const id = req.params.id;

    AnswerOption.update(req.body, {
        where: { option_id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "AnswerOption was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update AnswerOption with id=${id}. Maybe AnswerOption was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating AnswerOption with id=" + id
            });
        });
};

// Delete an AnswerOption with the specified id in the request
exports.deleteAnswerOption = (req, res) => {
    const id = req.params.id;

    AnswerOption.destroy({
        where: { option_id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "AnswerOption was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete AnswerOption with id=${id}. Maybe AnswerOption was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete AnswerOption with id=" + id
            });
        });
};

// Delete all AnswerOptions for a question
exports.deleteAllAnswerOptions = (req, res) => {
    const question_id = req.params.question_id;

    AnswerOption.destroy({
        where: { question_id: question_id }
    })
        .then(nums => {
            res.send({
                message: `${nums} AnswerOptions were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all answer options."
            });
        });
};
