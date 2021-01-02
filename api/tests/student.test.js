const request = require("supertest");
const mongoose = require("mongoose");

const Supervisor = require("../../models/supervisor");
const IndustrySupervisor = require("../../models/industrysuper");
const Chat = require("../../models/chat");
const Student = require("../../models/student");

const app = require("../../app");
const {
  supervisorOneId,
  supervisorOneToken,
  studentOneId,
  studentOne,
  studentOneToken,
  setupDatabase,
  supervisorOne,
  industrySupervisorOne,
  studentTwoToken,
} = require("./fixtures/dbsetup");

beforeEach(setupDatabase);
afterAll(async () => {
  await mongoose.connection.close();
});

test("Should not let unauthorized user create a student account", async () => {
  await request(app)
    .post("/api/student/register")
    .send({
      name: "Uchiha Sasuske",
      username: "Usasuske",
      password: "password",
      matric: "192107",
      course: "Killing Itachi ",
      session: "2019/2020",
      level: "400",
      email: "UchihaSasuske@gmail.com",
    })
    .expect(401);
});

test("Should not let student create a student account", async () => {
  await request(app)
    .post("/api/student/register")
    .set("Authorization", `Bearer ${studentOneToken}`)
    .send({
      name: "Uchiha Sasuske",
      username: "Usasuske",
      password: "password",
      matric: "192107",
      course: "Killing Itachi ",
      session: "2019/2020",
      level: "400",
      email: "UchihaSasuske@gmail.com",
    })
    .expect(401);
});

test("Should not create student with existing email", async () => {
  await request(app)
    .post("/api/student/register")
    .set("Authorization", `Bearer ${supervisorOneToken}`)
    .send({
      name: "Uchiha Sasuske",
      username: "Usasuske",
      password: "password",
      matric: "192107",
      course: "Killing Itachi ",
      session: "2019/2020",
      level: "400",
      email: studentOne.email,
    })
    .expect(422);
});

test("Should not create student with existing matric number", async () => {
  await request(app)
    .post("/api/student/register")
    .set("Authorization", `Bearer ${supervisorOneToken}`)
    .send({
      name: "Uchiha Sasuske",
      username: "Usasuske",
      password: "password",
      matric: studentOne.matricNumber,
      course: "Killing Itachi ",
      session: "2019/2020",
      level: "400",
      email: "UchihaSasuske@gmail.com",
    })
    .expect(422);
});

test("Should not create student with existing username", async () => {
  await request(app)
    .post("/api/student/register")
    .set("Authorization", `Bearer ${supervisorOneToken}`)
    .send({
      name: "Uchiha Sasuske",
      username: studentOne.username,
      password: "password",
      matric: "192107",
      course: "Killing Itachi ",
      session: "2019/2020",
      level: "400",
      email: "UchihaSasuske@gmail.com",
    })
    .expect(422);
});

test("Should create a student account", async () => {
  const response = await request(app)
    .post("/api/student/register")
    .set("Authorization", `Bearer ${supervisorOneToken}`)
    .send({
      name: "Uchiha Sasuske",
      username: "Usasuske",
      password: "password",
      matric: 192107,
      course: "Killing Itachi ",
      session: "2019/2020",
      level: 400,
      email: "UchihaSasuske@gmail.com",
    })
    .expect(201);

  const supervisor = await Supervisor.findById(supervisorOneId);
  expect(supervisor.student.length).toBe(1);
});

test("Should login an existing student", async () => {
  const response = await request(app)
    .post("/api/student/login")
    .send({
      username: studentOne.username,
      password: "password",
    })
    .expect(200);

  expect(response.body.user).toMatchObject({
    name: studentOne.name,
  });
});

test("Should not login non-existing student", async () => {
  await request(app)
    .post("/api/student/login")
    .send({
      username: "Kakuzu",
      password: "password",
    })
    .expect(422);
});

test("Should get profile for existing student", async () => {
  await request(app)
    .get("/api/student")
    .set("Authorization", `Bearer ${studentOneToken}`)
    .expect(200);
});

test("Should not get profile for unauthorized student", async () => {
  await request(app).get("/api/student").expect(401);
});

test("Should  update an existing student's details and create industry supervisor's account", async () => {
  const response = await request(app)
    .patch("/api/student/update")
    .set("Authorization", `Bearer ${studentOneToken}`)
    .send({
      address: "Konoha",
      allowance: "150000",
      phoneNumber: 2348142216261,
      startDate: "10/30/2020",
      companyName: "Team 7",
      companyLocation: "Hidden Village",
      companyNumber: 2348142216263,
      authIndustryObject: {
        industrySuperName: "Minato Namikaze",
        industrySuperUsername: "NMinato",
        industrySuperPassword: "password",
        industrySuperPhoneNumber: "2348142236261",
        industrySuperPost: "Father",
        industrySuperEmail: "NamikazeMinato@hotmail.com",
      },
    })
    .expect(200);

  expect(response.body).toMatchObject({
    student: {
      addressDuringTraining: "Konoha",
      monthlyAllowance: 150000,
      phoneNumber: 2348142216261,
      companyName: "Team 7",
      companyLocation: "Hidden Village",
      companyPhoneNumber: 2348142216263,
    },
    industrysupervisor: {
      name: "Minato Namikaze",
      username: "NMinato",
      phoneNumber: 2348142236261,
      post: "Father",
      email: "NamikazeMinato@hotmail.com",
    },
  });
  const industrySuper = await IndustrySupervisor.findById(
    response.body.industrysupervisor._id
  );

  expect(industrySuper).not.toBeNull();
  expect(industrySuper.student.length).toBe(1);
  const student = await Student.findById(studentOneId);
  expect(student.industrySuper.length).toBe(1);
  expect(student.dateArray.length).toBeGreaterThan(24);
  expect(student.dateArray.length).not.toBeNull();
});

