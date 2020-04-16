const passport = require("passport");
const User = require("../models/user");
const config = require("../config");
const Jwtstrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local");

//create local strategy
const localOptions = { usernameField: "email" };

const LocalLogin = new LocalStrategy(localOptions, function (
  email,
  password,
  done
) {
  console.log(email);

  //verify email and password
  User.findOne({ email: email }, function (err, user) {
    // console.log("find one");

    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false);
    }
    //comapare password
    user.comparePassword(password, function (err, isMasch) {
      // console.log("comapre pass");

      if (err) {
        return done(err);
      }
      if (!isMasch) {
        return done(null, false);
      }
      return done(null, user);
    });
  });
});

// setup options for jwt

const JwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  secretOrKey: config.secret,
};
//create jwt  startegy
const JwtLogin = new Jwtstrategy(JwtOptions, function (payload, done) {
  //check for user in db
  console.log(payload);

  User.findById(payload.sub, function (err, user) {
    if (err) {
      return done(err, false);
    }

    if (user) {
      console.log("bla user");

      done(null, user);
    } else {
      console.log("bla no user");

      done(null, false);
    }
  });
});

//tell passport to use this strategy
passport.use(JwtLogin);
passport.use(LocalLogin);
