require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const auth = require("./routes/auth");
const passport = require("passport");
const passportConfig = require("./middlewares/passport");
const cookieSession = require("cookie-session");
const checkAuth = require("./middlewares/checkAuth");
const PORT = process.env.PORT || 4000;
const app = express();

// connect mongodb
mongoose
  .connect("mongodb://127.0.0.1:27017/oauth20")
  .then(() => console.log("db connected.."))
  .catch((err) => console.log(err));

// middlewares
app.use(
  cookieSession({
    maxAge: 1000 * 60 * 60 * 24 * 3,
    keys: [process.env.COOKIE_SECRET],
  })
);

app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.set("view engine", "ejs");
app.use("/auth", auth);

// static route
app.get("/", checkAuth, (req, res) => {
  res.render("home");
});

app.listen(PORT, () => console.log(`server is running on PORT ${PORT}..`));
