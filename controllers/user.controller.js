const db = require('../models');
const User = db.user;
const GroupMembership = db.groupMembership;
const bcrypt = require('bcryptjs');

exports.createUser = (req, res) => {
    User.create({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        role: req.body.role,
        phone_number: req.body.phone_number
    })
        .then(user => {
            res.status(201).send(user);
        })
        .catch(err => {
            res.status(500).send({message: err.message});
        });
};

exports.getAllUsers = (req, res) => {
    User.findAll()
        .then(users => {
            res.status(200).send(users);
        })
        .catch(err => {
            res.status(500).send({message: err.message});
        });
};

exports.getUserById = async (req, res) => {
    try {
        const membership = await GroupMembership.findOne({where: {user_id: req.params.id}});
        const groupId = membership ? membership.group_id : null;

        const user = await User.findByPk(req.params.id);
        if (user) {
            user.dataValues.group_id = groupId;
            res.status(200).send(user);
        } else {
            res.status(404).send({message: 'User not found'});
        }
    } catch (err) {
        res.status(500).send({message: err.message});
    }
};

exports.updateUser = (req, res) => {
    User.update({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        role: req.body.role,
        phone_number: req.body.phone_number
    }, {
        where: {user_id: req.params.id}
    })
        .then(num => {
            if (num == 1) {
                res.status(200).send({message: 'User was updated successfully.'});
            } else {
                res.status(404).send({message: `Cannot update User with id=${req.params.id}. Maybe User was not found or req.body is empty!`});
            }
        })
        .catch(err => {
            res.status(500).send({message: err.message});
        });
};

exports.deleteUser = (req, res) => {
    User.destroy({
        where: {user_id: req.params.id}
    })
        .then(num => {
            if (num == 1) {
                res.status(200).send({message: 'User was deleted successfully!'});
            } else {
                res.status(404).send({message: `Cannot delete User with id=${req.params.id}. Maybe User was not found!`});
            }
        })
        .catch(err => {
            res.status(500).send({message: err.message});
        });
};
