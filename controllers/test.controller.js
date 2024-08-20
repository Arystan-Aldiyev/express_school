const db = require("../models");
const {awsRegion} = require("../config/aws.config");
const Group = db.group;
const Test = db.test;
const Question = db.question;
const AnswerOption = db.answerOption;
const Attempt = db.attempt;
const Answer = db.answer;
const SuspendTestAnswer = db.suspendTestAnswer;

// Create and Save a new Test
exports.createTest = async (req, res) => {
    // Validate request
    if (!req.body.name) {
        return res.status(400).send({
            message: "Test name can not be empty!"
        });
    }

    // Create a Test
    const test = {
        group_id: req.body.group_id,
        name: req.body.name,
        time_open: req.body.time_open,
        duration_minutes: req.body.duration_minutes,
        max_attempts: req.body.max_attempts,
        subject: req.body.subject
    };

    try {
        const group = await Group.findByPk(test.group_id);
        if (!group) {
            return res.status(404).send({
                message: "Group not found!"
            });
        }

        const data = await Test.create(test);
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Test."
        });
    }
};

// Retrieve all Tests from the database.
exports.findAllTest = async (req, res) => {
    try {
        const data = await Test.findAll({
            order: [['test_id', 'ASC']]
        });
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving tests."
        });
    }
};

exports.findAllTestByGroupId = async (req, res) => {
    const groupId = req.params.group_id;
    const userId = req.userId;

    try {
        const tests = await Test.findAll({
            where: {group_id: groupId},
            include: [{
                model: SuspendTestAnswer,
                as: 'SuspendTestAnswers',
                where: {user_id: userId},
                required: false
            }],
            order: [['test_id', 'ASC']]
        });

        const transformedTests = tests.map(test => {
            const hasSuspendedAnswers = test.SuspendTestAnswers && test.SuspendTestAnswers.length > 0;
            const testJSON = test.toJSON();
            delete testJSON.SuspendTestAnswers;
            return {
                ...testJSON,
                continue: hasSuspendedAnswers,
                is_completed: !hasSuspendedAnswers
            };
        });

        res.send(transformedTests);
    } catch (err) {
        console.error('Error retrieving tests:', err);
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving tests."
        });
    }
};

exports.getTestsBySubject = async (req, res) => {
    const subject = req.params.subject;
    if (!subject) {
        return res.status(400).send({
            message: "Subject parameter is required"
        });
    }

    try {
        const tests = await Test.findAll({where: {subject}, order: [['test_id', 'ASC']]});
        if (tests.length > 0) {
            res.status(200).json(tests);
        } else {
            res.status(404).send({
                message: "No tests found for this subject"
            });
        }
    } catch (err) {
        console.error('Error retrieving tests by subject:', err);
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving tests."
        });
    }
};

// Find a single Test with an id
exports.findOneTest = async (req, res) => {
    const id = req.params.id;

    try {
        const test = await Test.findByPk(id);
        if (test) {
            res.send(test);
        } else {
            res.status(404).send({
                message: `Cannot find Test with id=${id}.`
            });
        }
    } catch (err) {
        console.error(`Error retrieving Test with id=${id}:`, err);
        res.status(500).send({
            message: `Error retrieving Test with id=${id}`
        });
    }
};

exports.findTestWithDetails = async (req, res) => {
    const id = req.params.id;

    try {
        const data = await Test.findByPk(id, {
            include: [
                {
                    model: Question,
                    as: 'questions',
                    attributes: {exclude: ['explanation', 'explanation_image']},
                    include: [
                        {
                            model: AnswerOption,
                            as: 'answerOptions',
                            attributes: {exclude: ['is_correct']},
                            order: [['option_id', 'ASC']]
                        }
                    ],
                    order: [['question_id', 'ASC']]
                }
            ]
        });
        if (data) {
            res.send(data);
        } else {
            res.status(404).send({
                message: `Cannot find Test with id=${id}.`
            });
        }
    } catch (err) {
        console.error("Error retrieving Test with id=" + id, err); // Log the actual error
        res.status(500).send({
            message: "Error retrieving Test with id=" + id
        });
    }
};

