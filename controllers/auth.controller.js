import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";

export const signUp = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) {
      const error = new Error("User already exists");
      error.statusCode = 409;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // create new user
    const newUser = await User.create(
      [
        {
          name,
          email,
          password: hashedPassword,
        },
      ],
      { session }
    );

    const user = newUser[0];

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    await session.commitTransaction();
    session.endSession();

    const userData = user.toObject();
    delete userData.password;

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        token,
        user: userData,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      const error = new Error("invalid password");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
    res.status(200).json({
      success: true,
      message: "user signed in succesfully",
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    console.log(
      `User ${req.user._id} signed out at ${new Date().toISOString()}`
    );

    res.status(200).json({
      success: true,
      message:
        "Signed out successfully. Please remove the token from your client",
      action_required: "Remove the JWT token from client storage",
      note: "token remains valid until natural expiration due ti JWT stateless nature",
    });
  } catch (error) {
    next(error);
  }
};
