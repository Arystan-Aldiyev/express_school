const db = require("../models");
const AnswerOption = db.answerOption;
const Question = db.question
// Create and Save one or more AnswerOptions
exports.createAnswerOption = async (req, res) => {
    if (!req.body.option_text || !req.body.question_id) {
        return res.status(400).send({
            message: "Option text and question ID can not be empty!"
        });
    }

    const question = await Question.findByPk(req.body.question_id)
    if (!question) {
        return res.status(404).json({message: "Not question such id"})
    }
    const answerOption = {
        question_id: req.body.question_id,
        option_text: req.body.option_text,
        is_correct: req.body.is_correct || false
    };

    AnswerOption.create(answerOption)
        .then(data => {
            res.status(201).send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the AnswerOption."
            });
        });
};

// Create and Save multiple AnswerOptions
exports.createAnswerOptionsBulk = async (req, res) => {
    if (!req.body.answerOptions || !Array.isArray(req.body.answerOptions)) {
        return res.status(400).send({
            message: "AnswerOptions should be an array!"
        });
    }

    const answerOptions = req.body.answerOptions.map(option => ({
        question_id: option.question_id,
        option_text: option.option_text,
        is_correct: option.is_correct || false
    }));

    const questionIds = [...new Set(answerOptions.map(option => option.question_id))];

    try {
        const questions = await Question.findAll({
            where: {
                question_id: questionIds
            }
        });

        if (questions.length !== questionIds.length) {
            const existingQuestionIds = questions.map(question => question.question_id);
            const missingQuestionIds = questionIds.filter(id => !existingQuestionIds.includes(id));
            return res.status(404).send({
                message: `Questions not found for the following IDs: ${missingQuestionIds.join(', ')}`
            });
        }

        const createdAnswerOptions = await AnswerOption.bulkCreate(answerOptions, {returning: true});
        res.status(201).send(createdAnswerOptions);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the AnswerOptions."
        });
    }
};

exports.findAllAnswerOptionsForAdmin = (req, res) => {
    const {question_id} = req.params;

    AnswerOption.findAll({where: {question_id}})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving answer options."
            });
        });
};

// Retrieve all AnswerOptions for a question
exports.findAllAnswerOptions = (req, res) => {
    const {question_id} = req.params;

    AnswerOption.findAll({where: {question_id}})
        .then(data => {
            const filteredData = data.map(option => ({
                option_id: option.option_id,
                question_id: option.question_id,
                option_text: option.option_text
            }));
            res.send(filteredData);
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
        where: {option_id: id}
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
        where: {option_id: id}
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
        where: {question_id: question_id}
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
