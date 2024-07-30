const db = require("../models");
const Attempt = db.attempt;
const Answer = db.answer;
const Test = db.test;
const Question = db.question;
const AnswerOption = db.answerOption;

// Retrieve all attempts for a user
exports.findAllAttempts = async (req, res) => {
    const user_id = req.params.user_id;
    const test_id = req.params.test_id;


    try {
        const attempts = await Attempt.findAll({
            where: {
                user_id: user_id,
                test_id: test_id
            },
            include: [
                {
                    model: Test,
                    as: 'Test',
                    include: [
                        {
                            model: Question,
                            as: 'questions'
                        }
                    ]
                }
            ]
        });

        const transformedData = attempts.map(attempt => ({
            ...attempt.get({plain: true}),
            question_count: attempt.Test.questions.length
        }));

        res.send(transformedData);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving attempts."
        });
    }
};

// Retrieve all answers for an attempt
exports.findAnswersForAttempt = async (req, res) => {
    const attempt_id = req.params.attempt_id;
    const userId = req.params.user_id;

    try {
        let attempt = await Attempt.findOne({
            where: {attempt_id: attempt_id, user_id: userId},
            include: [
                {
                    model: Test,
                    as: 'Test',
                    include: [
                        {
                            model: Question,
                            as: 'questions',
                            include: [
                                {
                                    model: Answer,
                                    as: 'Answers',
                                    where: {attempt_id: attempt_id, user_id: userId},
                                    required: false
                                },
                                {
                                    model: AnswerOption,
                                    as: 'answerOptions'
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        if (!attempt) {
            return res.status(404).send({
                message: "No attempt found with this id for the user."
            });
        }

        const transformedData = {
            attempt: {
                attempt_id: attempt.attempt_id,
                test_id: attempt.test_id,
                user_id: attempt.user_id,
                start_time: attempt.start_time,
                end_time: attempt.end_time,
                score: attempt.score,
                question_count: attempt.Test.questions.length,
                test: {
                    test_id: attempt.Test.test_id,
                    group_id: attempt.Test.group_id,
                    name: attempt.Test.name,
                    time_open: attempt.Test.time_open,
                    duration_minutes: attempt.Test.duration_minutes,
                    max_attempts: attempt.Test.max_attempts,
                    questions: attempt.Test.questions.map(question => {
                        const userAnswer = question.Answers.find(answer => answer.question_id === question.question_id);
                        return {
                            question_id: question.question_id,
                            question_text: question.question_text,
                            hint: question.hint,
                            image: question.image,
                            explanation: question.explanation,
                            answerOptions: question.answerOptions ? question.answerOptions.map(option => {
                                return {
                                    option_id: option.option_id,
                                    option_text: option.option_text,
                                    is_correct: option.is_correct,
                                    selected: userAnswer ? parseInt(userAnswer.student_answer) === option.option_id : false
                                };
                            }) : []
                        };
                    })
                }
            }
        };

        res.status(200).send(transformedData);
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
