const db = require("../models");
const Attempt = db.attempt;
const Answer = db.answer;
const AnswerOption = db.answerOption;
const Test = db.test;
const Question = db.question;

// Create a new Attempt and return the test with questions
exports.createAttempt = async (req, res) => {
    const { user_id, test_id } = req.body;

    if (!user_id || !test_id) {
        return res.status(400).send({
            message: "User ID and Test ID cannot be empty!"
        });
    }

    const attempt = {
        user_id: user_id,
        test_id: test_id,
        start_time: new Date(),
        end_time: null,
        score: null
    };

    try {
        const newAttempt = await Attempt.create(attempt);
        const testWithQuestions = await Test.findByPk(test_id, {
            include: [
                {
                    model: Question,
                    as: 'questions',
                    include: [
                        {
                            model: AnswerOption,
                            as: 'answerOptions'
                        }
                    ]
                }
            ]
        });

        if (!testWithQuestions) {
            return res.status(404).send({
                message: "Test not found."
            });
        }

        res.send({
            attempt: newAttempt,
            test: testWithQuestions
        });
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Attempt."
        });
    }
};

// Submit an attempt with answers and calculate the score
exports.submitAttempt = async (req, res) => {
    const { user_id, test_id, answers } = req.body;

    if (!user_id || !test_id || !answers || !Array.isArray(answers)) {
        return res.status(400).send({
            message: "User ID, Test ID, and answers are required."
        });
    }

    try {
        let attempt = await Attempt.findOne({
            where: { user_id: user_id, test_id: test_id, end_time: null }
        });

        if (!attempt) {
            return res.status(404).send({
                message: "No ongoing attempt found for the user and test."
            });
        }

        let correctAnswersCount = 0;

        for (const answer of answers) {
            const { question_id, student_answer } = answer;

            // Check if the student_answer text matches any correct option
            const correctOption = await AnswerOption.findOne({
                where: {
                    question_id: question_id,
                    option_text: student_answer,
                    is_correct: true
                }
            });

            if (correctOption) {
                correctAnswersCount++;
            }

            // Save the answer
            await Answer.create({
                attempt_id: attempt.attempt_id,
                question_id: question_id,
                student_answer: student_answer
            });
        }

        const totalQuestions = answers.length;
        const score = (correctAnswersCount / totalQuestions) * 100;

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

// Retrieve all attempts for a user
exports.findAllAttempts = (req, res) => {
    const user_id = req.params.user_id;

    Attempt.findAll({ where: { user_id: user_id } })
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
exports.findAnswersForAttempt = (req, res) => {
    const attempt_id = req.params.attempt_id;

    Answer.findAll({ where: { attempt_id: attempt_id } })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving answers."
            });
        });
};

// Delete an attempt
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
