import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getVideoLikes, toggleVideoLike } from "../controllers/likes.controller.js";

const router = Router()

router.use(verifyJWT)

router.route('/toggle/c/:videoId').post(toggleVideoLike)
router.route('/:videoId').get(getVideoLikes)

export default router