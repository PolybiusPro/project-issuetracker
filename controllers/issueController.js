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
        res.status(400).json({ error: "Missing required field(s)" });
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

module.exports = { postIssue, getIssues };
