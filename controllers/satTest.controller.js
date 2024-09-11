const db = require("../models");

const SatTest = db.satTest;
const SatAttempt = db.satAttempt;
const SatAnswer = db.satAnswer;
const SatQuestion = db.satQuestion;
const SatAnswerOption = db.satAnswerOption;
const Deadline = db.satTestDeadline
const User = db.user
const Membership = db.groupMembership;
const Group = db.group
const satQuestionMark = db.satQuestionMark

exports.createSatTest = async (req, res) => {
    const {name, deadlines} = req.body;

    const transaction = await db.sequelize.transaction();
    try {
        const satTest = await SatTest.create({
            name,
        }, {transaction});

        if (deadlines && Array.isArray(deadlines)) {
            const deadlineData = deadlines.map(deadline => ({
                ...deadline,
                test_id: satTest.sat_test_id
            }));

            await Deadline.bulkCreate(deadlineData, {transaction});
        }

        await transaction.commit();

        res.status(201).json(satTest);
    } catch (error) {
        await transaction.rollback();
        console.error("Error creating SAT test:", error);
        res.status(500).json({error: "An error occurred while creating the SAT test"});
    }
};


exports.getAllSatTests = async (req, res) => {
    const userId = req.userId;
    try {
        const user = await User.findByPk(userId, {
            include: [{
                model: Membership,
                required: false
            }]
        });

        if (!user) {
            return res.status(404).json({error: "User not found"});
        }

        const satTests = await SatTest.findAll({
            include: [{
                model: Deadline,
                as: 'sat_test_deadlines'
            }]
        });

        if (user.role.toLowerCase() === 'admin' || user.role.toLowerCase() === 'teacher') {
            return res.status(200).json(
                satTests.map(test => ({
                    ...test.toJSON(),
                    is_open: test.sat_test_deadlines.some(deadline => new Date(deadline.open) <= new Date()),
                    is_expired: test.sat_test_deadlines.every(deadline => new Date(deadline.due) < new Date())
                }))
            );
        }

        const memberships = await Membership.findAll({where: {user_id: userId}});

        const userGroupIds = memberships.map(membership => membership.group_id);

        const filteredTests = satTests.filter(test => {
            const relevantDeadlines = test.sat_test_deadlines.filter(deadline =>
                userGroupIds.includes(deadline.group_id) && new Date(deadline.due) > new Date()
            );
            return relevantDeadlines.length > 0;
        });

        return res.status(200).json(
            filteredTests.map(test => ({
                ...test.toJSON(),
                is_open: test.sat_test_deadlines.some(deadline => new Date(deadline.open) <= new Date()),
                is_expired: test.sat_test_deadlines.every(deadline => new Date(deadline.due) < new Date())
            }))
        );

    } catch (error) {
        console.error(error);
        return res.status(500).json({error: "An error occurred while fetching SAT tests"});
    }
};

exports.getSatTestWithDetails = async (req, res) => {
    const {id} = req.params;
    const userId = req.userId

    try {
        const data = await SatTest.findByPk(id, {
            include: [
                {
                    model: SatQuestion,
                    as: 'sat_questions',
                    attributes: ['sat_question_id', 'question_text', 'section', 'hint', 'image', 'question_type', 'test_id', 'createdAt', 'updatedAt'],
                    include: [
                        {
                            model: SatAnswerOption,
                            as: 'sat_answer_options',
                            attributes: {exclude: ['is_correct', 'explanation_image']},
                            order: [['sat_answer_option_id', 'ASC']]
                        }
                    ],
                    order: [['sat_question_id', 'ASC']]
                }
            ],
            order: [['sat_test_id', 'ASC']]
        });
        const user = await User.findByPk(userId);

        const isOpened = data.opens && new Date(data.opens) >= Date.now()

        if (isOpened && user.role.toLowerCase() === 'student') {
            return res.status(400).json({message: "Test has not yet opened or"})
        }

        if (data) {
            const sections = data.sat_questions.reduce((acc, question) => {
                const section = question.section || 'default';
                if (!acc[section]) {
                    acc[section] = [];
                }
                acc[section].push({
                    question: {
                        sat_question_id: question.sat_question_id,
                        question_text: question.question_text,
                        hint: question.hint,
                        image: question.image,
                        test_id: question.test_id,
                        createdAt: question.createdAt,
                        updatedAt: question.updatedAt,
                        question_type: question.question_type,
                        answerOptions: question.sat_answer_options
                    },
                });
                return acc;
            }, {});

            res.status(200).json({
                name: data.name,
                opens: data.opens,
                due: data.due,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
                sections
            });
        } else {
            res.status(404).json({
                message: `Cannot find SAT test with id=${id}.`
            });
        }
    } catch (error) {
        console.error("Error retrieving SAT test with id=" + id, error);
        res.status(500).json({
            message: "Error retrieving SAT test with id=" + id
        });
    }
};

