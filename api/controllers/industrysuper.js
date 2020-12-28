const home = require("../services/home"),
  comment = require("../services/supervisor/comment"),
  login = require("../services/login");

const populateObject = {
  path: "student",
  populate: { path: "message" },
};
module.exports = {
  home: async (req, res) => {
    try {
      const result = await home(
        req.userId,
        populateObject,
        process.env.INDUSTRYSUPERVISORKEY
      );
      if (result.error)
        return res.status(result.status).send({ error: result.error });

      res.send({ industrySupervisor: result.user });
    } catch (e) {
      res.status(500).send(e.message);
    }
  },

  login: async (req, res) => {
    try {
      const result = await login(
        req.body,
        process.env.INDUSTRYSUPERVISORKEY,
        populateObject
      );
      if (result.error)
        return res.status(result.status).send({ error: result.error });

      res.send({ token: result.token, user: result.user });
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

      res.send({ message: result.message });
    } catch (e) {
      res.status(500).send(e.message);
    }
  },
};
