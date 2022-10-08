// crypto
// It is one of modules of NodeJS
// It provides a way of handling encrypted data
const crypto = require('crypto');
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
    },
    role: {
      type: String,
      enum: {
        values: ["admin", "editor", "viewer"],
        message: "Role is invlide"
      },
      default: "viewer"
    },
    createdDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    passwordUpdatedDate: {
      type: Date
    },
    passwordResetToken: {
      type: String,
      required: false
    },
    passwordResetExpiresdDate: {
      type: Date,
      required: false
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
      select: false
    }
  }
);

userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordUpdatedDate = Date.now();

  // Delete confirmPassword
  this.confirmPassword = undefined;

  next();
});

// Forbid unactive user to log in
// Both of find or findAndUpdate can run into
userSchema.pre(/^find/, function (next) {
  this.find({ isActive: true });
  next();
});

userSchema.method('isPasswordRight', async function (inputtedPassword, savedPassword) {
  return await bcrypt.compare(inputtedPassword, savedPassword);
})

userSchema.method('isPasswordChangedAfterLogin', function (loginTime) {
  return +(new Date(this.passwordUpdatedDate).getTime() / 1000) > loginTime;
});

userSchema.method('createPasswordResetToken', function () {
  // Generate 32 bytess and output to string(origin string)
  const resetToken = crypto.randomBytes(8).toString('hex');

  // Encrype restToken(encrypted string)
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpiresdDate = Date.now() + 10 * 60 * 1000;

  return resetToken;
});

module.exports = mongoose.model('User', userSchema);