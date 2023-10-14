const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("./models/Users"); // Import your Mongoose User model

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "56d6e88e3c4306cbc49905b291f4d7f765cd439f8271c7cc13a2bfe86c226482",
};

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        const user = await User.findOne({ username: jwt_payload.username }); // Use lowercase "username" here
        console.log(jwt_payload);
        if (user) {
          return done(null, user);
        }

        return done(null, false);
      } catch (error) {
        return done(error, false);
      }
    })
  );
};
