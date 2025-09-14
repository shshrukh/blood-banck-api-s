
import { Router } from "express";
import { registerUser, loginUser, logoutUser, currentUser } from "../controllers/user.controller.js";
import { outhMiddleware } from "../middleware/outh.middleware.js";




const router = Router();




router.route("/register").post(registerUser);

router.route("/login").post(loginUser);


//secured routes

router.route("/logout").post(outhMiddleware, logoutUser);

router.route("/current-user").get(outhMiddleware, currentUser);


export default router;