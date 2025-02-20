import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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

export {uploadVideo}