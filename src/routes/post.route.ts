import { Router } from "express";
import PostController from "../controllers/post.controller";
import auth from "../middleware/auth";

const router = Router();

router.get("/getall", auth, PostController.getAllPosts);
router.get("/getbyuser",  PostController.getPostByUser);
router.post("/addnew",auth, PostController.addNewPost);

export default router;

