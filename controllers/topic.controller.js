const db = require("../models");
const Topic = db.topic;
const Lesson = db.lesson;

exports.createTopic = async (req, res) => {
    try {
        const {lesson_id, title} = req.body;
        const existingLesson = await Lesson.findByPk(lesson_id);
        if (!existingLesson) {
            return res.status(404).json({message: "Lesson not found"});
        }
        const newTopic = await Topic.create({lesson_id, title});
        res.status(201).json(newTopic);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.getTopics = async (req, res) => {
    try {
        const topics = await Topic.findAll();
        res.status(200).json(topics);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.getTopicById = async (req, res) => {
    try {
        const {topic_id} = req.params;
        const topic = await Topic.findByPk(topic_id);
        if (topic) {
            res.status(200).json(topic);
        } else {
            res.status(404).json({message: 'Topic not found'});
        }
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.getTopicsByLessonId = async (req, res) => {
    try {
        const {lesson_id} = req.params;
        const existingLesson = await Lesson.findByPk(lesson_id);
        if (!existingLesson) {
            return res.status(404).json({message: "Lesson not found"});
        }
        const topics = await Topic.findAll({where: {lesson_id}});
        if (topics.length > 0) {
            res.status(200).json(topics);
        } else {
            res.status(404).json({message: 'No topics found for this lesson'});
        }
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.updateTopic = async (req, res) => {
    try {
        const {topic_id} = req.params;
        const {lesson_id, title} = req.body;
        const topic = await Topic.findByPk(topic_id);
        if (topic) {
            if (lesson_id !== undefined) {
                const existingLesson = await Lesson.findByPk(lesson_id);
                if (!existingLesson) {
                    return res.status(404).json({message: "Lesson not found"});
                }
                topic.lesson_id = lesson_id;
            }
            if (title !== undefined) {
                topic.title = title;
            }
            await topic.save();
            res.status(200).json(topic);
        } else {
            res.status(404).json({message: 'Topic not found'});
        }
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.deleteTopic = async (req, res) => {
    try {
        const {topic_id} = req.params;
        const topic = await Topic.findByPk(topic_id);
        if (topic) {
            await topic.destroy();
            res.status(204).json({message: 'Topic deleted'});
        } else {
            res.status(404).json({message: 'Topic not found'});
        }
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};