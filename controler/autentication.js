const User = require("../models/user");

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
      res.json({ success: true });
    });
  });
};
