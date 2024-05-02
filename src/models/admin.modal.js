const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
      validate: {
        validator: function (value) {
          return /^[a-zA-Z0-9]+$/.test(value);
        },
        message: function (props) {
          return `${props.value} is not a valid username!`;
        },
      },
    },

    password: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (value) {
          return value.length >= 6;
        },
        message: function (props) {
          return "Password must be at least 6 characters long!";
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

/*
  adminSchema.pre("save", async function (next) {
  this lines means that before saving to the database this line exceuted first 
  const admin = this :means the current document admin have been saved 
  
   if (!admin.isModified("password"))
   if password has been modified then already then not hashing again 
   and move next 

*/

adminSchema.pre("save", async function (next) {
  const admin = this;
  if (!admin.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(admin.password, salt);
    return next();
  } catch (error) {
    return next(error);
  }
});
//return next();: After hashing the password, the function calls next() to proceed to the next middleware function in the middleware chain.


module.exports = mongoose.model("Admin", adminSchema);