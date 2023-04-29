import {Router} from "express";
import AuthController from "../controllers/auth.controller";
import auth from "../middleware/auth";

const router = Router();

router.post("/signup", AuthController.register);
router.post("/signin", AuthController.login);
router.get("/getall", auth, AuthController.getAllUsers);
router.get("/user", auth, AuthController.getUserData);
router.post("/updateselectedcharacter", auth, AuthController.updateSelectedCharacter);

export default router;

