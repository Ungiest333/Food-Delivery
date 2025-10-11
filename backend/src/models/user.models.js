const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true }, 
    phone: { type: String, required: true },
    password: { type: String },
    confirmPassword: { type: String }
}, { timestamps: true });

const User = mongoose.model("User", userSchema); // <-- Capital U
module.exports = User;
