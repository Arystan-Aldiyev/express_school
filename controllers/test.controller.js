const db = require("../models");
const Group = db.group;
const Test = db.test;
const Question = db.question;
const AnswerOption = db.answerOption;




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
exports.findOneTest = (req, res) => {
    const id = req.params.id;

    Test.findByPk(id)
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
            res.status(500).send({
                message: "Error retrieving Test with id=" + id
            });
        });
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
            res.status(500).send({
                message: "Error retrieving Test with id=" + id
            });
        });
};


// Update a Test by the id in the request
exports.updateTest = (req, res) => {
    const id = req.params.id;

    Test.update(req.body, {
        where: { test_id: id }
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
        where: { test_id: id }
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
