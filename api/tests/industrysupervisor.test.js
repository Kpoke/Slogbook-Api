const request = require("supertest");
const mongoose = require("mongoose");

const Chat = require("../../models/chat");

const app = require("../../app");
const {
  setupDatabase,
  industrySupervisorOne,
  industrySupervisorOneToken,
  chatTwoReportId,
  chatOneId,
} = require("./fixtures/dbsetup");

beforeEach(setupDatabase);
afterAll(async () => {
  await mongoose.connection.close();
});

test("Should login an existing industry supervisor", async () => {
  const response = await request(app)
    .post("/api/industrysupervisor/login")
    .send({
      username: industrySupervisorOne.username,
      password: industrySupervisorOne.password,
    })
    .expect(200);

  expect(response.body.user).toMatchObject({
    username: industrySupervisorOne.username,
  });
});

test("Should not login non-existing industry supervisor", async () => {
  await request(app)
    .post("/api/industrysupervisor/login")
    .send({
      username: "Kabuto",
      password: "password",
    })
    .expect(422);
});

test("Should get profile for existing industry supervisor", async () => {
  await request(app)
    .get("/api/industrysupervisor")
    .set("Authorization", `Bearer ${industrySupervisorOneToken}`)
    .expect(200);
});

test("Should not get profile for unauthorized industry supervisor", async () => {
  await request(app).get("/api/industrysupervisor").expect(401);
});

test("Should not be able to comment an existing student enquiry by unauthorized user", async () => {
  await request(app)
    .patch("/api/industrysupervisor/comment")
    .send({
      comment: "He has been very good",
      messageId: chatOneId,
    })
    .expect(401);
});

test("Should  comment an existing student enquiry(not a report)", async () => {
  await request(app)
    .patch("/api/industrysupervisor/comment")
    .set("Authorization", `Bearer ${industrySupervisorOneToken}`)
    .send({
      comment: "He has been average",
      messageId: chatOneId,
    })
    .expect(200);

  const enquiry = await Chat.findById(chatOneId);
  expect(enquiry.industrySupervisorsComment).toBe("He has been average");
});

test("Should  comment an existing student enquiry", async () => {
  await request(app)
    .patch("/api/industrysupervisor/comment")
    .set("Authorization", `Bearer ${industrySupervisorOneToken}`)
    .send({
      comment: "He has been lacklustre",
      messageId: chatTwoReportId,
    })
    .expect(200);

  const report = await Chat.findById(chatTwoReportId);
  expect(report.industrySupervisorsComment).toBe("He has been lacklustre");
});

test("Should not comment a non-existing student enquiry", async () => {
  await request(app)
    .patch("/api/industrysupervisor/comment")
    .set("Authorization", `Bearer ${industrySupervisorOneToken}`)
    .send({
      comment: "You are not doing well at all",
      messageId: "5f9cff19f412ae0d4769942a",
    })
    .expect(422);
});
