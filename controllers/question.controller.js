const fs = require('fs');
const path = require('path');
const db = require("../models");
const Question = db.question;

const questionUploadsDir = path.join('/var/data', 'uploads', 'questions');

exports.createQuestion = (req, res) => {
    let imagePath = null;
    if (req.file) {
        const filename = `${Date.now()}-${req.file.originalname}`;
        const filepath = path.join(questionUploadsDir, filename);
        fs.writeFileSync(filepath, req.file.buffer);
        imagePath = `/uploads/questions/${filename}`;
    }

    Question.create({
        test_id: req.body.test_id,
        question_text: req.body.question_text,
        hint: req.body.hint,
        image: imagePath // Store the file path as URL
    }).then(question => {
        res.status(201).send(question);
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
};

// Get all questions
exports.findAllQuestions = async (req, res) => {
    try {
        const questions = await Question.findAll();
        res.status(200).send(questions);
    } catch (err) {
        res.status(500).send({ message: err.message });
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

// Update a question by ID
exports.updateQuestion = (req, res) => {
    const id = req.params.id;

    Question.findByPk(id)
        .then(question => {
            if (!question) {
                return res.status(404).send({
                    message: `Cannot update Question with id=${id}. Maybe Question was not found!`
                });
            }

            let imagePath = question.image;
            if (req.file) {
                const filename = `${Date.now()}-${req.file.originalname}`;
                const filepath = path.join(questionUploadsDir, filename);
                fs.writeFileSync(filepath, req.file.buffer);
                imagePath = `/uploads/questions/${filename}`;
            }

            return Question.update({
                test_id: req.body.test_id,
                question_text: req.body.question_text,
                hint: req.body.hint,
                image: imagePath
            }, {
                where: { question_id: id }
            });
        })
        .then(num => {
            if (num == 1) {
                res.send({ message: "Question was updated successfully." });
            } else {
                res.send({ message: `Cannot update Question with id=${id}. Maybe Question was not found or req.body is empty!` });
            }
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};

// Delete a question by ID
exports.deleteQuestion = (req, res) => {
    Question.findOne({
        where: { question_id: req.params.id }
    }).then(question => {
        if (question) {
            if (question.image) {
                fs.unlinkSync(path.join(questionUploadsDir, path.basename(question.image))); // Remove the file from the file system
            }
            return Question.destroy({
                where: { question_id: req.params.id }
            });
        } else {
            throw new Error(`Question with id=${req.params.id} not found!`);
        }
    }).then(num => {
        if (num == 1) {
            res.send({ message: "Question was deleted successfully!" });
        } else {
            res.send({ message: `Cannot delete Question with id=${req.params.id}. Maybe Question was not found!` });
        }
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
};
