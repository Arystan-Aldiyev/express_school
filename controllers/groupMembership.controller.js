// controllers/membership.controller.js
const db = require("../models");
const Membership = db.membership;
const Group = db.group;
const User = db.user;

// Retrieve memberships in a specific group
exports.getGroupMemberships = (req, res) => {
    Membership.findAll({ where: { group_id: req.params.id }, include: [User] })
        .then(memberships => {
            res.status(200).send(memberships);
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};

// Add a member to a group
exports.addGroupMember = (req, res) => {
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
};

// Remove a member from a group
exports.removeGroupMember = (req, res) => {
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
};
