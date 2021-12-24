const router = require("express").Router();
const passport = require("passport");
const checkAuth = require("../middlewares/checkAuth");

const checkLoggedinStatus = (req, res, next) => {
  if (req.user) return res.redirect("/");
  next();
};

router.get("/login", checkLoggedinStatus, (req, res) => {
  res.render("login");
});
router.get("/logout", checkAuth, (req, res) => {
  req.logout();
  res.redirect("/");
});
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
  (req, res) => {
    res.render("login");
  }
);
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    if (!req.user) {
      return res.redirect("/auth/login");
    } else {
      return res.redirect("/");
    }
  }
);

module.exports = router;
