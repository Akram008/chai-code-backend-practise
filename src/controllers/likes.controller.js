import mongoose from "mongoose";
import { Likes } from "../models/likes.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async(req, res)=>{
    const {videoId} = req.params 

    const like = await Likes.findOne({video:videoId, likedBy: req.user._id})

    if (!like) {
        const newLike = await Likes.create({
            video: videoId, 
            likedBy: req.user?._id, 
        })
        const createdLike = await Likes.findById(newLike._id)

        return res
        .status(200)
        .json(new ApiResponse(200, createdLike, 'This video is Liked'))
    }
    else{
        const videoLike = await Likes.deleteOne({_id: like._id})

        if (!videoLike) {
            throw new ApiError(400, 'Something went wrong while disliking!')
        }

        return res
        .status(200)
        .json(new ApiResponse(200, {}, 'This video is disliked!'))
    }
   
})

const getVideoLikes = asyncHandler(async(req, res)=>{
    const {videoId} = req.params 

    const tLikes = await Likes.aggregate([
        {
            $match: {"video": new mongoose.Types.ObjectId(`${videoId}`)}
        },
        {
            $count: 'totalLikes'
        }
    ])

    return res
    .status(200)
    .json(new ApiResponse(200, tLikes, 'Total Likes on this video are fetched!'))
})

export {toggleVideoLike, getVideoLikes}