const fs = require('fs');
const path = require('path');
const db = require("../models");
const DashboardAnnouncement = db.dashboardAnnouncement;
const DashboardCountdown = db.dashboardCountdown;

const uploadsDir = path.join('/var/data', 'uploads');

exports.createAnnouncement = (req, res) => {
    let imagePath = null;
    if (req.file) {
        const filename = `${Date.now()}-${req.file.originalname}`;
        const filepath = path.join(uploadsDir, filename);
        fs.writeFileSync(filepath, req.file.buffer);
        imagePath = `/uploads/${filename}`;
    }

    DashboardAnnouncement.create({
        author_id: req.userId,
        title: req.body.title,
        content: req.body.content,
        image: imagePath, // Store the file path as URL
        link: req.body.link,
        link_description: req.body.link_description,
        start_time: req.body.start_time,
        end_time: req.body.end_time,
        event_date: req.body.event_date
    }).then(announcement => {
        res.status(201).send(announcement);
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
};

// Get all announcements
exports.getAnnouncements = async (req, res) => {
    try {
        const announcements = await DashboardAnnouncement.findAll();
        res.status(200).send(announcements);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

// Update an announcement
exports.updateAnnouncement = (req, res) => {
    let imagePath = null;
    if (req.file) {
        const filename = `${Date.now()}-${req.file.originalname}`;
        const filepath = path.join(uploadsDir, filename);
        fs.writeFileSync(filepath, req.file.buffer);
        imagePath = `/uploads/${filename}`;
    }

    DashboardAnnouncement.update({
        title: req.body.title,
        content: req.body.content,
        image: imagePath,
        link: req.body.link,
        link_description: req.body.link_description,
        start_time: req.body.start_time,
        end_time: req.body.end_time,
        event_date: req.body.event_date
    }, {
        where: { announcement_id: req.params.id }
    }).then(num => {
        if (num == 1) {
            res.status(200).send({ message: "Announcement was updated successfully." });
        } else {
            res.status(404).send({ message: `Cannot update Announcement with id=${req.params.id}. Maybe Announcement was not found or req.body is empty!` });
        }
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
};

// Delete an announcement
exports.deleteAnnouncement = (req, res) => {
    DashboardAnnouncement.findOne({
        where: { announcement_id: req.params.id }
    }).then(announcement => {
        if (announcement) {
            if (announcement.image) {
                fs.unlinkSync(path.join(uploadsDir, path.basename(announcement.image))); // Remove the file from the file system
            }
            return DashboardAnnouncement.destroy({
                where: { announcement_id: req.params.id }
            });
        } else {
            throw new Error(`Announcement with id=${req.params.id} not found!`);
        }
    }).then(num => {
        if (num == 1) {
            res.status(200).send({ message: "Announcement was deleted successfully!" });
        } else {
            res.status(404).send({ message: `Cannot delete Announcement with id=${req.params.id}. Maybe Announcement was not found!` });
        }
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
};

// Create a new countdown
exports.createCountdown = (req, res) => {
    DashboardCountdown.create({
        title: req.body.title,
        target_date: req.body.target_date
    }).then(countdown => {
        res.status(201).send(countdown);
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
};

// Get all countdowns
exports.getCountdowns = (req, res) => {
    DashboardCountdown.findAll().then(countdowns => {
        res.status(200).send(countdowns);
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
};

// Update a countdown
exports.updateCountdown = (req, res) => {
    DashboardCountdown.update({
        title: req.body.title,
        target_date: req.body.target_date
    }, {
        where: { countdown_id: req.params.id }
    }).then(num => {
        if (num == 1) {
            res.status(200).send({ message: "Countdown was updated successfully." });
        } else {
            res.status(404).send({ message: `Cannot update Countdown with id=${req.params.id}. Maybe Countdown was not found or req.body is empty!` });
        }
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
};

// Delete a countdown
exports.deleteCountdown = (req, res) => {
    DashboardCountdown.destroy({
        where: { countdown_id: req.params.id }
    }).then(num => {
        if (num == 1) {
            res.status(200).send({ message: "Countdown was deleted successfully!" });
        } else {
            res.status(404).send({ message: `Cannot delete Countdown with id=${req.params.id}. Maybe Countdown was not found!` });
        }
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
};
