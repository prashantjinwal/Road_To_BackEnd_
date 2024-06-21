


const asynchandler = (requestHandle) => {
    return (req, res, next) =>{
        Promise.resolve(requestHandle(req, res, next)).catch((err)=>next(err))
    }
}


export default asynchandler



// const asynchandler = (fn) => async (res, req, next) => {
//     try{
//         await fn(res, req, next)
//     }catch(error){
//         res.status(err.code || 500).json({
//             sucess: false,
//             message: err.message
//         })
//     }
// }