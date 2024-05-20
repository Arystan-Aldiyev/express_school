const db = require("../models");
const Membership = db.groupMembership;
const Group = db.group;
const User = db.user;

// Retrieve memberships in a specific group
exports.getGroupMemberships = (req, res) => {
    Group.findByPk(req.params.id)
        .then(group => {
            if (!group) {
                return res.status(404).send({ message: "Group not found." });
            }

            Membership.findAll({ where: { group_id: req.params.id }, include: [User] })
                .then(memberships => {
                    res.status(200).send(memberships);
                })
                .catch(err => {
                    res.status(500).send({ message: err.message });
                });
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};

// Add a member to a group
exports.addGroupMember = (req, res) => {
    Group.findByPk(req.params.id)
        .then(group => {
            if (!group) {
                return res.status(404).send({ message: "Group not found." });
            }

            User.findByPk(req.body.user_id)
                .then(user => {
                    if (!user) {
                        return res.status(404).send({ message: "User not found." });
                    }

                    Membership.create({
                        group_id: req.params.id,
                        user_id: req.body.user_id
                    })
                        .then(membership => {
                            res.status(201).send(membership);
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

// Add a member to a group by invite code
exports.joinGroupByInviteCode = (req, res) => {
    Group.findOne({ where: { invite_code: req.body.invite_code } })
        .then(group => {
            if (!group) {
                return res.status(404).send({ message: "Invalid invite code." });
            }

            User.findByPk(req.body.user_id)
                .then(user => {
                    if (!user) {
                        return res.status(404).send({ message: "User not found." });
                    }

                    Membership.findOne({ where: { group_id: group.group_id, user_id: req.body.user_id } })
                        .then(existingMembership => {
                            if (existingMembership) {
                                return res.status(400).send({ message: "User already a member of the group." });
                            }

                            Membership.create({
                                group_id: group.group_id,
                                user_id: req.body.user_id
                            })
                                .then(membership => {
                                    res.status(201).send(membership);
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
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};

// Remove a member from a group
exports.removeGroupMember = (req, res) => {
    Group.findByPk(req.params.id)
        .then(group => {
            if (!group) {
                return res.status(404).send({ message: "Group not found." });
            }

            Membership.findByPk(req.params.membership_id)
                .then(membership => {
                    if (!membership) {
                        return res.status(404).send({ message: "Membership not found." });
                    }

                    Membership.destroy({
                        where: {
                            group_id: req.params.id,
                            membership_id: req.params.membership_id
                        }
                    })
                        .then(num => {
                            if (num == 1) {
                                res.status(200).send({ message: "Membership was deleted successfully!" });
                            } else {
                                res.status(404).send({ message: `Cannot delete Membership with id=${req.params.membership_id}. Maybe Membership was not found!` });
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
