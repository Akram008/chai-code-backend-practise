import { Router } from "express";
import { getChannelSubs, getUserChannelSubscribers, toggleChannelSub } from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.use(verifyJWT)

router.route('/c/:channelId').get(getChannelSubs).post(toggleChannelSub)

router.route('/u/:subscriberId').get(getUserChannelSubscribers)

export default router