import {Router} from 'express'
import {verifyJWT} from '../middlewares/auth.middleware.js'
import { addVideoToPlaylist, createPlaylist, deletePlaylist, getPlaylist, getUserPlaylists, removeVideoFromPlaylist, updatePlaylist } from '../controllers/playlist.controller.js'

const router = Router()

router.use(verifyJWT)

router.route('/:playlistId')
.get(getPlaylist)
.patch(updatePlaylist)
.delete(deletePlaylist)

router.route('/').post(createPlaylist)
router.route('/add/:videoId/:playlistId').patch(addVideoToPlaylist)
router.route('/remove/:videoId/:playlistId').patch(removeVideoFromPlaylist)
router.route('/user/:userId').get(getUserPlaylists)

export default router