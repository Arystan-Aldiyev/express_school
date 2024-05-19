const db = require("../models");
const DashboardAnnouncement = db.dashboardAnnouncement;

// Create a new announcement
exports.createAnnouncement = (req, res) => {
    let base64Image = req.file ? req.file.buffer.toString('base64') : null;

    DashboardAnnouncement.create({
        author_id: req.userId,
        title: req.body.title,
        content: req.body.content,
        image: base64Image, // Store the base64 string
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

// Update an announcement
exports.updateAnnouncement = (req, res) => {
    let base64Image = req.file ? req.file.buffer.toString('base64') : null;

    DashboardAnnouncement.update({
        title: req.body.title,
        content: req.body.content,
        image: base64Image, // Store the base64 string
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

// Get all announcements
exports.getAnnouncements = async (req, res) => {
    try {
        const announcements = await DashboardAnnouncement.findAll();
        res.status(200).send(announcements);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
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
