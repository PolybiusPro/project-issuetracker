"use strict";

const {
    getIssues,
    postIssue,
    putIssue,
    deleteIssue,
} = require("../controllers/issueController.js");

module.exports = function (app) {
    app.route("/api/issues/:project")

        .get(function (req, res) {
            getIssues(req, res);
        })

        .post(function (req, res) {
            postIssue(req, res);
        })

        .put(function (req, res) {
            putIssue(req, res);
        })

        .delete(function (req, res) {
            deleteIssue(req, res);
        });
};
