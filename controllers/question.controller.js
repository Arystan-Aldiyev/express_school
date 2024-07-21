const path = require('path');
const db = require("../models");
const {v4: uuidv4} = require("uuid");
const {awsBucketName} = require("../config/aws.config");
const {s3} = require("../services/amazon.s3.service");
const Question = db.question;


exports.createQuestion = async (req, res) => {
    let imagePath = null;

    if (req.file) {
        const originalName = path.parse(req.file.originalname).name;
        const extension = path.extname(req.file.originalname);
        const truncatedName = originalName.length > 20 ? originalName.substring(0, 20) : originalName;
        const shortUuid = uuidv4().split('-')[0]; // Shorter UUID
        const fileName = `${truncatedName}-${shortUuid}${extension}`;

        const params = {
            Bucket: awsBucketName,
            Key: `questions/${fileName}`,
            Body: req.file.buffer,
            ContentType: req.file.mimetype
        };

        const data = await s3.upload(params).promise();
        imagePath = data.Location;
    }

    Question.create({
        test_id: req.body.test_id,
        question_text: req.body.question_text,
        hint: req.body.hint,
        image: imagePath // Store the file path as URL
    }).then(question => {
        res.status(201).send(question);
    }).catch(err => {
        res.status(500).send({message: err.message});
    });
};

// Get all questions
exports.findAllQuestions = async (req, res) => {
    try {
        const questions = await Question.findAll();
        res.status(200).send(questions);
    } catch (err) {
        res.status(500).send({message: err.message});
    }
};

// Find a single question by ID
exports.findOneQuestion = (req, res) => {
    const id = req.params.id;

    Question.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Question with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Question with id=" + id
            });
        });
};

// Full update a question by ID (PUT)
exports.updateQuestion = async (req, res) => {
    const id = req.params.id;

    try {
        const question = await Question.findByPk(id);

        if (!question) {
            return res.status(404).send({
                message: `Cannot update Question with id=${id}. Maybe Question was not found!`
            });
        }

        let imagePath = null;
        if (req.file) {
            if (question.image) {
                const oldImageKey = question.image.split('/').pop();
                await s3.deleteObject({
                    Bucket: awsBucketName,
                    Key: `questions/${oldImageKey}`
                }).promise();
            }

            const originalName = path.parse(req.file.originalname).name;
            const extension = path.extname(req.file.originalname);
            const truncatedName = originalName.length > 20 ? originalName.substring(0, 20) : originalName;
            const shortUuid = uuidv4().split('-')[0]; // Shorter UUID
            const fileName = `${truncatedName}-${shortUuid}${extension}`;

            const params = {
                Bucket: awsBucketName,
                Key: `questions/${fileName}`,
                Body: req.file.buffer,
                ContentType: req.file.mimetype
            };

            const data = await s3.upload(params).promise();
            imagePath = data.Location;
        }

        const [num] = await Question.update({
            test_id: req.body.test_id,
            question_text: req.body.question_text,
            hint: req.body.hint,
            image: imagePath
        }, {
            where: {question_id: id}
        });

        if (num == 1) {
            res.send({message: "Question was updated successfully."});
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
        const question = await Question.findByPk(id);

        if (!question) {
            return res.status(404).send({
                message: `Cannot update Question with id=${id}. Maybe Question was not found!`
            });
        }

        let updateData = req.body;

        if (req.file) {
            if (question.image) {
                const oldImageKey = question.image.split('/').pop();
                await s3.deleteObject({
                    Bucket: awsBucketName,
                    Key: `questions/${oldImageKey}`
                }).promise();
            }

            const originalName = path.parse(req.file.originalname).name;
            const extension = path.extname(req.file.originalname);
            const truncatedName = originalName.length > 20 ? originalName.substring(0, 20) : originalName;
            const shortUuid = uuidv4().split('-')[0];
            const fileName = `${truncatedName}-${shortUuid}${extension}`;

            const params = {
                Bucket: awsBucketName,
                Key: `questions/${fileName}`,
                Body: req.file.buffer,
                ContentType: req.file.mimetype
            };

            const data = await s3.upload(params).promise();
            updateData.image = data.Location;
        }

        const [num] = await Question.update(updateData, {
            where: {question_id: id}
        });

        if (num == 1) {
            res.send({message: "Question was updated successfully."});
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
        const question = await Question.findOne({
            where: {question_id: req.params.id}
        });

        if (!question) {
            return res.status(404).send({
                message: `Cannot delete Question with id=${req.params.id}. Maybe Question was not found!`
            });
        }

        if (question.image) {
            const oldImageKey = question.image.split('/').pop();
            await s3.deleteObject({
                Bucket: awsBucketName,
                Key: `questions/${oldImageKey}`
            }).promise();
        }

        const num = await Question.destroy({
            where: {question_id: req.params.id}
        });

        if (num == 1) {
            res.send({message: "Question was deleted successfully!"});
        } else {
            res.send({message: `Cannot delete Question with id=${req.params.id}. Maybe Question was not found!`});
        }
    } catch (err) {
        res.status(500).send({message: err.message});
    }
};