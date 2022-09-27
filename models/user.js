const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      validate: [ validator.isEmail, "Email is invalid" ]
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      minLength: [ 8, "Name must have more or equal than 8 character"],
      maxLength: [ 64, "Name must have less or equal than 64 character"]
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [ 8, "Password must have more or equal than 8 character"],
      maxLength: [64, "Password must have less or equal than 64 character"],
      select: false
    },
    confirmPassword: {
      type: String,
      required: [true, "Confirm password is required"],
      minLength: [ 8, "Confirm password must have more or equal than 8 character"],
      maxLength: [64, "Confirm password must have less or equal than 64 character"],
      validate: {
        // This is only work on Create or Save
        validator: function (el) {
          return el === this.password;
        },
        message: "Password is not equal confirm password"
      },
      select: false
    }
  }
);

userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete confirmPassword
  this.confirmPassword = undefined;

  next();
})

module.exports = mongoose.model('User', userSchema);