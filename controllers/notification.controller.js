const db = require('../models');
const Notification = db.notification;
const User = db.user;
const GroupMembership = db.groupMembership;

exports.createNotification = async (req, res) => {
    const userId = req.userId
    const {message, group_id} = req.body;
    try {
        const notification = await Notification.create({
            sender_id: userId,
            message: message,
            group_id: group_id
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
        const getUserGroup = await GroupMembership.findOne({
            where: {user_id: userId}
        });
        if (!getUserGroup) {
            return res.status(404).json({error: 'User group not found'});
        }
        const notifications = await Notification.findAll({
            where: {group_id: getUserGroup.group_id},
            order: [['created_at', 'DESC']],
            include: {
                model: User,
                as: 'sender',
                attributes: ['user_id', 'name', 'email']
            }
        });
        res.status(200).json(notifications);
    } catch (error) {
        console.log(error);
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
        const notification = await Notification.findOne({
            where: {notification_id: id}
        });
        if (notification && notification.sender_id === userId) {
            await Notification.destroy({
                where: {notification_id: id}
            });
            res.status(200).json({message: 'Notification deleted'});
        } else {
            res.status(404).json({error: 'Notification not found or not authorized'});
        }
    } catch (error) {
        res.status(500).json({error: 'Failed to delete notification'});
    }
};

exports.clearAllNotifications = async (req, res) => {
    const userId = req.userId;
    try {
        const getUserGroup = await GroupMembership.findOne({
            where: {user_id: userId}
        });
        if (!getUserGroup) {
            return res.status(404).json({error: 'User group not found'});
        }
        await Notification.destroy({
            where: {group_id: getUserGroup.group_id}
        });
        res.status(200).json({message: 'All notifications cleared'});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Failed to clear notifications'});
    }
};