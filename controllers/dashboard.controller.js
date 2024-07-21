const fs = require('fs');
const path = require('path');
const db = require("../models");
const {s3} = require("../services/amazon.s3.service");
const DashboardAnnouncement = db.dashboardAnnouncement;
const DashboardCountdown = db.dashboardCountdown;
const {v4: uuidv4} = require('uuid');
const {awsBucketName} = require("../config/aws.config"); // To generate unique file names


exports.createAnnouncement = async (req, res) => {
    let imagePath = null;

    if (req.file) {
        const originalName = path.parse(req.file.originalname).name;
        const extension = path.extname(req.file.originalname);
        const truncatedName = originalName.length > 20 ? originalName.substring(0, 20) : originalName;
        const shortUuid = uuidv4().split('-')[0]; // Shorter UUID
        const fileName = `${truncatedName}-${shortUuid}${extension}`;

        const params = {
            Bucket: awsBucketName,
            Key: `dashboards/${fileName}`,
            Body: req.file.buffer,
            ContentType: req.file.mimetype
        };

        const data = await s3.upload(params).promise();
        imagePath = data.Location;
    }
    DashboardAnnouncement.create({
        author_id: req.userId,
        title: req.body.title,
        content: req.body.content,
        image: imagePath,
        link: req.body.link,
        link_description: req.body.link_description,
        start_time: req.body.start_time,
        end_time: req.body.end_time,
        event_date: req.body.event_date
    }).then(announcement => {
        res.status(201).send(announcement);
    }).catch(err => {
        res.status(500).send({message: err.message});
    });

};

// Get all announcements
exports.getAnnouncements = async (req, res) => {
    try {
        const announcements = await DashboardAnnouncement.findAll();
        res.status(200).send(announcements);
    } catch (err) {
        res.status(500).send({message: err.message});
    }
};

// Update an announcement
exports.updateAnnouncement = async (req, res) => {
    try {
        let imagePath = null;
        const announcement = await DashboardAnnouncement.findByPk(req.params.id);

        if (!announcement) {
            return res.status(404).send({message: `Announcement with id=${req.params.id} not found.`});
        }

        if (req.file) {
            if (announcement.image) {
                const oldImageKey = announcement.image.split('/').pop();
                await s3.deleteObject({
                    Bucket: awsBucketName,
                    Key: `dashboards/${oldImageKey}`
                }).promise();
            }

            const originalName = path.parse(req.file.originalname).name;
            const extension = path.extname(req.file.originalname);
            const truncatedName = originalName.length > 20 ? originalName.substring(0, 20) : originalName;
            const shortUuid = uuidv4().split('-')[0]; // Shorter UUID
            const fileName = `${truncatedName}-${shortUuid}${extension}`;

            const params = {
                Bucket: awsBucketName,
                Key: `dashboards/${fileName}`,
                Body: req.file.buffer,
                ContentType: req.file.mimetype
            };

            const data = await s3.upload(params).promise();
            imagePath = data.Location;
        }

        await DashboardAnnouncement.update({
            title: req.body.title,
            content: req.body.content,
            image: imagePath || announcement.image,
            link: req.body.link,
            link_description: req.body.link_description,
            start_time: req.body.start_time,
            end_time: req.body.end_time,
            event_date: req.body.event_date
        }, {
            where: {announcement_id: req.params.id}
        });

        res.status(200).send({message: "Announcement was updated successfully."});
    } catch (err) {
        res.status(500).send({message: err.message});
    }
};


// Delete an announcement
exports.deleteAnnouncement = async (req, res) => {
    try {
        const announcement = await DashboardAnnouncement.findOne({
            where: {announcement_id: req.params.id}
        });

        if (!announcement) {
            return res.status(404).send({message: `Announcement with id=${req.params.id} not found!`});
        }

        if (announcement.image) {
            const params = {
                Bucket: awsBucketName,
                Key: path.basename(announcement.image)
            };

            await s3.deleteObject(params).promise();
        }

        const num = await DashboardAnnouncement.destroy({
            where: {announcement_id: req.params.id}
        });

        if (num == 1) {
            res.status(200).send({message: "Announcement was deleted successfully!"});
        } else {
            res.status(404).send({message: `Cannot delete Announcement with id=${req.params.id}. Maybe Announcement was not found!`});
        }
    } catch (err) {
        res.status(500).send({message: err.message});
    }
};

// Create a new countdown
exports.createCountdown = (req, res) => {
    DashboardCountdown.create({
        title: req.body.title,
        target_date: req.body.target_date
    }).then(countdown => {
        res.status(201).send(countdown);
    }).catch(err => {
        res.status(500).send({message: err.message});
    });
};

// Get all countdowns
exports.getCountdowns = (req, res) => {
    DashboardCountdown.findAll().then(countdowns => {
        res.status(200).send(countdowns);
    }).catch(err => {
        res.status(500).send({message: err.message});
    });
};

// Update a countdown
exports.updateCountdown = (req, res) => {
    DashboardCountdown.update({
        title: req.body.title,
        target_date: req.body.target_date
    }, {
        where: {countdown_id: req.params.id}
    }).then(num => {
        if (num == 1) {
            res.status(200).send({message: "Countdown was updated successfully."});
        } else {
            res.status(404).send({message: `Cannot update Countdown with id=${req.params.id}. Maybe Countdown was not found or req.body is empty!`});
        }
    }).catch(err => {
        res.status(500).send({message: err.message});
    });
};

// Delete a countdown
exports.deleteCountdown = (req, res) => {
    DashboardCountdown.destroy({
        where: {countdown_id: req.params.id}
    }).then(num => {
        if (num == 1) {
            res.status(200).send({message: "Countdown was deleted successfully!"});
        } else {
            res.status(404).send({message: `Cannot delete Countdown with id=${req.params.id}. Maybe Countdown was not found!`});
        }
    }).catch(err => {
        res.status(500).send({message: err.message});
    });
}
