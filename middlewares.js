const jwt = require("jsonwebtoken");
const multer = require("multer");

module.exports = {
  isAuthorized: function (secretKey) {
    return (req, res, next) => {
      let authorization = req.headers.authorization;
      if (!authorization) {
        return res.status(401).send({ error: "You must be logged in" });
      }

      const token = authorization.replace("Bearer ", "");
      jwt.verify(token, secretKey, async (err, payload) => {
        if (err) {
          return res.status(401).send({ error: "You must be logged in" });
        }
        req.userId = payload.userid;
        next();
      });
    };
  },
  multerSetup: multer({
    limits: {
      fileSize: 5000000,
    },
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(jpg|jpeg|png|mp4|mov|avi)$/)) {
        return cb(new Error("Please upload an image or video"));
      }

      cb(undefined, true);
    },
  }),
};
