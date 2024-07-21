const db = require("../models");
const Answer = db.answer;

// Retrieve all Answers for a specific Question
exports.findAllAnswersForQuestion = (req, res) => {
    const question_id = req.params.question_id;

    Answer.findAll({where: {question_id: question_id}})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving answers."
            });
        });
};
