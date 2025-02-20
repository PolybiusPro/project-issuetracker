const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

let testId = "";

suite("Functional Tests", function () {
    // #1
    test("Create an issue with every field: POST request to /api/issues/{project}", (done) => {
        chai.request(server)
            .keepOpen()
            .post("/api/issues/apitest")
            .send({
                issue_title: "Test post",
                issue_text: "Testing issue with every field",
                created_by: "Tester",
                assigned_to: "Tester",
                status_text: "In QA",
            })
            .end((err, res) => {
                assert.strictEqual(res.status, 200);
                assert.property(res.body, "_id");
                assert.strictEqual(res.body.issue_title, "Test post");
                assert.strictEqual(
                    res.body.issue_text,
                    "Testing issue with every field"
                );
                assert.strictEqual(res.body.created_by, "Tester");
                assert.strictEqual(res.body.assigned_to, "Tester");
                assert.isString(res.body.created_on);
                assert.isString(res.body.updated_on);
                assert.isTrue(res.body.open);
                assert.strictEqual(res.body.status_text, "In QA");
                done();
            });
    });
    // #2
    test("Create an issue with only required fields: POST request to /api/issues/{project}", (done) => {
        chai.request(server)
            .keepOpen()
            .post("/api/issues/apitest")
            .send({
                issue_title: "Test post",
                issue_text: "Testing issue with required fields",
                created_by: "Tester",
            })
            .end((err, res) => {
                assert.strictEqual(res.status, 200);
                assert.property(res.body, "_id");
                assert.strictEqual(res.body.issue_title, "Test post");
                assert.strictEqual(
                    res.body.issue_text,
                    "Testing issue with required fields"
                );
                assert.strictEqual(res.body.created_by, "Tester");
                assert.strictEqual(res.body.assigned_to, "");
                assert.isString(res.body.created_on);
                assert.isString(res.body.updated_on);
                assert.isTrue(res.body.open);
                testId = res.body._id;
                done();
            });
    });
    // #3
    test("Create an issue with missing required fields: POST request to /api/issues/{project}", (done) => {
        chai.request(server)
            .keepOpen()
            .post("/api/issues/apitest")
            .send({})
            .end((err, res) => {
                assert.strictEqual(res.status, 200);
                assert.strictEqual(
                    res.body.error,
                    "required field(s) missing"
                );
                done();
            });
    });
    // #4
    test("View issues on a project: GET request to /api/issues/{project}", (done) => {
        chai.request(server)
            .keepOpen()
            .get("/api/issues/apitest")
            .end((err, res) => {
                assert.strictEqual(res.status, 200);
                assert.isArray(res.body);
                done();
            });
    });
    // #5
    test("View issues on a project with one filter: GET request to /api/issues/{project}", (done) => {
        chai.request(server)
            .keepOpen()
            .get("/api/issues/apitest?created_by=Tester")
            .end((err, res) => {
                assert.strictEqual(res.status, 200);
                res.body.forEach((obj) => {
                    assert.strictEqual(obj.created_by, "Tester");
                });
                done();
            });
    });
    // #6
    test("View issues on a project with multiple filters: GET request to /api/issues/{project}", (done) => {
        chai.request(server)
            .keepOpen()
            .get("/api/issues/apitest?created_by=Test&open=true")
            .end((err, res) => {
                assert.strictEqual(res.status, 200);
                res.body.forEach((obj) => {
                    assert.strictEqual(obj.created_by, "Tester");
                    assert.isTrue(obj.open);
                });
                done();
            });
    });
    // #7
    test("Update one field on an issue: PUT request to /api/issues/{project}", (done) => {
        chai.request(server)
            .keepOpen()
            .put("/api/issues/apitest")
            .send({ _id: testId, open: false })
            .end((err, res) => {
                assert.strictEqual(res.status, 200);
                assert.strictEqual(res.body._id, testId);
                assert.strictEqual(
                    res.body.result,
                    "successfully updated"
                );
                done();
            });
    });
    // #8
    test("Update multiple fields on an issue: PUT request to /api/issues/{project}", (done) => {
        chai.request(server)
            .keepOpen()
            .put("/api/issues/apitest")
            .send({
                _id: testId,
                assigned_to: "New Tester",
                title: "TestUpdate",
            })
            .end((err, res) => {
                assert.strictEqual(res.status, 200);
                assert.strictEqual(res.body._id, testId);
                assert.strictEqual(
                    res.body.result,
                    "successfully updated"
                );
                done();
            });
    });
    // #9
    test("Update an issue with missing _id: PUT request to /api/issues/{project}", (done) => {
        chai.request(server)
            .keepOpen()
            .put("/api/issues/apitest")
            .send({})
            .end((err, res) => {
                assert.strictEqual(res.status, 200);
                assert.strictEqual(res.body.error, "missing _id");
                done();
            });
    });
    // #10
    test("Update an issue with no fields to update: PUT request to /api/issues/{project}", (done) => {
        chai.request(server)
            .keepOpen()
            .put("/api/issues/apitest")
            .send({ _id: testId })
            .end((err, res) => {
                assert.strictEqual(res.status, 200);
                assert.strictEqual(res.body._id, testId);
                assert.strictEqual(
                    res.body.error,
                    "no update field(s) sent"
                );
                done();
            });
    });
    // #11
    test("Update an issue with an invalid _id: PUT request to /api/issues/{project}", (done) => {
        chai.request(server)
            .keepOpen()
            .put("/api/issues/apitest")
            .send({ _id: "notvalid" })
            .end((err, res) => {
                assert.strictEqual(res.status, 200);
                assert.strictEqual(res.body._id, "notvalid");
                assert.strictEqual(
                    res.body.error,
                    "could not update"
                );
                done();
            });
    });
    // #12
    test("Delete an issue: DELETE request to /api/issues/{project}", (done) => {
        chai.request(server)
            .keepOpen()
            .delete("/api/issues/apitest")
            .send({ _id: testId })
            .end((err, res) => {
                assert.strictEqual(res.status, 200);
                assert.strictEqual(res.body._id, testId);
                assert.strictEqual(
                    res.body.result,
                    "successfully deleted"
                );
                done();
            });
    });
    // #13
    test("Delete an issue with an invalid _id: DELETE request to /api/issues/{project}", (done) => {
        chai.request(server)
            .keepOpen()
            .delete("/api/issues/apitest")
            .send({ _id: "notvalid" })
            .end((err, res) => {
                assert.strictEqual(res.status, 200);
                assert.strictEqual(res.body._id, "notvalid");
                assert.strictEqual(
                    res.body.error,
                    "could not delete"
                );
                done();
            });
    });
    // #14
    test("Delete an issue with missing _id: DELETE request to /api/issues/{project}", (done) => {
        chai.request(server)
            .keepOpen()
            .delete("/api/issues/apitest")
            .send({})
            .end((err, res) => {
                assert.strictEqual(res.status, 200);
                assert.strictEqual(res.body.error, "missing _id");
                done();
            });
    });
});
