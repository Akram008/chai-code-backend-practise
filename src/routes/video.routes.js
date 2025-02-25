import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { deleteVideo, getVideo, updateVideo, updateVideoThumbnail, uploadVideo } from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route('/upload-video').post(verifyJWT,
    upload.fields([
        {
            name: 'videoFile', 
            maxCount: 1
        }, 
        {
            name: 'thumbnail', 
            maxCount: 1
        }
    ]), uploadVideo
)

router.route('/:videoId').get(getVideo).patch(verifyJWT, updateVideo)
router.route('/thumbnail/:videoId').patch(verifyJWT, upload.single('thumbnail') ,updateVideoThumbnail)
router.route('/:videoId/delete').delete(verifyJWT, deleteVideo)

export default router