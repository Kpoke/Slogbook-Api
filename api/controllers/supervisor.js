const home = require("../services/home"),
  comment = require("../services/supervisor/comment"),
  login = require("../services/login"),
  register = require("../services/supervisor/register");

module.exports = {
  home: (req, res) => {
    try {
      const populateObject = {
        path: "student",
        populate: { path: "message" },
      };
      const result = home(
        req.userId,
        populateObject,
        process.env.SUPERVISORKEY
      );
      if (result.error)
        return res.status(result.status).send({ error: result.error });

      res.send({ user: result.user });
    } catch (e) {
      res.status(500).send(e.message);
    }
  },

  register: async (req, res) => {
    try {
      const result = await register(req.userId, req.body);
      if (result.error)
        return res.status(result.status).send({ error: result.error });

      res.send({ supervisor: result.user });
    } catch (e) {
      res.status(500).send(e.message);
    }
  },

  login: async (req, res) => {
    try {
      const result = await login(req.body, process.env.SUPERVISORKEY);
      if (result.error)
        return res.status(result.status).send({ error: result.error });

      res.send({ token: result.token });
    } catch (e) {
      res.status(500).send(e.message);
    }
  },

  comment: async (req, res) => {
    try {
      let update = {
        score: req.body.score,
        schoolSupervisorsComment: req.body.comment,
      };
      let filter = { _id: req.body.messageId };
      const result = await comment(update, filter);
      if (result.error)
        return res.status(result.status).send({ error: result.error });

      res.send({ report: result.report });
    } catch (e) {
      res.status(500).send(e.message);
    }
  },
};
