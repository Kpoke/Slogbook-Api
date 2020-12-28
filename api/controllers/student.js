const login = require("../services/login"),
  register = require("../services/student/register"),
  update = require("../services/student/update"),
  home = require("../services/home"),
  message = require("../services/student/message");

const populateObject = "message";
module.exports = {
  home: async (req, res) => {
    try {
      const result = await home(
        req.userId,
        populateObject,
        process.env.STUDENTKEY
      );
      if (result.error)
        return res.status(result.status).send({ error: result.error });

      res.send({ student: result.user });
    } catch (e) {
      res.status(500).send(e.message);
    }
  },

  register: async (req, res) => {
    try {
      const result = await register(req.userId, req.body);
      if (result.error)
        return res.status(result.status).send({ error: result.error });

      res.status(201).send({ student: result.user });
    } catch (e) {
      res.status(500).send(e.message);
    }
  },

  update: async (req, res) => {
    try {
      const result = await update(req.userId, req.body);
      if (result.error)
        return res.status(result.status).send({ error: result.error });

      res.send({
        student: result.student,
        industrysupervisor: result.industrysupervisor,
      });
    } catch (e) {
      res.status(500).send(e.message);
    }
  },

  login: async (req, res) => {
    try {
      const result = await login(
        req.body,
        process.env.STUDENTKEY,
        populateObject
      );
      if (result.error)
        return res.status(result.status).send({ error: result.error });

      res.send({ token: result.token, user: result.user });
    } catch (e) {
      res.status(500).send(e.message);
    }
  },

  message: async (req, res) => {
    try {
      const result = await message(req.userId, req.body, req.file);
      if (result.error)
        return res.status(result.status).send({ error: result.error });

      res.status(201).send({
        message: result.message,
      });
    } catch (e) {
      res.status(500).send(e.message);
    }
  },
};
