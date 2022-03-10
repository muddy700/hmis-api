const mongoose = require("mongoose");
const addressSchema = require("./AddressSchema");
const bcrypt = require("bcryptjs");
const saltRound = 10;

const userSchema = mongoose.Schema(
  {
    first_name: String,
    last_name: String,
    full_name: String,
    dob: Date,
    date_created: { type: Date, default: Date.now },
    username: { type: String, required: true, unique: true },
    email: String,
    phone: String,
    gender: String,
    token: String,
    profile_image: String,
    status: Boolean,
    password: { type: String, required: true, minlength: 8 },
    role: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
    address: { type: addressSchema },
  },
  { versionKey: false }
);

//Check if we need to modify full_name
userSchema.pre("save", function (next) {
  const user = this;

  if (this.isModified("first_name") || this.isModified("last_name")) {
    user.full_name = user.first_name + " " + user.last_name;
    next();
  } else next();
});

//Check if we need to encrypt passwords
userSchema.pre("save", function (next) {
  const user = this;

  if (this.isModified("password") || this.isNew) {
    //Generate Salt
    bcrypt.genSalt(saltRound, function (saltError, salt) {
      if (saltError) {
        return next(saltError);
      } else {
        //Encrypt Password
        bcrypt.hash(user.password, salt, function (hashError, hash) {
          if (hashError) {
            return next(hashError);
          } else {
            user.password = hash;
            next();
          }
        });
      }
    });

    //modify full_name if it's new user
    if (this.isNew) user.full_name = user.first_name + " " + user.last_name;
  } else next();
});

//Function to compare passwords
userSchema.methods.comparePasswords = function (password, callback) {
  bcrypt.compare(password, this.password, function (error, isMatch) {
    if (error) return callback(error);
    else callback(null, isMatch);
  });
};

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
