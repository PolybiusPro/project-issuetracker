const { Project } = require("../models/issueModel");

const postIssue = async (req, res) => {
    const {
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        open,
        status_text,
    } = req.body;

    const issue = new Project().issues.create({
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        open,
        status_text,
    });

    try {
        await Project.findOneAndUpdate(
            { name: req.params.project },
            {
                $push: { issues: issue },
            },
            { new: true, upsert: true, runValidators: true }
        );
        res.json(issue);
    } catch (err) {
        res.status(200).json({ error: "Missing required field(s)" });
    }
};

const getIssues = async (req, res) => {
    const filters = req.query;

    try {
        const projectQuery = await Project.findOne({
            name: req.params.project,
        }).exec();

        let issues = projectQuery.issues;

        Object.keys(filters).forEach((field) => {
            issues = issues.filter((issue) => {
                return issue[field] === filters[field];
            });
        });

        res.json(issues);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

const putIssue = async (req, res) => {
    if (!req.body._id) {
        return res.json({ error: "missing _id" });
    }

    try {
        const projectQuery = await Project.findOne({
            name: req.params.project,
        });

        const issueToEdit = projectQuery.issues.id(req.body._id);

        if (!issueToEdit) {
            return res.json({
                _id: req.body._id,
                error: "could not update",
            });
        }

        const fieldsToEdit = req.body;

        Object.keys(fieldsToEdit).forEach((field) => {
            if (field !== "_id") {
                issueToEdit[field] = fieldsToEdit[field];
            }
        });

        await projectQuery.save();
        res.json({
            _id: req.body._id,
            result: "successfully updated",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

const deleteIssue = async (req, res) => {
    if (!req.body._id) {
        return res.json({ error: "missing _id" });
    }

    try {
        const projectQuery = await Project.findOne({
            name: req.params.project,
        });

        const issueToDelete = projectQuery.issues.id(req.body._id);

        if (!issueToDelete) {
            return res.json({
                _id: req.body._id,
                error: "could not delete",
            });
        }

        issueToDelete.deleteOne();

        await projectQuery.save();
        res.json({
            _id: req.body._id,
            result: "successfully deleted",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = { postIssue, getIssues, putIssue, deleteIssue };
