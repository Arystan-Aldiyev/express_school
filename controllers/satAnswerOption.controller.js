const db = require('../models');
const SatAnswerOption = db.satAnswerOption;
const SatQuestion = db.satQuestion

// Create and Save one or more AnswerOptions
exports.createAnswerOption = async (req, res) => {
    const {option_text, question_id, is_correct = false} = req.body;

    if (!option_text || !question_id) {
        return res.status(400).send({
            message: 'Option text and question ID cannot be empty!',
        });
    }

    try {
        const satQuestion = await SatQuestion.findByPk(question_id);

        if (!satQuestion) {
            return res.status(404).json({message: "No SAT question found with such ID"});
        }

        const answerOption = {
            question_id,
            text: option_text,
            is_correct,
        };

        const data = await SatAnswerOption.create(answerOption);
        res.status(201).send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || 'Some error occurred while creating the AnswerOption.',
        });
    }
};

exports.createAnswerOptionsBulk = async (req, res) => {
    const {answerOptions} = req.body;


    if (!answerOptions || !Array.isArray(answerOptions)) {
        return res.status(400).send({
            message: 'AnswerOptions should be an array!',
        });
    }


    try {
        const questionIds = [...new Set(answerOptions.map(option => option.question_id))];

        const satQuestions = await SatQuestion.findAll({
            where: {
                sat_question_id: questionIds
            }
        });


        const foundQuestionIds = satQuestions.map(q => q.sat_question_id);
        const missingQuestionIds = questionIds.filter(id => !foundQuestionIds.includes(id));

        if (missingQuestionIds.length > 0) {
            return res.status(404).json({message: `No SAT questions found with IDs: ${missingQuestionIds.join(', ')}`});
        }

        const formattedAnswerOptions = answerOptions.map((option) => ({
            question_id: option.question_id,
            text: option.option_text,
            is_correct: option.is_correct || false,
        }));

        const data = await SatAnswerOption.bulkCreate(formattedAnswerOptions, {returning: true});
        res.status(201).send(data.map(option => ({id: option.id, ...option.get()})));
    } catch (err) {
        res.status(500).send({
            message: err.message || 'Some error occurred while creating the AnswerOptions.',
        });
    }
};

// Retrieve all AnswerOptions for admin
exports.findAllAnswerOptionsForAdmin = (req, res) => {
    const {question_id} = req.params;

    SatAnswerOption.findAll({where: {question_id}, order: [['sat_answer_option_id', 'ASC']]})
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

    SatAnswerOption.findAll({where: {question_id}, order: [['sat_answer_option_id', 'ASC']]})
        .then((data) => {
            const filteredData = data.map((option) => ({
                sat_answer_option_id: option.sat_answer_option_id,
                question_id: option.question_id,
                option_text: option.text,
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
