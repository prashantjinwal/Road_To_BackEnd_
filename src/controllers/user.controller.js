import asynchandler from "../util/asyncHandler"

const resgisterUser = asynchandler( async (req, res) => {
    res.status(200).json({
        message: "ok"
    })
})