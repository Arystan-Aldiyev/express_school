const path = require('path');
const db = require('../models');
const {v4: uuidv4} = require('uuid');
const {awsBucketName} = require('../config/aws.config');
const {s3} = require('../services/amazon.s3.service');
const SatQuestion = db.satQuestion;
const SatTest = db.satTest

// Create a new question
exports.createSatQuestion = async (req, res) => {
    let imagePath = null;
    let explanationImagePath = null;

    if (!req.body.test_id) {
        return res.status(400).json({message: 'Test id is required'});
    }

    if (req.files && req.files['image']) {
        const originalName = path.parse(req.files['image'][0].originalname).name;
        const extension = path.extname(req.files['image'][0].originalname);
        const truncatedName = originalName.length > 20 ? originalName.substring(0, 20) : originalName;
        const shortUuid = uuidv4().split('-')[0];
        const fileName = `${truncatedName}-${shortUuid}${extension}`;

        const params = {
            Bucket: awsBucketName,
            Key: `questions/${fileName}`,
            Body: req.files['image'][0].buffer,
            ContentType: req.files['image'][0].mimetype,
        };

        try {
            const data = await s3.upload(params).promise();
            imagePath = data.Location;
        } catch (err) {
            return res.status(500).send({message: err.message});
        }
    }

    if (req.files && req.files['explanation_image']) {
        const originalName = path.parse(req.files['explanation_image'][0].originalname).name;
        const extension = path.extname(req.files['explanation_image'][0].originalname);
        const truncatedName = originalName.length > 20 ? originalName.substring(0, 20) : originalName;
        const shortUuid = uuidv4().split('-')[0];
        const fileName = `${truncatedName}-${shortUuid}${extension}`;

        const params = {
            Bucket: awsBucketName,
            Key: `questions/${fileName}`,
            Body: req.files['explanation_image'][0].buffer,
            ContentType: req.files['explanation_image'][0].mimetype,
        };

        try {
            const data = await s3.upload(params).promise();
            explanationImagePath = data.Location;
        } catch (err) {
            return res.status(500).send({message: err.message});
        }
    }

    try {
        const sat_test = await SatTest.findByPk(req.body.test_id);
        if (!sat_test) {
            return res.status(404).json({message: "No SAT test with such id"});
        }
        const question = await SatQuestion.create({
            test_id: req.body.test_id,
            question_text: req.body.question_text,
            hint: req.body.hint,
            image: imagePath,
            explanation_image: explanationImagePath,
            explanation: req.body.explanation,
            section: req.body.section,
            question_type: req.body.question_type
        });
        res.status(201).send(question);
    } catch (err) {
        res.status(500).send({message: err.message});
    }
};

// Get all questions
exports.findAllQuestions = async (req, res) => {
    try {
        const questions = await SatQuestion.findAll({order: [['sat_question_id', 'ASC']]});
        res.status(200).send(questions);
    } catch (err) {
        res.status(500).send({message: err.message});
    }
};

// Get all questions by section and test ID
exports.findQuestionsBySectionAndTestId = async (req, res) => {
    const {section, test_id} = req.params;

    try {
        const questions = await SatQuestion.findAll({
            where: {section, test_id},
            order: [['sat_question_id', 'ASC']]
        });
        res.status(200).send(questions);
    } catch (err) {
        res.status(500).send({message: err.message});
    }
};

// Get all questions by test ID
exports.findQuestionsByTestId = async (req, res) => {
    const {test_id} = req.params;

    try {
        const questions = await SatQuestion.findAll({
            where: {test_id},
            order: [['sat_question_id', 'ASC']]
        });
        res.status(200).send(questions);
    } catch (err) {
        res.status(500).send({message: err.message});
    }
};

// Find a single question by ID
exports.findOneQuestion = async (req, res) => {
    const id = req.params.id;

    try {
        const question = await SatQuestion.findByPk(id);
        if (question) {
            res.send(question);
        } else {
            res.status(404).send({message: `Cannot find Question with id=${id}.`});
        }
    } catch (err) {
        res.status(500).send({message: `Error retrieving Question with id=${id}`});
    }
};

