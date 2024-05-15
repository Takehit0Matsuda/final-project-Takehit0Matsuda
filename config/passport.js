const JwtStrategy = require("passport-jwt").Strategy
const ExtractJwt = require("passport-jwt").ExtractJwt
const User = require("../models/User_model")
const config = require("./config")

const secret = config.secret

module.exports = (passport) => {
    var opts = {}
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt")
    opts.secretOrKey = secret
    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
        User.findOne({_id: jwt_payload._id}, (err, user) => {
            if (err) {
                return done(err, false)
            }
            if (user) {
                done(null, user)
            }
            else{
                done(null, false)
            }
        })
    }))
}