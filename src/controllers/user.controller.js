import asynchandler from "../util/asyncHandler.js"
import ApiError from "../util/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOncloudinary} from "../util/cloudinary.js"
import { ApiResponse } from "../util/ApiResponse.js"


const generateAccessAndRefreshToken = async(userId) =>{
    try {
        
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        // user.accessToken = accessToken

        user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "something went wrong while generating Access and Refresh Tokens")
    }
}

const resgisterUser = asynchandler( async (req, res) => {
    
// get user details from frontend 
// validation -not empty 
// check if user already exists: username, email
// check for images, check for avatar
// upload them to cloudinary, avatar
// create user object - create entry in db
// remove password and refresh token field from response 
// check for user creation
// return res

    const {fullName, email, password, username} = req.body
    console.log("email:", email)
    if(
        [fullName, email, password, username].some((field) => field?.trim() === "" )
    ){
        throw new ApiError(400, "All fields are required")
    }
    // if(!email.include("@")){
    //     throw new ApiError(401, "Email must be contains @" )
    // }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if(existedUser){
        throw new ApiError(409, "user with this email and username already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path
    // const coverImageLocalPath = req.files?.coverImage[0]?.path

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0 ){
        coverImageLocalPath = req.files.coverImage[0].path 
    }


    console.log(req.files)

    if(!avatarLocalPath){
        throw new ApiError(400, "avatar file is required")
    }

    const avatar = await uploadOncloudinary(avatarLocalPath)
    const coverImage = await uploadOncloudinary(coverImageLocalPath)


    if(!avatar){
        throw new ApiError(400, "avatar file is required")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "Something went wrong")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully ")
    )
})


const loginUser = asynchandler(async (req, res) => {
    // req body -> data
    const {email, username, password} = req.body

    if(!username || !email ){
        throw new ApiError(400, "username or password is required")
    }

    // ---- username or email ----

    const user = await User.findOne({
        $or: [{email}, {username}]
    })

    // ---- find the user ----

    if(!user){
        throw new ApiError(404, "User does not exist")
    }

    // ---- password check ----
    
    const ispasswordValid = await user.isPasswordCorrect(password)
     
    if(!ispasswordValid){
        throw new ApiError(401, "user password is incorrect")
    }

    // ---- access and refresh token ----

    const {refreshToken, accessToken} =  await generateAccessAndRefreshToken(user._id)

       // Optional step 
        const loggedInUser = await User.findById(user._id).select("-password -refreshToken") 

    // ---- send cookies ----

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(

        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User Logged In successfully"
        )
    )

})


export {resgisterUser}