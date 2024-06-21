import asynchandler from "../util/asyncHandler.js"

const resgisterUser = asynchandler( async (req, res) => {
   return res.status(200).json({
        message: "ok"
    })
})


export {resgisterUser}