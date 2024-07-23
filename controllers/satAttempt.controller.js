const db = require('../models');
const SatAttempt = db.satAttempt;
const SatAnswer = db.satAnswer;
const SatTest = db.satTest;
const SatQuestion = db.satQuestion;
const SatAnswerOption = db.satAnswerOption;

// Retrieve all attempts for a user
exports.findAllAttempts = (req, res) => {
    const user_id = req.params.user_id;
    const userRole = req.userRole;

    if (userRole !== 'admin' && userRole !== 'teacher' && req.userId !== user_id) {
        return res.status(403).json("You don't have access to these attempts");
    }

    SatAttempt.findAll({
        where: {
            user_id: user_id
        },
        include: [
            {
                model: SatTest,
                as: 'sat_test',
                attributes: ['sat_test_id', 'name', 'group_id']
            }
        ]
    })
        .then(data => {
            const attempts = data.map(attempt => ({
                attempt_id: attempt.sat_attempt_id,
                user_id: attempt.user_id,
                test_id: attempt.test_id,
                start_time: attempt.start_time,
                end_time: attempt.end_time,
                verbal_score: attempt.verbal_score,
                sat_score: attempt.sat_score,
                total_score: attempt.total_score,
                SatTest: attempt.SatTest
            }));
            res.send(attempts);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || 'Some error occurred while retrieving attempts.'
            });
        });
};

// Retrieve all answers for an attempt
exports.findAnswersForAttempt = async (req, res) => {
    const attempt_id = req.params.attempt_id;
    const userId = req.params.user_id;
    const userRole = req.userRole;

    if (userRole !== 'admin' && userRole !== 'teacher' && userId !== req.userId) {
        return res.status(403).json("You don't have access to this attempt");
    }

    try {
        let attempt = await SatAttempt.findOne({
            where: {sat_attempt_id: attempt_id, user_id: userId},
            include: [
                {
                    model: SatTest,
                    as: 'sat_test',
                    include: [
                        {
                            model: SatQuestion,
                            as: 'sat_questions',
                            include: [
                                {
                                    model: SatAnswer,
                                    as: 'sat_answers',
                                    where: {sat_attempt_id: attempt_id, user_id: userId},
                                    required: false
                                },
                                {
                                    model: SatAnswerOption,
                                    as: 'sat_answer_options'
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        if (!attempt) {
            return res.status(404).send({
                message: 'No attempt found with this id for the user.'
            });
        }

        if (!attempt.sat_test || !attempt.sat_test.sat_questions) {
            return res.status(404).send({
                message: 'No questions found for the test associated with this attempt.'
            });
        }

        const verbalScore = calculateScore(attempt.sat_test.sat_questions, 'verbal');
        const satScore = calculateScore(attempt.sat_test.sat_questions, 'sat');
        const totalScore = verbalScore + satScore;

        await attempt.update({verbal_score: verbalScore, sat_score: satScore, total_score: totalScore});

        const transformedData = {
            attempt: {
                sat_attempt_id: attempt.sat_attempt_id,
                test_id: attempt.test_id,
                user_id: attempt.user_id,
                start_time: attempt.start_time,
                end_time: attempt.end_time,
                verbal_score: verbalScore,
                sat_score: satScore,
                total_score: totalScore,
                sat_test: {
                    test_id: attempt.sat_test.test_id,
                    group_id: attempt.sat_test.group_id,
                    name: attempt.sat_test.name,
                    time_open: attempt.sat_test.time_open,
                    duration_minutes: attempt.sat_test.duration_minutes,
                    max_attempts: attempt.sat_test.max_attempts,
                    sat_questions: attempt.sat_test.sat_questions.map(question => {
                        const userAnswer = question.sat_answers.find(answer => answer.sat_question_id === question.sat_question_id);
                        return {
                            sat_question_id: question.sat_question_id,
                            question_text: question.question_text,
                            hint: question.hint,
                            image: question.image,
                            explanation: question.explanation,
                            section: question.section,
                            sat_answer_options: question.sat_answer_options ? question.sat_answer_options.map(option => {
                                return {
                                    sat_answer_option_id: option.sat_answer_option_id,
                                    option_text: option.option_text,
                                    is_correct: option.is_correct,
                                    selected: userAnswer ? parseInt(userAnswer.selected_option) === option.sat_answer_option_id : false
                                };
                            }) : []
                        };
                    })
                }
            }
        };

        res.status(200).send(transformedData);
    } catch (err) {
        res.status(500).send({
            message: err.message || 'Some error occurred while retrieving answers.'
        });
    }
};

const calculateScore = (questions, section) => {
    let score = 0;
    questions.forEach(question => {
        if (question.section === section) {
            question.sat_answers.forEach(answer => {
                const correctOption = question.sat_answer_options.find(option => option.is_correct);
                if (correctOption && correctOption.sat_answer_option_id === answer.selected_option) {
                    score += 1; // or any other scoring logic
                }
            });
        }
    });
    return score;
};

// Delete an attempt
exports.deleteAttempt = (req, res) => {
    const id = req.params.id;

    SatAttempt.destroy({
        where: {sat_attempt_id: id}
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: 'Attempt was deleted successfully!'
                });
            } else {
                res.status(404).send({
                    message: `Cannot delete Attempt with id=${id}. Maybe Attempt was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: 'Could not delete Attempt with id=' + id
            });
        });
};
