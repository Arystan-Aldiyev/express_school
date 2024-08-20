const db = require("../models");
const Content = db.content;
const Topic = db.topic;
const StudentContent = db.studentContent;
const path = require('path');
const {v4: uuidv4} = require('uuid');
const {awsBucketName} = require("../config/aws.config");
const {s3} = require("../services/amazon.s3.service");

// Create Content with text mode
exports.createContentWithText = async (req, res) => {
    try {
        const {topic_id, title, resource} = req.body;
        const existingTopic = await Topic.findByPk(topic_id);
        if (!existingTopic) {
            return res.status(404).json({message: "Topic not found"});
        }
        const newContent = await Content.create({topic_id, title, mode: 'text', resource});
        res.status(201).json(newContent);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

// Create Content with file mode
exports.createContentWithFile = async (req, res) => {
    if (!req.file) {
        return res.status(400).send({message: "No file uploaded"});
    }

    const originalName = path.parse(req.file.originalname).name;
    const extension = path.extname(req.file.originalname);
    const truncatedName = originalName.length > 20 ? originalName.substring(0, 20) : originalName;
    const shortUuid = uuidv4().split('-')[0]; // Shorter UUID
    const fileName = `${truncatedName}-${shortUuid}${extension}`;

    const params = {
        Bucket: awsBucketName,
        Key: `contents/${fileName}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype
    };

    try {
        const data = await s3.upload(params).promise();
        const existingTopic = await Topic.findByPk(req.body.topic_id);
        if (!existingTopic) {
            return res.status(404).json({message: "Topic not found"});
        }
        const newContent = await Content.create({
            topic_id: req.body.topic_id,
            title: req.body.title,
            mode: 'file',
            resource: data.Location
        });
        res.status(201).json(newContent);
    } catch (err) {
        res.status(500).send({message: err.message});
    }
};

// Create Content with video mode
exports.createContentWithVideo = async (req, res) => {
    if (!req.file) {
        return res.status(400).send({message: "No video uploaded"});
    }

    const originalName = path.parse(req.file.originalname).name;
    const extension = path.extname(req.file.originalname);
    const truncatedName = originalName.length > 20 ? originalName.substring(0, 20) : originalName;
    const shortUuid = uuidv4().split('-')[0]; // Shorter UUID
    const fileName = `${truncatedName}-${shortUuid}${extension}`;

    const params = {
        Bucket: awsBucketName,
        Key: `contents/${fileName}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype
    };

    try {
        const data = await s3.upload(params).promise();
        const existingTopic = await Topic.findByPk(req.body.topic_id);
        if (!existingTopic) {
            return res.status(404).json({message: "Topic not found"});
        }
        const newContent = await Content.create({
            topic_id: req.body.topic_id,
            title: req.body.title,
            mode: 'video',
            resource: data.Location
        });
        res.status(201).json(newContent);
    } catch (err) {
        res.status(500).send({message: err.message});
    }
};

// Get all Contents
exports.getContents = async (req, res) => {
    try {
        const contents = await Content.findAll({order: [['content_id', 'ASC']]});
        res.status(200).json(contents);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

// Get a single Content by ID
exports.getContentById = async (req, res) => {
    try {
        const {content_id} = req.params;
        const userId = req.userId;
        const content = await Content.findByPk(content_id);

        if (content) {
            const studentContent = await StudentContent.findOne({
                where: {userId, contentId: content_id}
            });

            const contentWithStatus = {
                ...content.get(),
                isDone: studentContent ? studentContent.isDone : false
            };

            res.status(200).json(contentWithStatus);
        } else {
            res.status(404).json({message: 'Content not found'});
        }
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

// Get Contents by Topic ID
exports.getContentsByTopicId = async (req, res) => {
    try {
        const {topic_id} = req.params;
        const userId = req.userId;
        const existingTopic = await Topic.findByPk(topic_id);

        if (!existingTopic) {
            return res.status(404).json({message: "Topic not found"});
        }

        const contents = await Content.findAll({where: {topic_id}, order: [['content_id', 'ASC']]});

        if (contents.length > 0) {
            const contentsWithStatus = await Promise.all(contents.map(async content => {
                const studentContent = await StudentContent.findOne({
                    where: {userId, contentId: content.content_id}
                });

                return {
                    ...content.get(),
                    isDone: studentContent ? studentContent.isDone : false
                };
            }));

            res.status(200).json(contentsWithStatus);
        } else {
            res.status(404).json({message: 'No contents found for this topic'});
        }
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

// Update a Content with text mode
exports.updateContentWithText = async (req, res) => {
    try {
        const {content_id} = req.params;
        const {topic_id, title, resource} = req.body;
        const content = await Content.findByPk(content_id);
        if (content) {
            const existingTopic = await Topic.findByPk(topic_id);
            if (!existingTopic) {
                return res.status(404).json({message: "Topic not found"});
            }
            content.topic_id = topic_id;
            content.title = title;
            content.mode = 'text';
            content.resource = resource;
            await content.save();
            res.status(200).json(content);
        } else {
            res.status(404).json({message: 'Content not found'});
        }
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

// Update a Content with file mode
exports.updateContentWithFile = async (req, res) => {
    if (!req.file) {
        return res.status(400).send({message: "No file uploaded"});
    }

    const originalName = path.parse(req.file.originalname).name;
    const extension = path.extname(req.file.originalname);
    const truncatedName = originalName.length > 20 ? originalName.substring(0, 20) : originalName;
    const shortUuid = uuidv4().split('-')[0]; // Shorter UUID
    const fileName = `${truncatedName}-${shortUuid}${extension}`;

    const params = {
        Bucket: awsBucketName,
        Key: `contents/${fileName}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype
    };

    try {
        const data = await s3.upload(params).promise();
        const {content_id} = req.params;
        const content = await Content.findByPk(content_id);
        if (content) {
            const existingTopic = await Topic.findByPk(req.body.topic_id);
            if (!existingTopic) {
                return res.status(404).json({message: "Topic not found"});
            }
            content.topic_id = req.body.topic_id;
            content.title = req.body.title;
            content.mode = 'file';
            content.resource = data.Location;
            await content.save();
            res.status(200).json(content);
        } else {
            res.status(404).json({message: 'Content not found'});
        }
    } catch (err) {
        res.status(500).send({message: err.message});
    }
};

// Update a Content with video mode
exports.updateContentWithVideo = async (req, res) => {
    if (!req.file) {
        return res.status(400).send({message: "No video uploaded"});
    }

    const originalName = path.parse(req.file.originalname).name;
    const extension = path.extname(req.file.originalname);
    const truncatedName = originalName.length > 20 ? originalName.substring(0, 20) : originalName;
    const shortUuid = uuidv4().split('-')[0]; // Shorter UUID
    const fileName = `${truncatedName}-${shortUuid}${extension}`;

    const params = {
        Bucket: awsBucketName,
        Key: `contents/${fileName}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype
    };

    try {
        const data = await s3.upload(params).promise();
        const {content_id} = req.params;
        const content = await Content.findByPk(content_id);
        if (content) {
            const existingTopic = await Topic.findByPk(req.body.topic_id);
            if (!existingTopic) {
                return res.status(404).json({message: "Topic not found"});
            }
            content.topic_id = req.body.topic_id;
            content.title = req.body.title;
            content.mode = 'video';
            content.resource = data.Location;
            await content.save();
            res.status(200).json(content);
        } else {
            res.status(404).json({message: 'Content not found'});
        }
    } catch (err) {
        res.status(500).send({message: err.message});
    }
};

// Delete a Content
exports.deleteContent = async (req, res) => {
    try {
        const {content_id} = req.params;
        const content = await Content.findByPk(content_id);
        if (content) {
            await content.destroy();
            res.status(204).json({message: 'Content deleted'});
        } else {
            res.status(404).json({message: 'Content not found'});
        }
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};


exports.markContentAsDone = async (req, res) => {
    try {
        const {content_id} = req.params;
        const userId = req.userId;
        const content = await Content.findByPk(content_id);
        if (content) {
            let studentContent = await StudentContent.findOne({
                where: {userId, contentId: content_id}
            });
            if (!studentContent) {
                studentContent = await StudentContent.create({
                    userId,
                    contentId: content_id,
                    isDone: true
                });
            } else {
                studentContent.isDone = true;
                await studentContent.save();
            }
            res.status(200).json({message: 'Content marked as done', studentContent});
        } else {
            res.status(404).json({message: 'Content not found'});
        }
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

// Unmark Content as Done for a User
exports.unmarkContentAsDone = async (req, res) => {
    try {
        const {content_id} = req.params;
        const userId = req.userId; // assuming you get the user ID from the token
        const content = await Content.findByPk(content_id);
        if (content) {
            let studentContent = await StudentContent.findOne({
                where: {userId, contentId: content_id}
            });
            if (studentContent) {
                studentContent.isDone = false;
                await studentContent.save();
                res.status(200).json({message: 'Content unmarked as done', studentContent});
            } else {
                res.status(404).json({message: 'Record not found'});
            }
        } else {
            res.status(404).json({message: 'Content not found'});
        }
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};