import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  imagePath: {
    type: String,
    required: true,
  },

  start: {
    type: String,
    required: true,
  },

  finish: {
    type: String,
    required: true,
  },

  finish_applications: {
    type: String,
    required: true,
  },

  directing: {
    type: String,
    required: true,
  },

  contact_name: {
    type: String,
    required: true,
  },

  contact_email: {
    type: String,
    required: true,
  },

  contact_work: {
    type: String,
    required: true,
  },

  place: {
    type: String,
    required: true,
  },

  admins: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  applications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  userApplications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

export default mongoose.model("Event", eventSchema);
