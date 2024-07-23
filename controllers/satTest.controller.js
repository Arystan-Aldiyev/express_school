const db = require("../models");

const SatTest = db.satTest;
const SatAttempt = db.satAttempt;
const SatAnswer = db.satAnswer;
const SatQuestion = db.satQuestion;
const SatAnswerOption = db.satAnswerOption;

exports.createSatTest = async (req, res) => {
    const {name, group_id, opens, due} = req.body;

    try {
        const satTest = await SatTest.create({
            name,
            group_id,
            opens,
            due,
        });
        res.status(201).json(satTest);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

// Get all SAT tests by group ID
exports.getSatTestsByGroup = async (req, res) => {
    const {group_id} = req.params;

    try {
        const satTests = await SatTest.findAll({
            where: {group_id}
        });
        res.status(200).json(satTests);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

// Get a single SAT test by ID
exports.getSatTestById = async (req, res) => {
    const {id} = req.params;

    try {
        const satTest = await SatTest.findByPk(id);
        if (!satTest) {
            return res.status(404).json({error: 'SAT test not found'});
        }
        res.status(200).json(satTest);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

// Update a SAT test by ID
exports.updateSatTest = async (req, res) => {
    const {id} = req.params;
    const {name, group_id, opens, due} = req.body;

    try {
        const satTest = await SatTest.findByPk(id);
        if (!satTest) {
            return res.status(404).json({error: 'SAT test not found'});
        }

        satTest.name = name;
        satTest.group_id = group_id;
        satTest.opens = opens;
        satTest.due = due;
        await satTest.save();

        res.status(200).json(satTest);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

// Delete a SAT test by ID
exports.deleteSatTest = async (req, res) => {
    const {id} = req.params;

    try {
        const satTest = await SatTest.findByPk(id);
        if (!satTest) {
            return res.status(404).json({error: 'SAT test not found'});
        }

        await satTest.destroy();
        res.status(200).json({message: 'SAT test deleted'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

// Submit SAT test
exports.submitSatTest = async (req, res) => {
    const testId = req.params.id;
    const userId = req.userId;
    const {answers} = req.body;

    try {
        const test = await SatTest.findOne({
            where: {sat_test_id: testId},
            include: [{
                model: SatQuestion,
                as: 'sat_questions',
                include: [{
                    model: SatAnswerOption,
                    as: 'sat_answer_options'
                }]
            }]
        });

        if (!test) {
            return res.status(404).json({message: 'Test not found'});
        }

        let verbalScore = 0;
        let satScore = 0;

        const attempt = await SatAttempt.create({
            test_id: testId,
            user_id: userId,
            verbal_score: 0,
            sat_score: 0,
            total_score: 0
        });

        for (const section in answers) {
            for (const answer of answers[section]) {
                const questionId = answer.question_id;
                const userAnswer = answer.option_id;
                const question = test.sat_questions.find(q => q.sat_question_id === questionId);
                if (!question) {
                    continue;
                }

                await SatAnswer.create({
                    sat_question_id: questionId,
                    user_id: userId,
                    selected_option: userAnswer,
                    sat_attempt_id: attempt.sat_attempt_id
                });

                const correctOption = question.sat_answer_options.find(option => option.is_correct);
                if (correctOption && userAnswer === correctOption.sat_answer_option_id) {
                    if (section === 'verbal') {
                        verbalScore++;
                    } else if (section === 'sat') {
                        satScore++;
                    }
                }
            }
        }

        const totalScore = verbalScore + satScore;
        attempt.verbal_score = verbalScore;
        attempt.sat_score = satScore;
        attempt.total_score = totalScore;
        await attempt.save();

        res.json({
            scores: {
                totalScore,
                verbalScore,
                satScore
            }
        });
    } catch (error) {
        console.error(`Error submitting test with id=${testId}`, error);
        res.status(500).json({message: 'Server error', error});
    }
};
