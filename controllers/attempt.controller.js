const db = require("../models");
const Attempt = db.attempt;
const Answer = db.answer;
const Question = db.question;
const AnswerOption = db.answerOption;


// Create and Save a new Attempt
exports.createAttempt = (req, res) => {
    // Validate request
    if (!req.body.test_id || !req.body.user_id) {
        return res.status(400).send({
            message: "Test ID and User ID cannot be empty!"
        });
    }

    // Create an Attempt
    const attempt = {
        test_id: req.body.test_id,
        user_id: req.body.user_id,
        start_time: req.body.start_time,
        end_time: req.body.end_time,
        score: req.body.score
    };

    // Save Attempt in the database
    Attempt.create(attempt)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Attempt."
            });
        });
};

// Retrieve all Attempts from the database
exports.findAllAttempts = (req, res) => {
    Attempt.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving attempts."
            });
        });
};

// Find a single Attempt with an ID
exports.findOneAttempt = (req, res) => {
    const id = req.params.id;

    Attempt.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Attempt with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Attempt with id=" + id
            });
        });
};

// Update an Attempt by the ID in the request
exports.updateAttempt = (req, res) => {
    const id = req.params.id;

    Attempt.update(req.body, {
        where: { attempt_id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Attempt was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Attempt with id=${id}. Maybe Attempt was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Attempt with id=" + id
            });
        });
};

// Delete an Attempt with the specified ID in the request
exports.deleteAttempt = (req, res) => {
    const id = req.params.id;

    Attempt.destroy({
        where: { attempt_id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Attempt was deleted successfully!"
                });
            } else {
                res.send({
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


exports.submitAttempt = async (req, res) => {
    const { user_id, test_id } = req.body;

    // Validate request
    if (!user_id || !test_id) {
        return res.status(400).send({
            message: "User ID and Test ID are required."
        });
    }

    try {
        // Fetch the existing attempt record
        let attempt = await Attempt.findOne({
            where: { user_id: user_id, test_id: test_id, end_time: null }
        });

        if (!attempt) {
            return res.status(404).send({
                message: "No ongoing attempt found for the user and test."
            });
        }

        // Retrieve all answers for this attempt
        const answers = await Answer.findAll({ where: { attempt_id: attempt.attempt_id } });

        let correctAnswersCount = 0;

        // Evaluate the answers
        for (const answer of answers) {
            const { question_id, student_answer: selected_option_id } = answer;

            // Fetch the correct answer for the question
            const correctOption = await AnswerOption.findOne({
                where: {
                    question_id: question_id,
                    is_correct: true
                }
            });

            const isCorrect = correctOption && correctOption.option_id === selected_option_id;
            if (isCorrect) {
                correctAnswersCount++;
            }
        }

        // Calculate the score
        const totalQuestions = answers.length;
        const score = (correctAnswersCount / totalQuestions) * 100;

        // Update the attempt with the score and end time
        await attempt.update({ score: score, end_time: new Date() });

        res.send({
            message: "Attempt submitted and evaluated successfully.",
            score: score
        });
    } catch (error) {
        res.status(500).send({
            message: "Some error occurred while submitting the attempt.",
            error: error.message
        });
    }
};
