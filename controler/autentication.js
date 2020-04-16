const User = require("../models/user");
const jwt = require("jwt-simple");
const config = require("../config");

function tokenForUser(user) {
  const timeStamp = new Date().getTime();

  const payload = {
    sub: user.id,
    iat: timeStamp,
  };
  const token = jwt.encode(payload, config.secret);
  //console.log(token);

  return token;
}

exports.signin = function (req, res, next) {
  // user has email and password auth'd
  //giving them a tocken
  //password is giving us a user from passport functions in req.user
  console.log(req);

  res.send({ token: tokenForUser(req.user) });
};

exports.signup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res
      .status(422)
      .send({ error: "you must provide email and password" });
  }
  // see if user already exists
  User.findOne({ email: email }, (err, exitingUser) => {
    if (err) {
      return next(err);
    }

    if (exitingUser) {
      return res.status(422).send({ error: "email is in use" });
    }

    //create a new user
    const user = new User({
      email: email,
      password: password,
    });
    user.save((err) => {
      if (err) {
        return next(err);
      }
      //send responce
      res.json({ token: tokenForUser(user) });
    });
  });
};
