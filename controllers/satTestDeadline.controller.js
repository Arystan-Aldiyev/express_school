const db = require("../models");
const Deadline = db.satTestDeadline;
const SatTest = db.satTest;

exports.createDeadline = async (req, res) => {
    const {test_id, group_id, open, due} = req.body;

    try {
        const satTest = await SatTest.findByPk(test_id);
        if (!satTest) {
            return res.status(404).json({error: "SAT test not found"});
        }

        const existingDeadline = await Deadline.findOne({
            where: {test_id, group_id}
        });

        if (existingDeadline) {
            return res.status(400).json({
                error: "This group already has a deadline for this SAT test. You can update or delete the existing deadline."
            });
        }

        if (!group_id || !open || !due) {
            return res.status(400).json({error: "group_id, open, and due are required"});
        }

        if (new Date(due) <= new Date(open)) {
            return res.status(400).json({error: "Due date must be after open date"});
        }

        const newDeadline = await Deadline.create({
            test_id,
            group_id,
            open,
            due
        });

        res.status(201).json(newDeadline);
    } catch (error) {
        console.error("Error creating deadline:", error);
        res.status(500).json({error: "An error occurred while creating the deadline"});
    }
};


exports.getDeadlinesByTest = async (req, res) => {
    const {testId} = req.params;

    try {
        const satTest = await SatTest.findByPk(testId, {
            include: {
                model: Deadline,
                as: 'sat_test_deadlines',
                attributes: ['deadline_id', 'group_id', 'open', 'due']
            }
        });

        if (!satTest) {
            return res.status(404).json({error: "SAT test not found"});
        }

        res.status(200).json(satTest.sat_test_deadlines);
    } catch (error) {
        console.error("Error fetching deadlines:", error);
        res.status(500).json({error: "An error occurred while fetching the deadlines"});
    }
};

exports.updateDeadline = async (req, res) => {
    const {id} = req.params;
    const {group_id, open, due} = req.body;

    try {
        const deadline = await Deadline.findByPk(id);
        if (!deadline) {
            return res.status(404).json({error: "Deadline not found"});
        }

        if (new Date(due) <= new Date(open)) {
            return res.status(400).json({error: "due date must be after open date"});
        }

        deadline.group_id = group_id || deadline.group_id;
        deadline.open = open || deadline.open;
        deadline.due = due || deadline.due;
        await deadline.save();

        res.status(200).json(deadline);
    } catch (error) {
        console.error("Error updating deadline:", error);
        res.status(500).json({error: "An error occurred while updating the deadline"});
    }
};

exports.deleteDeadline = async (req, res) => {
    const {id} = req.params; // deadline_id

    try {
        const deadline = await Deadline.findByPk(id);
        if (!deadline) {
            return res.status(404).json({error: "Deadline not found"});
        }

        await deadline.destroy();
        res.status(200).json({message: "Deadline deleted successfully"});
    } catch (error) {
        console.error("Error deleting deadline:", error);
        res.status(500).json({error: "An error occurred while deleting the deadline"});
    }
};
