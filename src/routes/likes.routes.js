import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getVideoLikes, toggleCommentLike, toggleVideoLike } from "../controllers/likes.controller.js";

const router = Router()

router.use(verifyJWT)

router.route('/toggle/video/:videoId').post(toggleVideoLike)
router.route('/toggle/comment/:commentId').post(toggleCommentLike)
router.route('/:videoId').get(getVideoLikes)

export default router