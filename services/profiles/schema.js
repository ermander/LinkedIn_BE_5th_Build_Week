const { Schema, model } = require("mongoose");

const ProfilesSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
    },
    area: {
      type: String,
      require: true,
    },
    image: {
      type: Buffer,
    },
    socketID: {
      type: String,
      required: false
    },
    isOnline: {
      type: Boolean
    },
    email: {
      type: String
    }
  },
  { timestamps: true }
);

const ProfilesModel = model("Profiles", ProfilesSchema);
module.exports = ProfilesModel;
