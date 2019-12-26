const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { Schema } = mongoose;

const UsersSchema = new Schema({
    email: String,
    passwordHash: String,
    google: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    microsoft: {
        id: String,
        token: String,
        email: String,
        name: String,
    },
});

// methods ======================
// generating a hash
UsersSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

UsersSchema.methods.setPassword = function(password) {
    this.passwordHash = this.generateHash(password);
}

// checking if password is valid
UsersSchema.methods.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.passwordHash);
};

// Generate JWT
UsersSchema.methods.generateJWT = function () {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    return jwt.sign({
        email: this.email,
        id: this._id,
        exp: parseInt(expirationDate.getTime() / 1000, 10),
    }, 'secret');
}

// Make Auth JSON
UsersSchema.methods.toAuthJSON = function () {
    return {
        _id: this._id,
        email: this.email,
        token: this.generateJWT(),
    };
};

// create the model for users and expose it to our app
module.exports = mongoose.model('Users', UsersSchema);
