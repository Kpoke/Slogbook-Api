const jwt = require("jsonwebtoken");

module.exports = {
	isAuthorized: function(secretKey) {
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
	}
};
