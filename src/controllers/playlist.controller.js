import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import {Playlist} from '../models/playlists.model.js'
import {ApiResponse} from "../utils/ApiResponse.js"
import {ApiError} from "../utils/ApiError.js"

const createPlaylist = asyncHandler(async(req, res)=>{
    const {name, description} = req.body 
    const userId = req.user._id 

    const playlist = await Playlist.create({
        name, 
        description, 
        owner: userId
    })

    const createdPlaylist = await Playlist.findById(playlist._id)

    if (!createdPlaylist) {
        throw new ApiError(400, 'Something went wrong while creating the playlist')
    }

    return res
    .status(200)
    .json(new ApiResponse(200, createdPlaylist, 'New playlist has been created'))
})

const addVideoToPlaylist = asyncHandler(async(req, res)=>{
    const {playlistId, videoId} = req.params 
    const userId = req.user._id

    const playlist = await Playlist.findById(playlistId)

    if (playlist.owner.toString() !== userId.toString()) {
        throw new ApiError(403, 'You are not permitted to change this playlist!')
    }
    if (playlist.videos.includes(videoId)) {
        throw new ApiError(409, 'This video already exists!')
    }
    playlist.videos.push(videoId)

    await playlist.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, playlist, 'Video is added to the playlist!'))
})

const removeVideoFromPlaylist = asyncHandler(async(req, res)=>{
    const {videoId, playlistId} = req.params 
    const userId = req.user._id 

    const playlist = await Playlist.findById(playlistId)
    if(playlist.owner.toString() !== userId.toString()){
        throw new ApiError(403, 'You are not permitted to remove this video from playlist')
    }
    const newPlaylistVideos = await playlist.videos.filter(each=>each.toString() !== videoId)
    if (playlist.videos.length === newPlaylistVideos.length) {
        throw new ApiError(404, 'Video not found in the playlist!')
    }
    playlist.videos = newPlaylistVideos 
    await playlist.save({validateBeforeSave: false}) 

    return res
    .status(200)
    .json(new ApiResponse(200, playlist, 'Video has been deleted from playlist!!'))
})

const getPlaylist = asyncHandler(async(req, res)=>{
    const {playlistId} = req.params 

    const playlist = await Playlist.findById(playlistId).populate('videos')

    if (!playlist) {
        throw new ApiError(404, 'Playlist not found')
    }

    return res
    .status(200)
    .json(new ApiResponse(200, playlist, 'Playlist fetched!'))
})

const updatePlaylist = asyncHandler(async(req, res)=>{
    const {playlistId} = req.params 
    const {name, description} = req.body 
    const userId = req.user._id 

    const plForAuth = await Playlist.findById(playlistId)

    if (plForAuth.owner.toString()!== userId.toString()) {
        throw new ApiError(403, 'You are not permitted to change this playlist!')
    }

    const playlist = await Playlist.findByIdAndUpdate(
        playlistId, 
        {
            name, 
            description
        },
        {new: true}
    )

    const updatedPlaylist = await Playlist.findById(playlist._id)

    if (!updatedPlaylist) {
        throw new ApiError(400, 'Something went wrong while updating the playlist!')
    }

    return res
    .status(200)
    .json(new ApiResponse(200, updatedPlaylist, 'Playlist Updated Successfully!'))
})

const deletePlaylist = asyncHandler(async(req, res)=>{
    const {playlistId} = req.params 
    const userId = req.user._id 

    const plForAuth = await Playlist.findById(playlistId)

    if (!plForAuth) {
        throw new ApiError(404, 'This playlist does not exists!')
    }

    if (plForAuth.owner.toString()!==userId.toString()) {
        throw new ApiError(400, 'You are not permitted to delete this playlist!')
    }

    const playlist = await Playlist.findByIdAndDelete(playlistId)

    if (!playlist) {
        throw new ApiError(400, 'Something went wrong while deleting this playlist!')
    }

    return res
    .status(200)
    .json(new ApiResponse(200, playlist, 'This playlist is deleted!'))
})

const getUserPlaylists = asyncHandler(async(req, res)=>{
    const {userId} = req.params 

    const playlists = await Playlist.aggregate([
        {
            $match:{"owner": new mongoose.Types.ObjectId(`${userId}`)}
        }, 
        {
            $project:{
                name: 1, 
                description: 1
            }
        }
    ])

    if (playlists.length===0) {
        throw new ApiError(404, 'No playlists are there for this user!')      
    }

    return res
    .status(200)
    .json(new ApiResponse(200, playlists, 'All playlists of this user are fetched!'))
})

export {
    createPlaylist, 
    addVideoToPlaylist, 
    removeVideoFromPlaylist, 
    getPlaylist, 
    updatePlaylist, 
    deletePlaylist, 
    getUserPlaylists
}