import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addComment, deleteComment, getAllComments, updateComment } from "../controllers/comment.controller.js";

const router = Router()

router.route('/:videoId').get(verifyJWT, getAllComments).post(verifyJWT, addComment)
router.route('/c/:commentId').patch(verifyJWT, updateComment).delete(verifyJWT, deleteComment)

export default router