test("Should  not create new  industry supervisor's account if not authorized", async () => {
  await request(app)
    .patch("/api/student/update")
    .send({
      address: "Konoha",
      allowance: "150000",
      phoneNumber: 2348142216261,
      startDate: "10/24/2020",
      companyName: "Team 7",
      companyLocation: "Hidden Village",
      companyNumber: 2348142216263,
      authIndustryObject: {
        industrySuperName: "Minato Namikaze",
        industrySuperUsername: "NMinato",
        industrySuperPassword: "password",
        industrySuperPhoneNumber: "2348142236261",
        industrySuperPost: "Father",
        industrySuperEmail: "NamikazeMinato@hotmail.com",
      },
    })
    .expect(401);
});

test("Should  not create new  industry supervisor's account username already exists", async () => {
  await request(app)
    .patch("/api/student/update")
    .set("Authorization", `Bearer ${studentOneToken}`)
    .send({
      address: "Konoha",
      allowance: "150000",
      phoneNumber: 2348142216261,
      startDate: "10/24/2020",
      companyName: "Team 7",
      companyLocation: "Hidden Village",
      companyNumber: 2348142216263,
      authIndustryObject: {
        industrySuperName: "Minato Namikaze",
        industrySuperUsername: industrySupervisorOne.username,
        industrySuperPassword: "password",
        industrySuperPhoneNumber: "2348142236261",
        industrySuperPost: "Father",
        industrySuperEmail: "NamikazeMinato@hotmail.com",
      },
    })
    .expect(422);
});

test("Should  not create new  industry supervisor's account email already exists", async () => {
  await request(app)
    .patch("/api/student/update")
    .set("Authorization", `Bearer ${studentOneToken}`)
    .send({
      address: "Konoha",
      allowance: "150000",
      phoneNumber: 2348142216261,
      startDate: "10/24/2020",
      companyName: "Team 7",
      companyLocation: "Hidden Village",
      companyNumber: 2348142216263,
      authIndustryObject: {
        industrySuperName: "Minato Namikaze",
        industrySuperUsername: "Mnamikaze",
        industrySuperPassword: "password",
        industrySuperPhoneNumber: "2348142236261",
        industrySuperPost: "Father",
        industrySuperEmail: industrySupervisorOne.email,
      },
    })
    .expect(422);
});

test("Should not be able to update twice", async () => {
  const response = await request(app)
    .patch("/api/student/update")
    .set("Authorization", `Bearer ${studentTwoToken}`)
    .send({
      address: "Konoha",
      allowance: "160000",
      phoneNumber: 2348142216261,
      startDate: "10/24/2020",
      companyName: "Team 7",
      companyLocation: "Hidden Village",
      companyNumber: 2348142216263,
      authIndustryObject: {
        industrySuperName: "Sarutobi The third",
        industrySuperUsername: "third",
        industrySuperPassword: "password",
        industrySuperPhoneNumber: "2348142236271",
        industrySuperPost: "Legend",
        industrySuperEmail: "sarutobithethird@gmail.com",
      },
    })
    .expect(422);
});

test("Should create a new student report", async () => {
  const response = await request(app)
    .post("/api/student/message")
    .set("Authorization", `Bearer ${studentOneToken}`)
    .set("Content-Type", "multipart/form-data")
    .field("isReport", true)
    .field("report", "Report repor repo rep re r")
    .field("date", "11/5/2020")
    .attach(
      "image",
      "/home/kpoke/Documents/Projects/incomplete/Elogbook/backend/api/tests/fixtures/random.png"
    )
    .expect(201);

  const message = await Chat.findById(response.body.message._id);
  expect(message).not.toBeNull();
  expect(message.imagePublicId).toBe("publicid");
});

test("Should not create a new student report by unauthorized user", async () => {
  await request(app)
    .post("/api/student/message")
    .set("Content-Type", "multipart/form-data")
    .field("isReport", true)
    .field("report", "Report repor repo rep re r")
    .field("date", "11/5/2020")
    .attach(
      "image",
      "/home/kpoke/Documents/Projects/incomplete/Elogbook/backend/api/tests/fixtures/random.png"
    )
    .expect(401);
});

test("Should add a new student avatar", async () => {
  const response = await request(app)
    .post("/api/avatar")
    .set("Authorization", `Bearer ${studentOneToken}`)
    .set("Content-Type", "multipart/form-data")
    .attach(
      "avatar",
      "/home/kpoke/Documents/Projects/incomplete/Elogbook/backend/api/tests/fixtures/random.png"
    )
    .expect(200);

  const user = await Student.findById(response.body.user._id);
  expect(user.avatarPublicId).toBe("publicid");
});

test("Should not add a new student avatar by unauthorized user", async () => {
  await request(app)
    .post("/api/avatar")
    .set("Content-Type", "multipart/form-data")
    .attach(
      "avatar",
      "/home/kpoke/Documents/Projects/incomplete/Elogbook/backend/api/tests/fixtures/random.png"
    )
    .expect(401);
});
