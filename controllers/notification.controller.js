const db = require('../models');
const Notification = db.notification;

exports.createNotification = async (req, res) => {
    const {userId, message} = req.body;
    try {
        const notification = await Notification.create({
            user_id: userId,
            message: message
        });
        res.status(201).json(notification);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Failed to create notification'});
    }
};

exports.getNotifications = async (req, res) => {
    const userId = req.userId;
    try {
        const notifications = await Notification.findAll({
            where: {user_id: userId},
            order: [['created_at', 'DESC']]
        });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({error: 'Failed to retrieve notifications'});
    }
};

exports.getNotificationById = async (req, res) => {
    const {id} = req.params;
    try {
        const notification = await Notification.findOne({
            where: {notification_id: id}
        });
        if (notification) {
            res.status(200).json(notification);
        } else {
            res.status(404).json({error: 'Notification not found'});
        }
    } catch (error) {
        console.error('Error retrieving notification:', error);
        res.status(500).json({error: 'Failed to retrieve notification'});
    }
};

exports.deleteNotification = async (req, res) => {
    const {id} = req.params;
    const userId = req.userId;
    try {
        const deleted = await Notification.destroy({
            where: {notification_id: id, user_id: userId}
        });
        if (deleted) {
            res.status(200).json({message: 'Notification deleted'});
        } else {
            res.status(404).json({error: 'Notification not found'});
        }
    } catch (error) {
        res.status(500).json({error: 'Failed to delete notification'});
    }
};

exports.clearAllNotifications = async (req, res) => {
    const userId = req.userId;
    try {
        await Notification.destroy({
            where: {user_id: userId}
        });
        res.status(200).json({message: 'All notifications cleared'});
    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'Failed to clear notifications'});
    }
};