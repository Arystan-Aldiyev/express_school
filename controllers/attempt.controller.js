const db = require("../models");
const Attempt = db.attempt;
const Answer = db.answer;
const AnswerOption = db.answerOption;

// Create a new Attempt
exports.createAttempt = (req, res) => {
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

exports.submitAttempt = async (req, res) => {
    const { user_id, test_id } = req.body;

    if (!user_id || !test_id) {
        return res.status(400).send({
            message: "User ID and Test ID are required."
        });
    }

    let test = await db.test.findByPk(test_id);

    if (test.max_attempts !== null) {
        let attempts = await Attempt.findAll({
            where: { user_id: user_id, test_id: test_id }
        });

        if (attempts.length >= test.max_attempts) {
            return res.status(400).send({
                message: "Maximum attempts reached for the test."
            });
        }
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

        const answers = await Answer.findAll({ where: { attempt_id: attempt.attempt_id } });
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
