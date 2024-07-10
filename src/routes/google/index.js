const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
    flowName: "GeneralOAuthFlow",
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login",
  }),
  (req, res) => {
    const user = req.user;
    res.redirect(
      `http://localhost:5173/auth/google/success?user=${encodeURIComponent(
        JSON.stringify(user)
      )}`
    );
  }
);

module.exports = router;
