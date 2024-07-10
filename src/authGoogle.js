const passport = require("passport");
const { user } = require("./models/user.model");
const { createTokenPair } = require("./auth/authUtils");
const KeyTokenService = require("./services/keyToken.service");
require("./models/user.model");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;
const crypto = require("crypto");

passport.use(
  new OAuth2Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      passReqToCallback: true,
    },
    async function (request, accessToken, refreshToken, profile, done) {
      try {
        let foundUser = await user.findOne({ email: profile.email }).exec();
        if (!foundUser) {
          foundUser = await user.create({
            firstName: profile.given_name,
            lastName: profile.family_name,
            email: profile.email,
            avatar: profile.picture,
          });
        }
        const publicKey = crypto.randomBytes(64).toString("hex");
        const privateKey = crypto.randomBytes(64).toString("hex");
        const tokens = await createTokenPair(
          { userId: foundUser._id, email: foundUser.email },
          publicKey,
          privateKey
        );

        await KeyTokenService.createKeyToken({
          userId: foundUser._id,
          refreshToken: tokens.refreshToken,
          privateKey,
          publicKey,
        });
        done(null, { user: foundUser, tokens });
      } catch (e) {
        done(e, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});
