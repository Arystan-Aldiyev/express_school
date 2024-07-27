const db = require("../models");
const Lesson = db.lesson;
const Group = db.group;

// Create a new Lesson
exports.createLesson = async (req, res) => {
    try {
        const {group_id, subject, section_title} = req.body;
        const existingGroup = await Group.findByPk(group_id);
        if (!existingGroup) {
            return res.status(404).json({message: "Group not found"});
        }
        const existingLesson = await Lesson.findOne({where: {subject}});
        if (existingLesson) {
            return res.status(409).json({message: 'Subject with that name already exists'});
        }
        const newLesson = await Lesson.create({group_id, subject, section_title});
        res.status(201).json(newLesson);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

// Get all Lessons
exports.getLessons = async (req, res) => {
    try {
        const lessons = await Lesson.findAll();
        res.status(200).json(lessons);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

// Get a single Lesson by ID
exports.getLessonById = async (req, res) => {
    try {
        const {lesson_id} = req.params;
        const existingLesson = await Lesson.findByPk(lesson_id);
        if (existingLesson) {
            res.status(200).json(existingLesson);
        } else {
            res.status(404).json({message: 'Lesson not found'});
        }
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

// Get Lessons by Group ID
exports.getLessonsByGroupId = async (req, res) => {
    try {
        const {group_id} = req.params;
        const existingGroup = await Group.findByPk(group_id);
        if (!existingGroup) {
            return res.status(404).json({message: "Group not found"});
        }
        const lessons = await Lesson.findAll({where: {group_id}});
        if (lessons.length > 0) {
            res.status(200).json(lessons);
        } else {
            res.status(404).json({message: 'No lessons found for this group'});
        }
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

// Partial update a Lesson
exports.updateLesson = async (req, res) => {
    try {
        const {lesson_id} = req.params;
        const {group_id, subject, section_title} = req.body;
        const existingLesson = await Lesson.findByPk(lesson_id);
        if (existingLesson) {
            if (group_id !== undefined) {
                const existingGroup = await Group.findByPk(group_id);
                if (!existingGroup) {
                    return res.status(404).json({message: "Group not found"});
                }
                existingLesson.group_id = group_id;
            }
            if (subject !== undefined) {
                const existingSubject = await Lesson.findOne({where: {subject}});
                if (existingSubject && existingSubject.lesson_id !== lesson_id) {
                    return res.status(409).json({message: 'Subject with that name already exists'});
                }
                existingLesson.subject = subject;
            }
            if (section_title !== undefined) {
                existingLesson.section_title = section_title;
            }
            await existingLesson.save();
            res.status(200).json(existingLesson);
        } else {
            res.status(404).json({message: 'Lesson not found'});
        }
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

// Delete a Lesson
exports.deleteLesson = async (req, res) => {
    try {
        const {lesson_id} = req.params;
        const existingLesson = await Lesson.findByPk(lesson_id);
        if (existingLesson) {
            await existingLesson.destroy();
            res.status(204).json({message: 'Lesson deleted'});
        } else {
            res.status(404).json({message: 'Lesson not found'});
        }
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.getLessonBySubject = async (req, res) => {
    try {
        const {subject} = req.params;
        const lesson = await Lesson.findOne({where: {subject}});
        if (lesson) {
            res.status(200).json(lesson);
        } else {
            res.status(404).json({message: 'Lesson not found'});
        }
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};