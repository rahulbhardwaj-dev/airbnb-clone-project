const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose'); // for authentication

const userSchema = new Schema({ // username and password option passport-local-mongoose khud add kr deta h
    email: {
        type: String,
        required: true
    }
})

userSchema.plugin(passportLocalMongoose);

module.exports  = mongoose.model("User",userSchema);
