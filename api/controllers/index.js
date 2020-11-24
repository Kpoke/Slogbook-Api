const admin = require("./admin");
const industrysuper = require("./industrysuper");
const student = require("./student");
const supervisor = require("./supervisor");
const avatar = require("../services/avatar");

const setAvatar = async (req, res) => {
  try {
    const result = await avatar(req.userId, req.key, req.file);
    if (result.error)
      return res.status(result.status).send({ error: result.error });

    res.status(200).send({
      user: result.user,
    });
  } catch (e) {
    res.status(500).send(e.message);
  }
};

module.exports = { admin, industrysuper, student, supervisor, setAvatar };
