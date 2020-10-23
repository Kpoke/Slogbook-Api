const IndustrySupervisor = require("../../models/industrysuper"),
  Chat = require("../../models/chat"),
  home = require("../services/home"),
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
    let update = {
      industrySupervisorsComment: req.body.comment,
    };
    let filter = { _id: req.body.messageId };
    let message = await Chat.findOneAndUpdate(filter, update);
    if (!message) {
      return res.status(422).send({ error: "Username Invalid" });
    }
    res.send({ feedback: "Saved" });
  },
};
