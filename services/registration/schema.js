const { Schema } = require("mongoose");
const mongoose = require("mongoose");
const brcrypt = require("bcryptjs");
const v = require("validator");

const RegistrationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      validate: {
        validator: async (value) => {
          if (!v.isEmail(value)) {
            throw new Error("Email is invalid");
          }
        },
      },
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
    },

    role: {
      type: String,
      enum: ["user"],
      required: true,
    },
    age: {
      type: Number,
      min: [18, "You must be 18+"],

      validate(value) {
        if (value < 0) {
          throw new Error("Age must be a positive number!");
        }
      },
    },
    refreshTokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

RegistrationSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.__v;

  return userObject;
};

RegistrationSchema.statics.findByCredentials = async (email, password) => {
  const user = await RegistrationModel.findOne({ email });
  const isMatch = await brcrypt.compare(password, user.password);
  if (!isMatch) {
    const err = new Error("Unable to login");
    err.httpStatusCode = 401;
    throw err;
  }
  return user;
};

RegistrationSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

RegistrationSchema.post("validate", function (error, doc, next) {
  if (error) {
    error.httpStatusCode = 400;
    next(error);
  } else {
    next();
  }
});

RegistrationSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoError" && error.code === 11000) {
    error.httpStatusCode = 400;
    next(error);
  } else {
    next();
  }
});

const RegistrationModel = mongoose.model("User", RegistrationSchema);

module.exports = RegistrationModel;
