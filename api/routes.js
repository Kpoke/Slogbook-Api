const { admin, industrysuper, student, supervisor } = require("./controllers");
const middlewares = require("../middlewares");

module.exports = (app) => {
  //ADMIN
  app.post("/admin/register", admin.register);
  app.post("/admin/login", admin.login);
  app.get(
    "/admin",
    middlewares.isAuthorized(process.env.ADMINKEY),
    admin.admin
  );

  //INDUSTRY SUPERVISOR
  app.get(
    "/industrysupervisor",
    middlewares.isAuthorized(process.env.INDUSTRYSUPERVISORKEY),
    industrysuper.home
  );
  app.post("/industrysupervisor/login", industrysuper.login);
  app.patch(
    "/industrysupervisor/comment",
    middlewares.isAuthorized(process.env.INDUSTRYSUPERVISORKEY),
    industrysuper.comment
  );

  //STUDENT
  app.get(
    "/student",
    middlewares.isAuthorized(process.env.STUDENTKEY),
    student.home
  );
  app.post(
    "/student/register",
    middlewares.isAuthorized(process.env.SUPERVISORKEY),
    student.register
  );
  app.patch(
    "/student/update",
    middlewares.isAuthorized(process.env.STUDENTKEY),
    student.update
  );
  app.post("/student/login", student.login);
  app.post(
    "/student/message",
    middlewares.isAuthorized(process.env.STUDENTKEY),
    student.message
  );

  //SUPERVISOR
  app.get(
    "/supervisor",
    middlewares.isAuthorized(process.env.SUPERVISORKEY),
    supervisor.home
  );
  app.post(
    "/supervisor/register",
    middlewares.isAuthorized(process.env.ADMINKEY),
    supervisor.register
  );
  app.post("/supervisor/login", supervisor.login);
  app.patch(
    "/supervisor/comment",
    middlewares.isAuthorized(process.env.SUPERVISORKEY),
    supervisor.comment
  );

  app.get("*", (req, res) => {
    res.send({ response: "Seems like you took a wrong turn" });
  });

  return app;
};
