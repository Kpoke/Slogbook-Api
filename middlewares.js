const jwt = require("jsonwebtoken");
const multer = require("multer");

const checkToken = (token) => {
  let response = {};
  const secrets = {
    admin: process.env.ADMINKEY,
    student: process.env.STUDENTKEY,
    supervisor: process.env.SUPERVISORKEY,
    industrysupervisor: process.env.INDUSTRYSUPERVISORKEY,
  };
  jwt.verify(token, secrets.admin, (err, payload) => {
    if (err) {
      jwt.verify(token, secrets.student, (err, payload) => {
        if (err) {
          jwt.verify(token, secrets.supervisor, (err, payload) => {
            if (err) {
              jwt.verify(token, secrets.industrysupervisor, (err, payload) => {
                if (err) {
                  response["error"] = "You must be logged in";
                } else {
                  response["userid"] = payload.userid;
                  response["key"] = secrets.industrysupervisor;
                }
              });
            } else {
              response["userid"] = payload.userid;
              response["key"] = secrets.supervisor;
            }
          });
        } else {
          response["userid"] = payload.userid;
          response["key"] = secrets.student;
        }
      });
    } else {
      response["userid"] = payload.userid;
      response["key"] = secrets.admin;
    }
  });
  return response;
};

module.exports = {
  isAuthorized: function (secretKey) {
    return (req, res, next) => {
      let authorization = req.headers.authorization;
      if (!authorization) {
        return res.status(401).send({ error: "You must be logged in" });
      }

      const token = authorization.replace("Bearer ", "");
      if (!secretKey) {
        const payload = checkToken(token);
        if (payload.error) {
          return res.status(401).send({ error: "You must be logged in" });
        }
        req.userId = payload.userid;
        req.key = payload.key;
        next();
      } else {
        jwt.verify(token, secretKey, (err, payload) => {
          if (err) {
            return res.status(401).send({ error: "You must be logged in" });
          }
          req.userId = payload.userid;
          next();
        });
      }
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
