import { Tweet } from "../models/tweets.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async(req, res)=>{
    const {content} = req.body 

    const tweet = await Tweet.create({
        content, 
        owner: req.user?._id 
    })

    const createdTweet = await Tweet.findById(tweet._id)
    if (!createTweet) {
        throw new ApiError(400, 'Something went wrong while creating the tweet!')
    }

    return res
    .status(200)
    .json(new ApiResponse(200, createdTweet, 'New Tweet is created!'))
})

const getUserTweets = asyncHandler(async(req, res)=>{
    const {userId} = req.params 

    const tweets = await Tweet.find({owner: userId})
    
    if (!tweets) {
        throw new ApiError(400, 'Tweets are not there!')
    }

    return res
    .status(200)
    .json(new ApiResponse(200, tweets, 'All tweets by this user is fetched!'))
})

const updateTweet = asyncHandler(async(req, res)=>{
    const {tweetId} = req.params 
    const {content} = req.body
    const userId = req.user._id

    const tweet = await Tweet.findById(tweetId)

    if (tweet.owner.toString() !== userId.toString()) {
        throw new ApiError(403, 'You do not have permission to update this tweet!')
    }
    
    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId, 
        {
            $set: {
                content
            }
        }, 
        {new: true}
    )

    if (!updatedTweet) {
        throw new ApiError(400, 'Something went wrong while updating the tweet!')
    }

    return res
    .status(200)
    .json(new ApiResponse(200, updatedTweet, 'Tweet updated Successfully!'))
})

const deleteTweet = asyncHandler(async(req, res)=>{
    const {tweetId} = req.params 
    const userId = req.user._id 

    const tweet = await Tweet.findById(tweetId)

    if (tweet.owner.toString() !== userId.toString()) {
        throw new ApiError(403, 'You do not have permission to delete this tweet!')
    }

    await Tweet.findByIdAndDelete(tweetId)

    return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Tweet has been deleted successfully!'))
})

export {createTweet, getUserTweets, updateTweet, deleteTweet}