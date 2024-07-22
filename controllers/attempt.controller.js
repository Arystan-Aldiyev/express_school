const db = require("../models");
const Attempt = db.attempt;
const Answer = db.answer;
const Test = db.test;
const Question = db.question;
const AnswerOption = db.answerOption;

// Retrieve all attempts for a user
exports.findAllAttempts = (req, res) => {
    const user_id = req.params.user_id;
    const test_id = req.params.test_id;
    const userRole = req.userRole;

    if (userRole !== 'admin' && userRole !== 'teacher' && req.userId !== user_id) {
        return res.status(409).json("You don't have access to these attempts");
    }

    Attempt.findAll({
        where: {
            user_id: user_id,
            test_id: test_id
        }
    })
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
exports.findAnswersForAttempt = async (req, res) => {
    const attempt_id = req.params.attempt_id;
    const userId = req.params.user_id;
    const userRole = req.userRole;

    if (userRole !== 'admin' && userRole !== 'teacher' && userId !== req.userId) {
        return res.status(409).json("You don't have access to this attempt");
    }

    try {
        let attempt = await Attempt.findOne({
            where: {attempt_id: attempt_id, user_id: userId},
            include: [{
                model: Test,
                as: 'Test',
                include: [{
                    model: Question,
                    as: 'questions',
                    include: [{
                        model: Answer,
                        as: 'Answers',
                        where: {attempt_id: attempt_id, user_id: userId},
                        required: false
                    }, {
                        model: AnswerOption,
                        as: 'answerOptions'
                    }]
                }]
            }]
        });

        console.log(JSON.stringify(attempt));

        if (!attempt) {
            console.log(`No attempt found for attempt_id ${attempt_id} and user_id ${userId}`);
            return res.status(404).send({
                message: "No attempt found with this id for the user."
            });
        }

        if (!attempt.Test || !attempt.Test.questions) {
            console.log(`No questions found for test_id ${attempt.Test.test_id}`);
            return res.status(404).send({
                message: "No questions found for the test associated with this attempt."
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
                Test: {
                    test_id: attempt.Test.test_id,
                    group_id: attempt.Test.group_id,
                    name: attempt.Test.name,
                    time_open: attempt.Test.time_open,
                    duration_minutes: attempt.Test.duration_minutes,
                    max_attempts: attempt.Test.max_attempts,
                    questions: attempt.Test.questions.map(question => {
                        const userAnswer = question.Answers.find(answer => answer.question_id === question.question_id);
                        console.log(JSON.stringify(userAnswer))
                        return {
                            question_id: question.question_id,
                            question_text: question.question_text,
                            hint: question.hint,
                            image: question.image,
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
