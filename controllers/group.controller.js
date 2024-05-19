const db = require("../models");
const Group = db.group;
const User = db.user;
const { v4: uuidv4 } = require('uuid');  // Use UUID library to generate unique invite codes

// Function to generate a unique invite code
async function generateUniqueInviteCode() {
    let inviteCode;
    let isUnique = false;

    while (!isUnique) {
        inviteCode = uuidv4();
        const existingGroup = await Group.findOne({ where: { invite_code: inviteCode } });
        if (!existingGroup) {
            isUnique = true;
        }
    }

    return inviteCode;
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
    User.findByPk(req.body.teacher_id)
        .then(async (user) => {
            if (!user || user.role !== 'teacher') {
                return res.status(400).send({ message: "Invalid teacher ID." });
            }

            const inviteCode = await generateUniqueInviteCode();

            Group.create({
                name: req.body.name,
                teacher_id: req.body.teacher_id,
                invite_code: inviteCode
            })
                .then(group => {
                    res.status(201).send(group);
                })
                .catch(err => {
                    res.status(500).send({ message: err.message });
                });
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};

exports.updateGroup = (req, res) => {
    Group.findByPk(req.params.id)
        .then(group => {
            if (!group) {
                return res.status(404).send({ message: "Group not found." });
            }

            User.findByPk(req.body.teacher_id)
                .then(user => {
                    if (!user || user.role !== 'teacher') {
                        return res.status(400).send({ message: "Invalid teacher ID." });
                    }

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
                                res.status(400).send({ message: "Error updating group. Please try again." });
                            }
                        })
                        .catch(err => {
                            res.status(500).send({ message: err.message });
                        });
                })
                .catch(err => {
                    res.status(500).send({ message: err.message });
                });
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};

exports.deleteGroup = (req, res) => {
    Group.findByPk(req.params.id)
        .then(group => {
            if (!group) {
                return res.status(404).send({ message: "Group not found." });
            }

            Group.destroy({
                where: { group_id: req.params.id }
            })
                .then(num => {
                    if (num == 1) {
                        res.status(200).send({ message: "Group was deleted successfully!" });
                    } else {
                        res.status(400).send({ message: "Error deleting group. Please try again." });
                    }
                })
                .catch(err => {
                    res.status(500).send({ message: err.message });
                });
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};
