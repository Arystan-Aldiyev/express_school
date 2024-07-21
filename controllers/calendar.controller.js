const db = require("../models");
const Calendar = db.calendar;
const GroupMembership = db.groupMembership;
const Group = db.group;

exports.createCalendar = async (req, res) => {
    const {title, description, group_id, startTime, endTime} = req.body;

    try {
        const existingGroup = await Group.findByPk(group_id);
        if (!existingGroup) {
            return res.status(404).send({message: "Group not found."});
        }

        const newCalendar = await Calendar.create({
            title,
            description,
            group_id,
            startTime,
            endTime
        });
        res.status(201).json(newCalendar);
    } catch (error) {
        console.error(error);
        res.status(500).send({message: "Internal Server Error"});
    }
};

exports.getCalendars = async (req, res) => {
    const {group_id} = req.params;
    try {
        const calendars = await Calendar.findAll({where: {group_id}});
        res.status(200).json(calendars);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.getCalendarById = async (req, res) => {
    const {calendar_id} = req.params;
    try {
        const calendar = await Calendar.findByPk(calendar_id);
        if (!calendar) {
            return res.status(404).json({error: 'Calendar not found'});
        }
        res.status(200).json(calendar);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.updateCalendar = async (req, res) => {
    const {calendar_id} = req.params;
    const {title, description, startTime, endTime} = req.body;

    try {
        const calendar = await Calendar.findByPk(calendar_id);
        if (!calendar) {
            return res.status(404).json({error: 'Calendar not found'});
        }

        calendar.title = title || calendar.title;
        calendar.description = description || calendar.description;
        calendar.startTime = startTime || calendar.startTime;
        calendar.endTime = endTime || calendar.endTime;

        await calendar.save();
        res.status(200).json(calendar);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.deleteCalendar = async (req, res) => {
    const {calendar_id} = req.params;

    try {
        const calendar = await Calendar.findByPk(calendar_id);
        if (!calendar) {
            return res.status(404).json({error: 'Calendar not found'});
        }

        await calendar.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.getMyCalendars = async (req, res) => {
    const userId = req.userId;

    try {
        const memberships = await GroupMembership.findAll({where: {user_id: userId}});
        const groupIds = memberships.map(membership => membership.group_id);

        const calendars = await Calendar.findAll({where: {group_id: groupIds}});

        res.status(200).json(calendars);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};
