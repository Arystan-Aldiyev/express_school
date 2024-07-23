const db = require('../models');
const SatAnswerOption = db.satAnswerOption;

// Create and Save one or more AnswerOptions
exports.createAnswerOption = (req, res) => {
    if (!req.body.option_text || !req.body.question_id) {
        return res.status(400).send({
            message: 'Option text and question ID cannot be empty!',
        });
    }

    const answerOption = {
        question_id: req.body.question_id,
        text: req.body.option_text,
        is_correct: req.body.is_correct || false,
    };

    SatAnswerOption.create(answerOption)
        .then((data) => {
            res.status(201).send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || 'Some error occurred while creating the AnswerOption.',
            });
        });
};

// Create and Save multiple AnswerOptions
exports.createAnswerOptionsBulk = (req, res) => {
    if (!req.body.answerOptions || !Array.isArray(req.body.answerOptions)) {
        return res.status(400).send({
            message: 'AnswerOptions should be an array!',
        });
    }

    const answerOptions = req.body.answerOptions.map((option) => ({
        question_id: option.question_id,
        option_text: option.option_text,
        is_correct: option.is_correct || false,
    }));

    SatAnswerOption.bulkCreate(answerOptions, {returning: true})
        .then((data) => {
            res.status(201).send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || 'Some error occurred while creating the AnswerOptions.',
            });
        });
};

// Retrieve all AnswerOptions for admin
exports.findAllAnswerOptionsForAdmin = (req, res) => {
    const {question_id} = req.params;

    SatAnswerOption.findAll({where: {question_id}})
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || 'Some error occurred while retrieving answer options.',
            });
        });
};

// Retrieve all AnswerOptions for a question
exports.findAllAnswerOptions = (req, res) => {
    const {question_id} = req.params;

    SatAnswerOption.findAll({where: {question_id}})
        .then((data) => {
            const filteredData = data.map((option) => ({
                sat_answer_option_id: option.sat_answer_option_id,
                question_id: option.question_id,
                option_text: option.option_text,
            }));
            res.send(filteredData);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || 'Some error occurred while retrieving answer options.',
            });
        });
};

// Find a single AnswerOption with an id
exports.findOneAnswerOption = (req, res) => {
    const id = req.params.id;

    SatAnswerOption.findByPk(id)
        .then((data) => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find AnswerOption with id=${id}.`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: 'Error retrieving AnswerOption with id=' + id,
            });
        });
};

// Update an AnswerOption by the id in the request
exports.updateAnswerOption = (req, res) => {
    const id = req.params.id;

    SatAnswerOption.update(req.body, {
        where: {sat_answer_option_id: id},
    })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: 'AnswerOption was updated successfully.',
                });
            } else {
                res.send({
                    message: `Cannot update AnswerOption with id=${id}. Maybe AnswerOption was not found or req.body is empty!`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: 'Error updating AnswerOption with id=' + id,
            });
        });
};

// Delete an AnswerOption with the specified id in the request
exports.deleteAnswerOption = (req, res) => {
    const id = req.params.id;

    SatAnswerOption.destroy({
        where: {sat_answer_option_id: id},
    })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: 'AnswerOption was deleted successfully!',
                });
            } else {
                res.send({
                    message: `Cannot delete AnswerOption with id=${id}. Maybe AnswerOption was not found!`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: 'Could not delete AnswerOption with id=' + id,
            });
        });
};

// Delete all AnswerOptions for a question
exports.deleteAllAnswerOptions = (req, res) => {
    const question_id = req.params.question_id;

    SatAnswerOption.destroy({
        where: {question_id},
    })
        .then((nums) => {
            res.send({
                message: `${nums} AnswerOptions were deleted successfully!`,
            });
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || 'Some error occurred while removing all answer options.',
            });
        });
};
