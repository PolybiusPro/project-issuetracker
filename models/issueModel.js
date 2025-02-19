const { Schema, model } = require("mongoose");

const issueSchema = new Schema({
    issue_title: { type: String, required: true },
    issue_text: { type: String, required: true },
    created_by: { type: String, required: true },
    updated_on: { type: Date, default: new Date(), required: true },
    created_on: { type: Date, default: new Date(), required: true },
    assigned_to: { type: String, default: "" },
    open: { type: Boolean, default: true, required: true },
    status_text: { type: String, default: "" },
});

const Issue = model("Issue", issueSchema);

const projectSchema = new Schema({
    name: { type: String, required: true },
    issues: [issueSchema],
});

const Project = model("Project", projectSchema);

module.exports = { Project, Issue };
