const home = require("../services/home"),
  comment = require("../services/supervisor/comment"),
  login = require("../services/login");

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
        process.env.INDUSTRYSUPERVISORKEY
      );
      if (result.error)
        return res.status(result.status).send({ error: result.error });

      res.send({ user: result.user });
    } catch (e) {
      res.status(500).send(e.message);
    }
  },

  login: async (req, res) => {
    try {
      const result = await login(req.body, process.env.INDUSTRYSUPERVISORKEY);
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
        industrySupervisorsComment: req.body.comment,
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
