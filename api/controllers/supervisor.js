const Supervisor = require("../../models/supervisor"),
  jwt = require("jsonwebtoken"),
  bcrypt = require("bcrypt"),
  middlewares = require("../../middlewares"),
  Chat = require("../../models/chat"),
  Student = require("../../models/student"),
  login = require("../services/login");
Admin = require("../../models/admin");

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

  //signup route
  register: async (req, res) => {
    let name = req.body.name;
    let username = req.body.username;
    let password = req.body.password;
    let frequency = req.body.frequency;
    let user = new Supervisor({ name, username, password, frequency });
    let flag = await Supervisor.exists({ username });
    if (!flag) {
      let admin = await Admin.findById(req.userId);
      if (!admin) {
        res.status(422).send({ error: "Admin account not found" });
      }

      user.save();
      admin.supervisor.push(user._id);
      admin.save();

      jwt.sign({ userid: user._id }, process.env.SUPERVISORKEY);
      res.send("admin");
    } else {
      res.status(422).send({ error: "Username already exists" });
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
    let update = {
      score: req.body.score,
      schoolSupervisorsComment: req.body.comment,
    };
    let filter = { _id: req.body.messageId };
    let message = await Chat.findOneAndUpdate(filter, update);
    if (!message) {
      return res.status(422).send({ error: "Username Invalid" });
    }
    res.send({ feedback: "Saved" });
  },
};
