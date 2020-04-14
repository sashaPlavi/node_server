const Autentication = require("./controler/autentication");

module.exports = function (app) {
  app.post("/signup", Autentication.signup);
};
