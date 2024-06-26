import { Router } from "express";
import { resgisterUser } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router()

router.route("/register").post( upload.fields([
    {
        name:"avatar",
        maxCount: 1
    },
    {
        name: "coverImage",
        maxCount: 1
    }
]) ,resgisterUser)



export default router