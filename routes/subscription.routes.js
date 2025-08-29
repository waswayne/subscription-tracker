import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import {
 
  cancelAllSubscriptions,
  createSubscription,
  deleteSubscription,
  getSubscription,
  getUserSubscriptions,
  updateSubscription,
} from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.get("/", authorize, getUserSubscriptions);
subscriptionRouter.get("/user/:id", authorize, getSubscription);
subscriptionRouter.post("/", authorize, createSubscription);
subscriptionRouter.put("/:id", authorize, updateSubscription);
subscriptionRouter.delete("/:id", authorize, deleteSubscription);
subscriptionRouter.put("/user/:id/cancel", authorize, cancelAllSubscriptions);
subscriptionRouter.get("/upcoming-renewal", authorize, getUserSubscriptions);

export default subscriptionRouter;
