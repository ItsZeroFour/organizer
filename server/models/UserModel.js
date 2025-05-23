import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
    minlength: 8,
  },

  group: {
    type: String,
    default: "",
  },

  phone: {
    type: String,
    default: "",
  },

  birthdate: {
    type: String,
    default: "",
  },

  role: {
    type: "String",
    required: true,
    default: "Студент",
    enum: [
      "Студент",
      "Руководитель в.о.",
      "зам. директора",
      "Администратор",
    ],
  },

  directing: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Directing",
    },
  ],

  events: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],

  applications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
  ],
});

export default mongoose.model("User", userSchema);
