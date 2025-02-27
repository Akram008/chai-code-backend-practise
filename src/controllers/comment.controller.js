import { Comment } from "../models/comments.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getAllComments = asyncHandler(async(req, res)=>{
    const {videoId} = req.params 
    const {page=1, limit=10} = req.query 

    const comments = await Comment.find({video: videoId}).populate('owner').select('-password -refreshToken').limit(limit)

    return res
    .status(200)
    .json(
        new ApiResponse(200, comments, 'All comments on this video is fetched!')
    )
})

const addComment = asyncHandler(async(req, res)=>{
    const {videoId} = req.params 
    const {content} = req.body 

    if (!content) {
        throw new ApiError(400, 'content is empty!')
    }
    const owner = await User.findById(req.user?._id)

    const comment = await Comment.create({
        content, 
        video: videoId, 
        owner
    })

    const createdComment = await Comment.findById(comment._id)
    
    if (!createdComment) {
        throw new ApiError(400, 'Something went wrong while adding the comment!')
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, createdComment, 'Comment is added to this video!')
    )
})

const updateComment = asyncHandler(async(req, res)=>{
    const {commentId} = req.params 
    const {content} = req.body 

    const comment = await Comment.findById(commentId)

    if (!comment) {
        throw new ApiError(400, 'comment not found!')
    }

    comment.content = content 

    await comment.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, comment, 'Comment Updated!'))
})

const deleteComment = asyncHandler(async(req, res)=>{
    const {commentId} = req.params 

    const comment = await Comment.findByIdAndDelete(commentId) 

    if (!comment) {
        throw new ApiError(400, 'Something went wrong while deleting the comment!')
    }

    return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Comment deleted successfully!'))
})

export {getAllComments, addComment, updateComment, deleteComment}