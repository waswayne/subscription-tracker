import Subscription from "../models/subscription.model.js";
import { workflowClient } from "../config/upstash.js";
import { SERVER_URL } from "../config/env.js";

export const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id,
    });

    const { workflowRunId } = await workflowClient.trigger({
      url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
      body: {
        subscriptionsId: subscription.id,
      },
      headers: {
        "content-type": "application/json",
      },
      retries: 0,
    });

    res
      .status(201)
      .json({ success: true, data: { subscription, workflowRunId } });
  } catch (error) {
    next(error);
  }
};

export const getSubscription = async (req, res, next) => {
  try {
    if (req.user._id.toString() !== req.params.id) {
      const error = new Error("You are not the owner of this account");
      error.statusCode = 403;
      throw error;
    }

    const subscriptions = await Subscription.find({
      user: req.params.id,
    }).populate("user", "name email");

    res.status(200).json({
      success: true,
      count: subscriptions.length,
      data: subscriptions,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserSubscriptions = async (req, res, next) => {
  try {
    const userId = req.user._id;

    //find only this user's subscriptions
    const subscriptions = await Subscription.find({ user: userId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    //return the subscriptions
    res.status(200).json({
      success: true,
      count: subscriptions.length,
      data: subscriptions,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSubscription = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const subscription = await Subscription.findById(id);
    if (!subscription) {
      const error = new Error("Subscription not found");
      error.statusCode = 404;
      throw error;
    }

    if (subscription.user.toString() !== req.user._id.toString()) {
      const error = new Error("Not authorized to update this subscription");
      error.statusCode = 403;
      throw error;
    }

    const allowedUpdates = [
      "name",
      "price",
      "currency",
      "category",
      "paymentMethod",
      "status",
      "frequency",
    ];
    const attemptedUpdates = Object.keys(updates);

    const isValidOperation = attemptedUpdates.every((field) =>
      allowedUpdates.includes(field)
    );
    if (!isValidOperation) {
      const error = new Error("Attempted to update restricted field");
      error.statusCode = 400;
      throw error;
    }

    const updatedSubscription = await Subscription.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).populate("user", "name email");

    res.status(200).json({
      success: true,
      message: "Subscription updated successfully",
      data: updatedSubscription,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSubscription = async (req, res, next) => {
  try {
    const { id } = req.params;

    const subscription = await Subscription.findById(id);
    if (!subscription) {
      const error = new Error("Subscription not found");
      error.statusCode = 404;
      throw error;
    }

    if (subscription.user.toString() !== req.user._id.toString()) {
      const error = new Error("Not authorized to delete this subscription");
      error.statusCode = 403;
      throw error;
    }

    await Subscription.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Subscription successfully deleted",
      data: {
        deletedSubscriptionId: id,
        deletedSubscriptionName: subscription.name,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const cancelAllSubscriptions = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user._id.toString() !== id) {
      const error = new Error(
        "Not authorized to cancel another user's subscriptions"
      );
      error.statusCode = 403;
      throw error;
    }

    const activeSubscriptions = await Subscription.find({
      user: id,
      status: "active",
    });

    if (activeSubscriptions.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No active subscriptions found to cancel",
        data: { cancelledCount: 0 },
      });
    }

    const result = await Subscription.updateMany(
      { user: id, status: "active" },
      { status: "inactive", cancelledAt: new Date() }
    );

    const cancelledSubscriptions = await Subscription.find({
      user: id,
      status: "inactive",
    }).select("name price frequency");

    res.status(200).json({
      success: true,
      message: `Successfully cancelled ${result.modifiedCount} subscription(s)`,
      data: {
        cancelledCount: result.modifiedCount,
        subscriptions: cancelledSubscriptions,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUpcomingRenewals = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const today = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(today.getDate() + 7);

    const upcomingRenewals = await Subscription.find({
      user: userId,
      status: "active",
      renewDate: {
        $gte: today,
        $lte: sevenDaysFromNow,
      },
    })
      .populate("user", "name email")
      .sort({ renewDate: 1 });

    const renewalsWithDaysLeft = upcomingRenewals.map((subscription) => {
      const renewDate = new Date(subscription.renewDate);
      const timeDiff = renewDate - today;
      const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // FIXED: math

      return {
        ...subscription.toObject(),
        daysUntilRenewal: daysLeft,
      };
    });

    const groupedRenewals = {};
    renewalsWithDaysLeft.forEach((renewal) => {
      const daysKey = `in_${renewal.daysUntilRenewal}_days`;
      if (!groupedRenewals[daysKey]) {
        groupedRenewals[daysKey] = [];
      }
      groupedRenewals[daysKey].push(renewal);
    });

    res.status(200).json({
      success: true,
      message: `Found ${upcomingRenewals.length} upcoming renewal(s)`,
      data: {
        totalUpcoming: upcomingRenewals.length,
        renewals: groupedRenewals,
        dateRange: {
          start: today.toISOString().split("T")[0],
          end: sevenDaysFromNow.toISOString().split("T")[0],
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
