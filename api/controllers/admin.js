const login = require("../services/login");
const home = require("../services/home");
const register = require("../services/admin/register");

module.exports = admin = {
  admin: async (req, res) => {
    try {
      const populateObject = "supervisor";
      const result = await home(
        req.userId,
        populateObject,
        process.env.ADMINKEY
      );
      if (result.error)
        return res.status(result.status).send({ error: result.error });

      res.send({ admin: result.user });
    } catch (e) {
      res.status(500).send(e.message);
    }
  },

  register: async (req, res) => {
    try {
      const result = await register(req.body);
      if (result.error)
        return res.status(result.status).send({ error: result.error });

      res.status(201).send({ token: result.token, user: result.user });
    } catch (e) {
      res.status(500).send(e.message);
    }
  },

  login: async (req, res) => {
    try {
      const result = await login(req.body, process.env.ADMINKEY);
      if (result.error)
        return res.status(result.status).send({ error: result.error });

      res.send({ token: result.token, user: result.user });
    } catch (e) {
      res.status(500).send(e.message);
    }
  },
};