// Update a Test by the id in the request
exports.updateTest = async (req, res) => {
    const id = req.params.id;
    const {subject, group_id, name, time_open, duration_minutes, max_attempts} = req.body;

    try {
        const [updatedCount] = await Test.update(
            {subject, group_id, name, time_open, duration_minutes, max_attempts},
            {where: {test_id: id}}
        );

        if (updatedCount === 1) {
            res.send({
                message: "Test was updated successfully."
            });
        } else {
            res.status(404).send({
                message: `Cannot find Test with id=${id}.`
            });
        }
    } catch (err) {
        console.error(`Error updating Test with id=${id}:`, err);
        res.status(500).send({
            message: `Error updating Test with id=${id}`
        });
    }
};

// Delete a Test with the specified id in the request
exports.deleteTest = async (req, res) => {
    const id = req.params.id;

    try {
        const test = await Test.findByPk(id);
        if (!test) {
            return res.status(404).json({error: 'Test not found'});
        }

        await test.destroy();
        res.status(200).json({message: 'Test deleted'});
    } catch (err) {
        console.error(err)
        res.status(500).send({
            message: "Could not delete Test with id=" + id
        });
    }
};

// Submit Test controller
exports.submitTest = async (req, res) => {
    const testId = req.params.id;
    const userId = req.userId;
    const {answers, startTime} = req.body;

    console.log(`Received startTime: ${startTime}`);
    console.log(req.body);

    try {
        const test = await Test.findOne({
            where: {test_id: testId},
            include: [{
                model: Question,
                as: 'questions',
                include: [{
                    model: AnswerOption,
                    as: 'answerOptions'
                }]
            }]
        });

        if (!test) {
            return res.status(404).json({message: 'Test not found'});
        }

        const attemptsCount = await Attempt.count({
            where: {
                test_id: testId,
                user_id: userId
            }
        });

        if (attemptsCount >= test.max_attempts) {
            return res.status(403).json({message: 'Maximum attempts reached'});
        }

        let score = 0;
        const endTime = new Date();

        const parsedStartTime = new Date(startTime);
        if (isNaN(parsedStartTime.getTime())) {
            return res.status(400).json({message: 'Invalid start time'});
        }

        const attempt = await Attempt.create({
            test_id: testId,
            user_id: userId,
            start_time: parsedStartTime,
            end_time: endTime,
            score: 0
        });

        for (const answer of answers) {
            const questionId = answer.question_id;
            const userAnswer = answer.answer;
            console.log(userAnswer)
            const question = test.questions.find(q => q.question_id === questionId);
            if (!question) {
                continue;
            }
            console.log(JSON.stringify(question, null, 2))

            await Answer.create({
                question_id: questionId,
                user_id: userId,
                student_answer: userAnswer,
                attempt_id: attempt.attempt_id
            });

            if (question.question_type === 'single' || question.question_type === 'multiply') {
                const correctOptions = question.answerOptions.filter(option => option.is_correct);
                const isCorrect = correctOptions.some(correctOption => userAnswer === correctOption.option_id);
                if (isCorrect) {
                    score++;
                    console.log(`Correct answer for question ID: ${questionId}`);
                } else {
                    console.log(`Incorrect answer for question ID: ${questionId}`);
                }
            } else if (question.question_type === 'writing') {
                const correctOption = question.answerOptions.find(option => option.is_correct);
                if (correctOption) {
                    const normalizedUserAnswer = userAnswer.trim().toLowerCase();
                    const normalizedCorrectAnswer = correctOption.option_text.trim().toLowerCase();
                    if (normalizedUserAnswer === normalizedCorrectAnswer) {
                        score++;
                        console.log(`Correct answer for writing question ID: ${questionId}`);
                    } else {
                        console.log(`Incorrect answer for writing question ID: ${questionId}`);
                    }
                }
            }
        }

        attempt.score = score;
        await attempt.save();

        const timeTaken = (endTime - parsedStartTime) / 1000;

        await SuspendTestAnswer.destroy({
            where: {test_id: testId, user_id: userId}
        });

        res.json({score, timeTaken});
    } catch (error) {
        console.error(`Error submitting test with id=${testId}`, error);
        res.status(500).json({message: 'Server error', error});
    }
};


