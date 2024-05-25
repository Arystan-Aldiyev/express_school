const db = require("../models");
const Question = db.question;
const Test = db.test;

// Create and Save a new Question
exports.createQuestion = (req, res) => {
    // Validate request
    if (!req.body.question_text || !req.body.test_id) {
        return res.status(400).send({
            message: "Question text and test ID cannot be empty!"
        });
    }

    // Create a Question
    const question = {
        test_id: req.body.test_id,
        question_text: req.body.question_text,
        hint: req.body.hint
    };

    Test.findByPk(question.test_id)
        .then(test => {
            if (!test) {
                return res.status(404).send({
                    message: "Test not found!"
                });
            }

            Question.create(question)
                .then(data => {
                    res.send(data);
                })
                .catch(err => {
                    res.status(500).send({
                        message: err.message || "Some error occurred while creating the Question."
                    });
                });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error retrieving Test."
            });
        });
};

// Retrieve all Questions from the database.
exports.findAllQuestions = (req, res) => {
    Question.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving questions."
            });
        });
};

// Find a single Question with an id
exports.findOneQuestion = (req, res) => {
    const id = req.params.id;

    Question.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Question with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Question with id=" + id
            });
        });
};

// Update a Question by the id in the request
exports.updateQuestion = (req, res) => {
    const id = req.params.id;

    Question.update(req.body, {
        where: { question_id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Question was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Question with id=${id}. Maybe Question was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Question with id=" + id
            });
        });
};

// Delete a Question with the specified id in the request
exports.deleteQuestion = (req, res) => {
    const id = req.params.id;

    Question.destroy({
        where: { question_id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Question was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Question with id=${id}. Maybe Question was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Question with id=" + id
            });
        });
};

// Delete all Questions from the database.
exports.deleteAllQuestions = (req, res) => {
    Question.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Questions were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all questions."
            });
        });
};
