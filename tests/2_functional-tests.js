const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
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
                done();
            });
    });
    test("Create an issue with missing required fields: POST request to /api/issues/{project}", (done) => {
        chai.request(server)
            .keepOpen()
            .post("/api/issues/apitest")
            .send({})
            .end((err, res) => {
                assert.strictEqual(res.status, 400);
                assert.strictEqual(
                    res.body.error,
                    "Missing required field(s)"
                );
                done();
            });
    });
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
    test("View issues on a project with one filter: GET request to /api/issues/{project}", (done) => {
        chai.request(server)
            .keepOpen()
            .get("/api/issues/apitest?created_by=Test")
            .end((err, res) => {
                assert.strictEqual(res.status, 200);
                assert.deepInclude(res.body, [
                    { created_by: "Test" },
                ]);
                done();
            });
    });
    test("View issues on a project with multiple filters: GET request to /api/issues/{project}", (done) => {
        chai.request(server)
            .keepOpen()
            .get("/api/issues/apitest?created_by=Test&open=true")
            .end((err, res) => {
                assert.strictEqual(res.status, 200);
                assert.deepInclude(res.body, [
                    { created_by: "Test", open: true },
                ]);
                done();
            });
    });
});