exports.suspendTest = async (req, res) => {
    const testId = req.params.test_id;
    const {answers, startTime} = req.body;
    const userId = req.userId;

    try {
        const test = await Test.findOne({
            where: {test_id: testId},
            include: [{
                model: Question,
                as: 'questions',
                order: [['question_id', 'ASC']],
                include: [{
                    model: AnswerOption,
                    as: 'answerOptions',
                    order: [['option_id', 'ASC']]
                }]
            }]
        });

        if (!test) {
            return res.status(404).json({message: 'Test not found'});
        }

        const suspendTime = new Date();

        await SuspendTestAnswer.destroy({
            where: {
                user_id: userId,
                test_id: testId
            }
        });

        for (const answer of answers) {
            const questionId = answer.question_id;
            const userAnswer = answer.answer;
            const question = test.questions.find(q => q.question_id === questionId);
            if (!question) {
                continue;
            }

            await SuspendTestAnswer.create({
                question_id: questionId,
                user_id: userId,
                student_answer: userAnswer,
                test_id: testId,
                start_time: new Date(startTime),
                suspend_time: suspendTime
            });
        }

        res.status(200).json({message: 'Test suspended successfully'});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'An error occurred while suspending the test'});
    }
}

exports.continueSuspendTest = async (req, res) => {
    const testId = req.params.test_id;
    const userId = req.userId;

    try {
        const test = await Test.findByPk(testId);
        if (!test) {
            return res.status(404).json({message: 'Test not found'});
        }

        const suspendAnswers = await SuspendTestAnswer.findAll({where: {test_id: testId, user_id: userId}});
        if (suspendAnswers.length === 0) {
            return res.status(404).json({message: "You do not have any suspended answers"});
        }

        const testWithOptions = await Test.findOne({
            where: {test_id: testId},
            include: [
                {
                    model: Question,
                    as: 'questions',
                    attributes: {exclude: ['explanation', 'explanation_image']},
                    include: [
                        {
                            model: AnswerOption,
                            as: 'answerOptions',
                            attributes: {exclude: ['is_correct']}
                        },
                        {
                            model: SuspendTestAnswer,
                            as: 'suspendTestAnswers',
                            where: {user_id: userId},
                            required: false
                        }
                    ]
                }
            ]
        });

        if (!testWithOptions) {
            return res.status(404).json({message: 'No suspended answers found for this test'});
        }

        const transformedData = {
            test_id: testWithOptions.test_id,
            group_id: testWithOptions.group_id,
            name: testWithOptions.name,
            time_open: testWithOptions.time_open,
            duration_minutes: testWithOptions.duration_minutes,
            max_attempts: testWithOptions.max_attempts,
            questions: testWithOptions.questions.map(question => {
                const suspendAnswer = question.suspendTestAnswers.find(answer => answer.question_id === question.question_id);
                return {
                    question_id: question.question_id,
                    question_text: question.question_text,
                    hint: question.hint,
                    image: question.image,
                    question_type: question.question_type,
                    student_answer: suspendAnswer ? suspendAnswer.student_answer : null,
                    answerOptions: question.answerOptions.map(option => ({
                        option_id: option.option_id,
                        option_text: option.option_text,
                        is_correct: option.is_correct,
                        selected: suspendAnswer ? parseInt(suspendAnswer.student_answer) === option.option_id : false
                    }))
                };
            })
        };

        res.status(200).json(transformedData);
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: 'Something went wrong'});
    }
}
