const db = require("../models");
const DashboardAnnouncement = db.dashboardAnnouncement;
const DashboardCountdown = db.dashboardCountdown;

exports.createAnnouncement = (req, res) => {
    let image = null;
    if (req.file) {
        image = req.file.buffer; // Convert file to buffer for storage
    }
    DashboardAnnouncement.create({
        author_id: req.userId,
        title: req.body.title,
        content: req.body.content,
        image: image, // Store the image buffer
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
        const announcementsWithBase64Images = announcements.map(announcement => {
            let base64Image = null;
            if (announcement.image) {
                base64Image = Buffer.from(announcement.image).toString('base64');
            }
            return {
                ...announcement.toJSON(),
                image: base64Image ? `data:image/png;base64,${base64Image}` : null
            };
        });
        res.status(200).send(announcementsWithBase64Images);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};


// Update an announcement
exports.updateAnnouncement = (req, res) => {

    let image = null;
    if (req.file) {
        image = req.file.buffer; // Convert file to buffer for storage
    }

    DashboardAnnouncement.update({
        title: req.body.title,
        content: req.body.content,
        image: image,
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
    DashboardAnnouncement.destroy({
        where: { announcement_id: req.params.id }
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
