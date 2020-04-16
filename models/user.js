const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

// define model
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String,
});

//on save encrypt pass
userSchema.pre("save", function (next) {
  const user = this;
  //console.log(this);

  //generate salt and than run collback
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    //hash password using salt
    // console.log(user.password);

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMach) {
    if (err) {
      return callback(err);
    }
    return callback(null, isMach);
  });
};

//create model class

const ModelClass = mongoose.model("user", userSchema);

//export model
module.exports = ModelClass;
