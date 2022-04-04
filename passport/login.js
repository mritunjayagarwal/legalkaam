const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/users');

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user)
    })
});

passport.use('local.login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, (req, username, password, done) => {
    User.findOne({'username': username}, (err, user) => {
        if(err){
            return done(null, false, req.flash('error', 'Unexpected Error Occured! Please Try again later'));
        }

        if(!user || !user.compare(password)){
            return done(null, false, req.flash('error', 'User Does not exist or password does not match'));
        }else{
            return done(null, user);
        }
    })
}))
