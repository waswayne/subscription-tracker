import Subscription from "../models/subscription.model.js";
import User from "../models/user.model.js";
import mongoose, { Error } from "mongoose";
import bcrypt from "bcryptjs";

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};


export const deactivateUser = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { password } = req.body;

    // Validation (same as before)
    if (!password) {
      const error = new Error('Password confirmation required');
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findById(id).select('+password');
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    if (req.user.id.toString() !== id) {
      const error = new Error("Not authorized to deactivate this account");
      error.statusCode = 403;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const error = new Error("Invalid password confirmation");
      error.statusCode = 401;
      throw error;
    }

    // SOFT DELETE: Deactivate user and subscriptions
    await User.findByIdAndUpdate(
      id,
      { 
        isActive: false, 
        deactivatedAt: new Date(),
        markedForDeletion: false // Reset if previously set
      },
      { session }
    );

    await Subscription.updateMany(
      { user: id },
      { status: "inactive" },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Account deactivated successfully. You can reactivate within 30 days."
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const deleteUserPermanently = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { password, confirmation } = req.body;

    // STRICT validation for permanent deletion
    if (!password) {
      const error = new Error('Password confirmation required');
      error.statusCode = 400;
      throw error;
    }

    if (!confirmation || confirmation !== "DELETE MY ACCOUNT PERMANENTLY") {
      const error = new Error('Please type "DELETE MY ACCOUNT PERMANENTLY" to confirm');
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findById(id).select('+password');
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    if (req.user.id.toString() !== id) {
      const error = new Error("Not authorized to delete this account");
      error.statusCode = 403;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const error = new Error("Invalid password confirmation");
      error.statusCode = 401;
      throw error;
    }

    // HARD DELETE: Permanently remove everything
    await Subscription.deleteMany({ user: id }, { session });
    await User.findByIdAndDelete(id, { session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Account and all associated data permanently deleted"
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const reactivateUser = async (req,res,next) => {
  try {
    const {id} = req.params

    const user = await User.findById(id)
    if(!user) {
      return res.status(404).json({error: 'User not found'})
    }
//if deactivated within 3o days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    if(user.deactivatedAt && user.deactivatedAt < thirtyDaysAgo) {
     return res.status(400).json({
      error: 'Reactivation period expired. Account permanently deleted'})
    }

    //re-activate user and subscription
    await User.findByIdAndUpdate(id, 
      {isActive: true,
        deactivatedAt: null
      })

      await Subscription.updateMany(
        {user: id},
        {status: "active"}
      )

      res.json({
        success: true,
        message: 'Account reactivated successfully'
      })

  } catch (error) {
    next(error)
  }
}