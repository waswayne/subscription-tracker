import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minLength: 5,
      maxLength: 20,
    },
    email: {
      type: String,
      required: [true, "user email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/, "Please fill a valid email"],
    },

    password: {
      type: String,
      required: [true, "User password is required"],
      minLength: 8,
    },

    isActive: {
      type: Boolean,
      default: true
    }, 

    deactivatedAt: {
      type: Date,
      default: null
    },

    markedForDeletion: {
      type: Boolean,
      default: false
    },

    deletionScheduledAt: {
      type: Date,
      default: null
    }
  },
  
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
