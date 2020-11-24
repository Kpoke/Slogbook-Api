const request = require("supertest");
const mongoose = require("mongoose");

const Admin = require("../../models/admin");
const app = require("../../app");
const { adminOneToken, setupDatabase } = require("./fixtures/dbsetup");

beforeEach(setupDatabase);
afterAll(async () => {
  await mongoose.connection.close();
});

test("Should signup a new admin", async () => {
  const response = await request(app)
    .post("/api/admin/register")
    .send({
      username: "University of Dubai",
      password: "password",
    })
    .expect(201);

  const admin = await Admin.findById(response.body.user._id);
  expect(admin).not.toBeNull();

  expect(response.body.user).toMatchObject({
    username: "University of Dubai",
  });

  expect(response.body.user.supervisor).toBeDefined();

  expect(response.body.token).not.toBeNull();
});

test("Should not signup a new admin with the same username", async () => {
  await request(app)
    .post("/api/admin/register")
    .send({
      username: "University of Kentucky",
      password: "password",
    })
    .expect(422);
});

test("Should login an existing admin", async () => {
  const response = await request(app)
    .post("/api/admin/login")
    .send({
      username: "University of Kentucky",
      password: "password",
    })
    .expect(200);

  expect(response.body.user).toMatchObject({
    username: "University of Kentucky",
  });
});

test("Should not login non-existing admin", async () => {
  await request(app)
    .post("/api/admin/login")
    .send({
      username: "University of Stans",
      password: "password",
    })
    .expect(422);
});

test("Should get profile for existing admin", async () => {
  await request(app)
    .get("/api/admin")
    .set("Authorization", `Bearer ${adminOneToken}`)
    .expect(200);
});

test("Should not get profile for unauthorized admin", async () => {
  await request(app).get("/api/admin").expect(401);
});

test("Should add a new student avatar", async () => {
  const response = await request(app)
    .post("/api/avatar")
    .set("Authorization", `Bearer ${adminOneToken}`)
    .set("Content-Type", "multipart/form-data")
    .attach(
      "avatar",
      "/home/kpoke/Documents/Projects/incomplete/Elogbook/backend/api/tests/fixtures/random.png"
    )
    .expect(200);

  const user = await Admin.findById(response.body.user._id);
  expect(user.avatarPublicId).toBe("publicid");
});
