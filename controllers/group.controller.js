// controllers/group.controller.js
const db = require("../models");
const Group = db.group;
const { v4: uuidv4 } = require('uuid');  // Use UUID library to generate unique invite codes

// Function to generate a unique invite code
function generateInviteCode() {
    return uuidv4();
}

exports.getAllGroups = (req, res) => {
    Group.findAll()
        .then(groups => {
            res.status(200).send(groups);
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};

exports.getGroupById = (req, res) => {
    Group.findByPk(req.params.id)
        .then(group => {
            if (!group) {
                return res.status(404).send({ message: "Group not found." });
            }
            res.status(200).send(group);
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};


exports.createGroup = (req, res) => {
    Group.create({
        name: req.body.name,
        teacher_id: req.body.teacher_id,
        invite_code: generateInviteCode()
    })
        .then(group => {
            res.status(201).send(group);
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};

exports.updateGroup = (req, res) => {
    Group.update({
        name: req.body.name,
        teacher_id: req.body.teacher_id
    }, {
        where: { group_id: req.params.id }
    })
        .then(num => {
            if (num == 1) {
                res.status(200).send({ message: "Group was updated successfully." });
            } else {
                res.status(404).send({ message: `Cannot update Group with id=${req.params.id}. Maybe Group was not found or req.body is empty!` });
            }
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};

exports.deleteGroup = (req, res) => {
    Group.destroy({
        where: { group_id: req.params.id }
    })
        .then(num => {
            if (num == 1) {
                res.status(200).send({ message: "Group was deleted successfully!" });
            } else {
                res.status(404).send({ message: `Cannot delete Group with id=${req.params.id}. Maybe Group was not found!` });
            }
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};
