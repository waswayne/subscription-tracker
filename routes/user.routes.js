import { Router } from "express";
import {
  deactivateUser,
  deleteUserPermanently,
  getUser,
  getUsers,
  reactivateUser,
} from "../controllers/user.controller.js";
import authorize from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.get("/", getUsers);
userRouter.get("/:id", authorize, getUser);
userRouter.patch("/:id/deactivate", authorize, deactivateUser);
userRouter.post("/", (req, res) => res.send({ title: "CREATE new users" }));
userRouter.delete("/:id", authorize, deleteUserPermanently);
userRouter.patch('/:id/reactivate', reactivateUser)

export default userRouter;
