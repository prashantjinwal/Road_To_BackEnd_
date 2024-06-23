import asynchandler from "../util/asyncHandler.js";
import ApiError from "../util/ApiError.js"
import jwt  from "jsonwebtoken";
import User from "../models/user.model.js"


export const verifyJWT = asynchandler(async(req, res, next) =>{
    const token = req.cookie?.accessToken || req.header("Authorization")?.replace("Bearer", "")

    if (!token) {
        throw new ApiError(401, "Unauthorized request !!")
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)


})