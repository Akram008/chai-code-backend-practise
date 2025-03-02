import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import {Subscription} from '../models/subscription.model.js'
import {ApiResponse} from "../utils/ApiResponse.js"
import {ApiError} from "../utils/ApiError.js"

const toggleChannelSub = asyncHandler(async(req, res)=>{
    const {channelId} = req.params 
    const userId = req.user._id 

    const subscription = await Subscription.findOne({subscriber: userId, channel: channelId})

    if (!subscription) {
        const newSubscription = await Subscription.create({
            subscriber: userId, 
            channel: channelId 
        })

        const createdSubscription = await Subscription.findById(newSubscription)

        if (!createdSubscription) {
            throw new ApiError(400, 'Something went wrong while creating subscription!')
        }

        return res
        .status(200)
        .json(new ApiResponse(200, createdSubscription, 'You subscribed this channel!'))
    }

    await Subscription.findByIdAndDelete(subscription._id)

    return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Unsubscribed the channel!'))
})

const getChannelSubs = asyncHandler(async(req, res)=>{
    const {channelId} = req.params 
    
    const subscriptions = await Subscription.aggregate([
        {
            $match: {'channel': new mongoose.Types.ObjectId(`${channelId}`)}
        }, 
        {
            $count: 'totalSubscribers'
        }
    ])

    return res
    .status(200)
    .json(new ApiResponse(200, subscriptions, 'Total subscribers of this channel are fetched!'))
})

const getUserChannelSubscribers = asyncHandler(async(req, res)=>{
    const {subscriberId} = req.params 

    const subscribedChannels = await Subscription.find({subscriber: subscriberId}).select('-subscriber').populate('channel')

    if (!subscribedChannels) {
        throw new ApiError(400, "Subscribers of this channel can't be fetched!" )
    }

    return res
    .status(200)
    .json(new ApiResponse(200, subscribedChannels, 'Subscribed channels fetched successfully!'))
})

export {toggleChannelSub, getChannelSubs, getUserChannelSubscribers}