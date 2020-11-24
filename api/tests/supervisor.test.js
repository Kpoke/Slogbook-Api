const request = require("supertest");
const mongoose = require("mongoose");

const Admin = require("../../models/admin");
const Supervisor = require("../../models/supervisor");
const Chat = require("../../models/chat");

const app = require("../../app");
const {
  adminOneId,
  adminOneToken,
  supervisorOneToken,
  supervisorOne,
  chatOneId,
  chatTwoReportId,
  setupDatabase,
} = require("./fixtures/dbsetup");

beforeEach(setupDatabase);
afterAll(async () => {
  await mongoose.connection.close();
});

test("Should not let unauthorized admin create a supervisor account", async () => {
  await request(app)
    .post("/api/supervisor/register")
    .send({
      name: "Bruno Fernandes",
      username: "Bfernandes",
      password: "password",
      frequency: "Weekly",
      email: "Bfernandes@yahoo.com",
    })
    .expect(401);
});

test("Should not let supervisor create a supervisor account", async () => {
  await request(app)
    .post("/api/supervisor/register")
    .set("Authorization", `Bearer ${supervisorOneToken}`)
    .send({
      name: "Bruno Fernandes",
      username: "Bfernandes",
      password: "password",
      frequency: "Weekly",
      email: "Bfernandes@yahoo.com",
    })
    .expect(401);
});

test("Should not create a supervisor account with existing username", async () => {
  await request(app)
    .post("/api/supervisor/register")
    .set("Authorization", `Bearer ${adminOneToken}`)
    .send({
      name: "Bruno Fernandes",
      username: supervisorOne.username,
      password: "password",
      frequency: "Weekly",
      email: "Bfernandes@yahoo.com",
    })
    .expect(422);
});

test("Should not create a supervisor account with existing email", async () => {
  await request(app)
    .post("/api/supervisor/register")
    .set("Authorization", `Bearer ${adminOneToken}`)
    .send({
      name: "Bruno Fernandes",
      username: "Bfernandes",
      password: "password",
      frequency: "Weekly",
      email: supervisorOne.email,
    })
    .expect(422);
});

test("Should create a supervisor account", async () => {
  const response = await request(app)
    .post("/api/supervisor/register")
    .set("Authorization", `Bearer ${adminOneToken}`)
    .send({
      name: "Bruno Fernandes",
      username: "Bfernandes",
      password: "password",
      frequency: "Weekly",
      email: "Bfernandes@yahoo.com",
    })
    .expect(201);

  const supervisor = await Supervisor.findById(response.body.supervisor._id);
  expect(supervisor).not.toBeNull();

  expect(response.body.supervisor).toMatchObject({
    name: "Bruno Fernandes",
    username: "Bfernandes",
    frequency: "Weekly",
    email: "Bfernandes@yahoo.com",
  });

  const admin = await Admin.findById(adminOneId);
  expect(admin.supervisor.length).toBe(1);
});

test("Should login an existing supervisor", async () => {
  const response = await request(app)
    .post("/api/supervisor/login")
    .send({
      username: "Hkakashi",
      password: "password",
    })
    .expect(200);

  expect(response.body.user).toMatchObject({
    name: "Hatake Kakashi",
  });
});

test("Should not login non-existing supervisor", async () => {
  await request(app)
    .post("/api/supervisor/login")
    .send({
      username: "Orochimaru",
      password: "password",
    })
    .expect(422);
});

test("Should get profile for existing supervisor", async () => {
  await request(app)
    .get("/api/supervisor")
    .set("Authorization", `Bearer ${supervisorOneToken}`)
    .expect(200);
});

test("Should not get profile for unauthorized supervisor", async () => {
  await request(app).get("/api/supervisor").expect(401);
});

test("Should not be able to comment an existing student enquiry by unauthorized user", async () => {
  await request(app)
    .patch("/api/supervisor/comment")
    .send({
      comment: "You are not doing well at all",
      messageId: chatOneId,
    })
    .expect(401);
});

test("Should  comment an existing student enquiry(not a report)", async () => {
  await request(app)
    .patch("/api/supervisor/comment")
    .set("Authorization", `Bearer ${supervisorOneToken}`)
    .send({
      comment: "You are not doing well at all",
      messageId: chatOneId,
    })
    .expect(200);

  const enquiry = await Chat.findById(chatOneId);
  expect(enquiry.schoolSupervisorsComment).toBe(
    "You are not doing well at all"
  );
});

test("Should  comment an existing student enquiry", async () => {
  await request(app)
    .patch("/api/supervisor/comment")
    .set("Authorization", `Bearer ${supervisorOneToken}`)
    .send({
      comment: "You are not doing well at all",
      score: 5,
      messageId: chatTwoReportId,
    })
    .expect(200);

  const report = await Chat.findById(chatTwoReportId);
  expect(report.schoolSupervisorsComment).toBe("You are not doing well at all");
  expect(report.score).toBe(5);
});

test("Should not comment a non-existing student enquiry", async () => {
  await request(app)
    .patch("/api/supervisor/comment")
    .set("Authorization", `Bearer ${supervisorOneToken}`)
    .send({
      comment: "You are not doing well at all",
      score: 5,
      messageId: "5f9cff19f412ae0d4769942a",
    })
    .expect(422);
});

test("Should add a new supervisor avatar", async () => {
  const response = await request(app)
    .post("/api/avatar")
    .set("Authorization", `Bearer ${supervisorOneToken}`)
    .set("Content-Type", "multipart/form-data")
    .attach(
      "avatar",
      "/home/kpoke/Documents/Projects/incomplete/Elogbook/backend/api/tests/fixtures/random.png"
    )
    .expect(200);

  const user = await Supervisor.findById(response.body.user._id);
  expect(user.avatarPublicId).toBe("publicid");
});
