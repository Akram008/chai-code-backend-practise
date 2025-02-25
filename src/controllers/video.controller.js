import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const uploadVideo = asyncHandler(async(req, res)=>{
    //video details from req.body 
    //check all the details 
    //upload the video, thumbnail on clodinary
    //get the user detail for owner field 
    //save in the db of video model 
    //return res
    
    const {title, description} = req.body

    if([title, description].some((field)=> field?.trim === '')){
        throw new ApiError(400, 'All fields are required!')
    }

    const videoLocalPath = req.files?.videoFile[0]?.path 
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path

    if(!videoLocalPath){
        throw new ApiError(400, 'Video Path is required')
    }
    if(!thumbnailLocalPath){
        throw new ApiError(400, 'Thumbnail Path is required')
    }

    const videoFile = await uploadOnCloudinary(videoLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    const currentUser = await User.findById(req.user?._id)

    const video = await Video.create({
        videoFile: videoFile.url, 
        thumbnail: thumbnail.url, 
        title,
        description, 
        owner: currentUser
    })

    const createdVideo = await Video.findById(video._id) 

    if(!createdVideo){
        throw new ApiError(400, 'video is not found')
    }

    return res
    .status(201)
    .json(
        new ApiResponse(200, createdVideo, 'Video is successfully Uploaded!')
    )

})

const getVideo = asyncHandler(async(req, res)=>{
    //get videoId from req.params 
    //find it by id in video db 
    //increase its view by 1 
    //return res 

    const {videoId} = req.params 

    console.log(req.query)

    const video = await Video.findById(videoId).populate('owner')

    if (!video) {
        throw new ApiError(400, 'video not found!!')
    }

    video.views += 1 
    await video.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, {video}, 'Accessed Video Successfully!'))
})

const updateVideo = asyncHandler(async(req, res)=>{
    
    const {videoId} = req.params 
    const {newTitle, newDescription} = req.body 
    
    const video = await Video.findByIdAndUpdate(
        videoId, 
        {
            $set: {
                title: newTitle, 
                description: newDescription , 
            }
        }, 
        {new: true}
    )
    return res
    .status(200)
    .json(new ApiResponse(200, video, 'Video details updated successfully!'))
})

const updateVideoThumbnail = asyncHandler(async(req, res)=>{
    const {videoId} = req.params

    const thumbnailLocalPath = await req.file?.path 
    
    if (!thumbnailLocalPath) {
        throw new ApiError(400, 'No thumbnail path exists!')
    }
    
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if (!thumbnail) {
        throw new ApiError(400, 'No thumbnail is there on cloudinary')
    }

    const video = await Video.findByIdAndUpdate(
        videoId, 
        {
            $set:{
                thumbnail: thumbnail.url
            }
        }, 
        {new: true}
    )

    return res
    .status(200)
    .json(new ApiResponse(200, video, 'Thumbnail Updated!'))
})

const deleteVideo = asyncHandler(async(req, res)=>{
    const {videoId} = req.params 

    const video = await Video.findByIdAndDelete(videoId)

    return res
    .status(200)
    .json(new ApiResponse(200, video, 'Video successfully Deleted!'))
})


export {uploadVideo,
        getVideo,
        updateVideo, 
        updateVideoThumbnail,
        deleteVideo
    }