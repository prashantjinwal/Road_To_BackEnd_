import express from "express";
import cros from "cors"
import cookieParser from "cookie-parser";


const app = express();

app.use(cros({
    origin: process.env.CROS_ORIGIN,
    Credential: true
}))

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser())



// import routers
import userRouter from "./routes/user.routes.js"

//routes declaration 
app.use("/user", userRouter)
















export { app }