const GoogleStrategy = require('passport-google-oauth20').Strategy
const bcrypt = require('bcrypt')
const User = require('./models/Users')

module.exports = function(passport) {
    passport.use(
        new GoogleStrategy({
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: '/auth/google/callback',
            },
            async(accessToken, refreshToken, profile, done) => {
                const newUser = {
                    googleId: profile.id,
                    displayName: profile.displayName,
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    image: profile.photos[0].value,
                    email: profile.emails[0].value
                }
                try {
                    let user = await User.getUser(profile.emails[0].value)
                    if (user[0]) {
                        done(null, user)
                    } else {
                        const password = await bcrypt.hash(profile.id, 10)
                        user = await User.createUser([profile.emails[0].value, password])
                        user = await User.getUser(profile.emails[0].value)
                        done(null, user)
                    }
                } catch (err) {
                    console.error(err)
                }
            }
        )
    )
    passport.serializeUser((user, done) => {
        done(null, user[0])
    })
    passport.deserializeUser((email, done) => {
        done(null, email)
    })
}