import { v2 as cloudinary } from "cloudinary";
import fs from 'fs'


const cloudinary = require('cloudinary');

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const uploadOncloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) { return null }
        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successful
        console.log("file uploaded on cloudinary", response.url) 
        return response
    }
    catch(error){
        fs.unlinkSync(localFilePath)           // remove from local server 
        return null
    }
}

export {uploadOncloudinary}