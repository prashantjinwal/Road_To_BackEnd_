import mongoose, { Schema } from "mongoose";

const VideoSchema =  new mongoose.Schema(
    {
        video:{
            type:String,       // cloudnary url
            required:true
        },

        thumbnail:{
            type:String,       // cloudnary url
            required:true
        },

        title:{
            type:String,       
            required:true
        },

        description:{
            type:String,       
            required:true
        },

        duration:{
            type:Number,       
            required:true
        },
        views:{
            type:Number,       
            default:0
        },
        ispublished:{
            type:Boolean,
            default:true
        },
        ower:{
            type:Schema.Types.ObjectId,
            ref:"User"
        }


    },{
        timestamps:true
    })


export const Video = mongoose.model("Video", VideoSchema)