// Get a single SAT test by ID
exports.getSatTestById = async (req, res) => {
    const {id} = req.params;
    const userId = req.userId

    try {
        const satTest = await SatTest.findByPk(id, {
            order: [['sat_test_id', 'ASC']]
        });
        const user = await User.findByPk(userId);

        const isOpened = satTest.opens && new Date(satTest.opens) >= Date.now()

        if (isOpened && user.role.toLowerCase() === 'student') {
            return res.status(400).json({message: "Test has not yet opened or"})
        }

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
    const {name} = req.body;

    try {
        const satTest = await SatTest.findByPk(id);
        if (!satTest) {
            return res.status(404).json({error: 'SAT test not found'});
        }

        if (name) {
            satTest.name = name;
        }

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

        const user = await User.findByPk(userId);
        const isExpired = test.due && new Date(test.due) < Date.now();
        const isOpened = test.opens && new Date(test.opens) >= Date.now();

        if (isExpired && user.role.toLowerCase() === 'student') {
            return res.status(400).json({message: "Test has expired"});
        }
        if (isOpened && user.role.toLowerCase() === 'student') {
            return res.status(400).json({message: "Test has not yet opened"});
        }

        const scores = {};
        const answersToCreate = [];
        const marksToCreate = [];

        const attempt = await SatAttempt.create({
            test_id: testId,
            user_id: userId,
            total_score: 0
        });

        for (const section in answers) {
            scores[section] = 0;

            for (const answer of answers[section]) {
                const questionId = answer.question_id;
                const userAnswer = answer.option_id;
                const isMarked = answer.isMarked;

                const question = test.sat_questions.find(q => q.sat_question_id === questionId);

                if (!question) {
                    continue;
                }

                answersToCreate.push({
                    sat_question_id: questionId,
                    user_id: userId,
                    selected_option: userAnswer,
                    sat_attempt_id: attempt.sat_attempt_id
                });

                if (isMarked) {
                    marksToCreate.push({
                        sat_question_id: questionId,
                        user_id: userId,
                        is_mark: isMarked,
                        sat_attempt_id: attempt.sat_attempt_id
                    });
                }

                if (question.question_type === 'single' || question.question_type === 'multiply') {
                    const correctOptions = question.sat_answer_options.filter(option => option.is_correct);
                    const isCorrect = correctOptions.some(correctOption => userAnswer === correctOption.sat_answer_option_id);
                    if (isCorrect) {
                        scores[section]++;
                    }
                } else if (question.question_type === 'writing') {
                    const correctOption = question.sat_answer_options.find(option => option.is_correct);
                    if (correctOption) {
                        const normalizedUserAnswer = userAnswer.trim().toLowerCase();
                        const normalizedCorrectAnswer = correctOption.option_text.trim().toLowerCase();
                        if (normalizedUserAnswer === normalizedCorrectAnswer) {
                            scores[section]++;
                        }
                    }
                }
            }
        }

        await SatAnswer.bulkCreate(answersToCreate);
        if (marksToCreate.length > 0) {
            await satQuestionMark.bulkCreate(marksToCreate);
        }

        const totalScore = Object.values(scores).reduce((acc, score) => acc + score, 0);

        attempt.total_score = totalScore;
        await attempt.save();

        res.json({
            scores: {
                ...scores,
                totalScore
            }
        });
    } catch (error) {
        console.error(`Error submitting test with id=${testId}`, error);
        res.status(500).json({message: 'Server error', error});
    }
};