// Full update a question by ID (PUT)
exports.updateQuestion = async (req, res) => {
    const id = req.params.id;

    try {
        const question = await SatQuestion.findByPk(id);

        if (!question) {
            return res.status(404).send({message: `Cannot update Question with id=${id}. Maybe Question was not found!`});
        }

        let imagePath = question.image;
        let explanationImagePath = question.explanation_image;

        if (req.files && req.files['image']) {
            if (question.image) {
                const oldImageKey = question.image.split('/').pop();
                await s3.deleteObject({
                    Bucket: awsBucketName,
                    Key: `questions/${oldImageKey}`,
                }).promise();
            }

            const originalName = path.parse(req.files['image'][0].originalname).name;
            const extension = path.extname(req.files['image'][0].originalname);
            const truncatedName = originalName.length > 20 ? originalName.substring(0, 20) : originalName;
            const shortUuid = uuidv4().split('-')[0]; // Shorter UUID
            const fileName = `${truncatedName}-${shortUuid}${extension}`;

            const params = {
                Bucket: awsBucketName,
                Key: `questions/${fileName}`,
                Body: req.files['image'][0].buffer,
                ContentType: req.files['image'][0].mimetype,
            };

            const data = await s3.upload(params).promise();
            imagePath = data.Location;
        }

        if (req.files && req.files['explanation_image']) {
            if (question.explanation_image) {
                const oldExplanationImageKey = question.explanation_image.split('/').pop();
                await s3.deleteObject({
                    Bucket: awsBucketName,
                    Key: `questions/${oldExplanationImageKey}`,
                }).promise();
            }

            const originalName = path.parse(req.files['explanation_image'][0].originalname).name;
            const extension = path.extname(req.files['explanation_image'][0].originalname);
            const truncatedName = originalName.length > 20 ? originalName.substring(0, 20) : originalName;
            const shortUuid = uuidv4().split('-')[0]; // Shorter UUID
            const fileName = `${truncatedName}-${shortUuid}${extension}`;

            const params = {
                Bucket: awsBucketName,
                Key: `questions/${fileName}`,
                Body: req.files['explanation_image'][0].buffer,
                ContentType: req.files['explanation_image'][0].mimetype,
            };

            const data = await s3.upload(params).promise();
            explanationImagePath = data.Location;
        }

        const [num] = await SatQuestion.update(
            {
                test_id: req.body.test_id,
                question_text: req.body.question_text,
                hint: req.body.hint,
                image: imagePath,
                explanation_image: explanationImagePath,
                explanation: req.body.explanation,
                section: req.body.section,
                question_type: req.body.question_type
            },
            {
                where: {sat_question_id: id},
            }
        );

        if (num == 1) {
            res.send({message: 'Question was updated successfully.'});
        } else {
            res.send({message: `Cannot update Question with id=${id}. Maybe Question was not found or req.body is empty!`});
        }
    } catch (err) {
        res.status(500).send({message: err.message});
    }
};

// Partial update a question by ID (PATCH)
exports.patchQuestion = async (req, res) => {
    const id = req.params.id;

    try {
        const question = await SatQuestion.findByPk(id);

        if (!question) {
            return res.status(404).send({message: `Cannot update Question with id=${id}. Maybe Question was not found!`});
        }

        let updateData = {...req.body};

        if (req.files && req.files['image']) {
            if (question.image) {
                const oldImageKey = question.image.split('/').pop();
                await s3.deleteObject({
                    Bucket: awsBucketName,
                    Key: `questions/${oldImageKey}`,
                }).promise();
            }

            const originalName = path.parse(req.files['image'][0].originalname).name;
            const extension = path.extname(req.files['image'][0].originalname);
            const truncatedName = originalName.length > 20 ? originalName.substring(0, 20) : originalName;
            const shortUuid = uuidv4().split('-')[0]; // Shorter UUID
            const fileName = `${truncatedName}-${shortUuid}${extension}`;

            const params = {
                Bucket: awsBucketName,
                Key: `questions/${fileName}`,
                Body: req.files['image'][0].buffer,
                ContentType: req.files['image'][0].mimetype,
            };

            const data = await s3.upload(params).promise();
            updateData.image = data.Location;
        }

        if (req.files && req.files['explanation_image']) {
            if (question.explanation_image) {
                const oldExplanationImageKey = question.explanation_image.split('/').pop();
                await s3.deleteObject({
                    Bucket: awsBucketName,
                    Key: `questions/${oldExplanationImageKey}`,
                }).promise();
            }

            const originalName = path.parse(req.files['explanation_image'][0].originalname).name;
            const extension = path.extname(req.files['explanation_image'][0].originalname);
            const truncatedName = originalName.length > 20 ? originalName.substring(0, 20) : originalName;
            const shortUuid = uuidv4().split('-')[0]; // Shorter UUID
            const fileName = `${truncatedName}-${shortUuid}${extension}`;

            const params = {
                Bucket: awsBucketName,
                Key: `questions/${fileName}`,
                Body: req.files['explanation_image'][0].buffer,
                ContentType: req.files['explanation_image'][0].mimetype,
            };

            const data = await s3.upload(params).promise();
            updateData.explanation_image = data.Location;
        }

        const [num] = await SatQuestion.update(updateData, {
            where: {sat_question_id: id},
        });

        if (num == 1) {
            res.send({message: 'Question was updated successfully.'});
        } else {
            res.send({message: `Cannot update Question with id=${id}. Maybe Question was not found or req.body is empty!`});
        }
    } catch (err) {
        res.status(500).send({message: err.message});
    }
};

// Delete a question by ID
exports.deleteQuestion = async (req, res) => {
    try {
        const question = await SatQuestion.findOne({
            where: {sat_question_id: req.params.id},
        });

        if (!question) {
            return res.status(404).send({message: `Cannot delete Question with id=${req.params.id}. Maybe Question was not found!`});
        }

        if (question.image) {
            const oldImageKey = question.image.split('/').pop();
            await s3.deleteObject({
                Bucket: awsBucketName,
                Key: `questions/${oldImageKey}`,
            }).promise();
        }

        const num = await SatQuestion.destroy({
            where: {sat_question_id: req.params.id},
        });

        if (num == 1) {
            res.send({message: 'Question was deleted successfully!'});
        } else {
            res.send({message: `Cannot delete Question with id=${req.params.id}. Maybe Question was not found!`});
        }
    } catch (err) {
        res.status(500).send({message: err.message});
    }
};
