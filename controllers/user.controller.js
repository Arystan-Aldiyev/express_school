const db = require("../models");
const User = db.user;
const bcrypt = require("bcryptjs");

// Create a new user
exports.createUser = (req, res) => {
    User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
        phone_number: req.body.phone_number
    }).then(user => {
        res.status(201).send(user);
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
};

// Retrieve all users
exports.getAllUsers = (req, res) => {
    User.findAll().then(users => {
        res.status(200).send(users);
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
};

// Retrieve a single user by ID
exports.getUserById = (req, res) => {
    User.findByPk(req.params.id).then(user => {
        if (user) {
            res.status(200).send(user);
        } else {
            res.status(404).send({ message: `User with id=${req.params.id} not found.` });
        }
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
};

exports.updateUser = (req, res) => {
    const updateUserDetails = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        phone_number: req.body.phone_number
    };

    if (req.body.password) {
        updateUserDetails.password = bcrypt.hashSync(req.body.password, 8);
    }

    User.update(updateUserDetails, {
        where: { user_id: req.params.id }
    }).then(num => {
        if (num == 1) {
            res.status(200).send({ message: "User was updated successfully." });
        } else {
            res.status(404).send({ message: `Cannot update User with id=${req.params.id}. Maybe User was not found or req.body is empty!` });
        }
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
};

// Delete a user by ID
exports.deleteUser = (req, res) => {
    User.destroy({
        where: { user_id: req.params.id }
    }).then(num => {
        if (num == 1) {
            res.status(200).send({ message: "User was deleted successfully!" });
        } else {
            res.status(404).send({ message: `Cannot delete User with id=${req.params.id}. Maybe User was not found!` });
        }
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
};
