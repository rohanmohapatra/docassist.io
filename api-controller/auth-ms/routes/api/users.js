const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('../auth');
const Users = require('./../../models/User');

//POST new user route (optional, everyone has access)
router.post('/', auth.optional, (req, res, next) => {
    const { body: { user } } = req;

    if (!user.email) {
        return res.status(422).json({
            errors: {
                email: 'is required',
            },
        });
    }

    if (!user.password) {
        return res.status(422).json({
            errors: {
                password: 'is required',
            },
        });
    }

    Users.findOne({ email: user.email })
        .then(foundUser => {
            console.log('foundUser', foundUser);

            if (!foundUser) {
                // Email not registered
                const finalUser = new Users(user);

                finalUser.setPassword(user.password);

                return finalUser.save()
                    .then(() => res.json({ user: finalUser.toAuthJSON() }));
            }

            res.status(409).json({
                errors: {
                    email: 'already exists'
                }
            });
        });
});

//POST login route (optional, everyone has access)
router.post('/login', auth.optional, (req, res, next) => {
    const { body: { user } } = req;

    if (!user.email) {
        return res.status(422).json({
            errors: {
                email: 'is required',
            },
        });
    }

    if (!user.password) {
        return res.status(422).json({
            errors: {
                password: 'is required',
            },
        });
    }

    return passport.authenticate('local', { session: false }, (err, passportUser, info) => {

        console.log('from users.js:', err, passportUser, info);
        if (err) {
            return next(err);
        }

        if (passportUser) {
            const user = passportUser;
            // user.token = passportUser.generateJWT();

            return res.json({ user: user.toAuthJSON() });
        }

        return res.status(400).send(info);
    })(req, res, next);
});

//GET current route (required, only authenticated users have access)
router.get('/current', auth.required, (req, res, next) => {
    const { payload: { id } } = req;

    return Users.findById(id)
        .then((user) => {
            if (!user) {
                return res.sendStatus(400);
            }

            return res.json({ user: user.toAuthJSON() });
        });
});

module.exports = router;