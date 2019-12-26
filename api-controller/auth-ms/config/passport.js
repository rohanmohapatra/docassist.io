const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const Users = require('./../models/User');

passport.use('local', new LocalStrategy({
    usernameField: 'user[email]',
    passwordField: 'user[password]',
}, (email, password, done) => {
    Users.findOne({ email })
        .then((user) => {
            console.log(user.validatePassword(password));
            if (!user || !user.validatePassword(password)) {
                console.log('inhere');
                return done(null, false, { errors: { message: 'email_or_password is invalid' } });
            }

            return done(null, user);
        }).catch(done);
}));