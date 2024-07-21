const db = require("../models");
const Group = db.group;
const Test = db.test;
const Question = db.question;
const AnswerOption = db.answerOption;
const Attempt = db.attempt;
const Answer = db.answer;

// Create and Save a new Test
exports.createTest = (req, res) => {
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
        max_attempts: req.body.max_attempts
    };

    if (Group.findByPk(test.group_id) == null) {
        return res.status(404).send({
            message: "Group not found!"
        });
    }


    Test.create(test)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Test."
            });
        });
};

// Retrieve all Tests from the database.
exports.findAllTest = (req, res) => {
    Test.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving tests."
            });
        });
};

// Find a single Test with an id
exports.findOneTest = async (req, res) => {
    const id = req.params.id;

    try {
        const test = await Test.findByPk(id, {
            include: {
                model: Question,
                as: 'questions',
                include: {
                    model: AnswerOption,
                    as: 'answerOptions',
                    attributes: ['option_id', 'question_id', 'option_text']
                }
            }
        });

        if (test) {
            res.send(test);
        } else {
            res.status(404).send({
                message: `Cannot find Test with id=${id}.`
            });
        }
    } catch (err) {
        console.log(err)
        res.status(500).send({
            message: "Error retrieving Test with id=" + id
        });
    }
};


exports.findTestWithDetails = (req, res) => {
    const id = req.params.id;

    Test.findByPk(id, {
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
    })
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Test with id=${id}.`
                });
            }
        })
        .catch(err => {
            console.error("Error retrieving Test with id=" + id, err); // Log the actual error
            res.status(500).send({
                message: "Error retrieving Test with id=" + id
            });
        });
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

            const question = test.questions.find(q => q.question_id === questionId);
            if (!question) {
                continue;
            }

            await Answer.create({
                question_id: questionId,
                user_id: userId,
                student_answer: userAnswer,
                attempt_id: attempt.attempt_id
            });

            const correctOption = question.answerOptions.find(option => option.is_correct);
            if (correctOption && userAnswer === correctOption.option_id) {
                score++;
            }
        }

        attempt.score = score;
        await attempt.save();

        const timeTaken = (endTime - parsedStartTime) / 1000;

        res.json({score, timeTaken});
    } catch (error) {
        console.error(`Error submitting test with id=${testId}`, error);
        res.status(500).json({message: 'Server error', error});
    }
};


// Update a Test by the id in the request
exports.updateTest = (req, res) => {
    const id = req.params.id;

    Test.update(req.body, {
        where: {test_id: id}
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Test was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Test with id=${id}. Maybe Test was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Test with id=" + id
            });
        });
};

// Delete a Test with the specified id in the request
exports.deleteTest = (req, res) => {
    const id = req.params.id;

    Test.destroy({
        where: {test_id: id}
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Test was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Test with id=${id}. Maybe Test was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Test with id=" + id
            });
        });
};
