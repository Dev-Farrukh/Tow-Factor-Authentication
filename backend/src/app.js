import express from "express"
import cookieParser from "cookie-parser"
import dbConfig from "./config/db.config.js"
import authRoutes from "./routes/auth.routes.js"
import cors from "cors"
import envVariables from "./config/env.config.js"

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    credentials : true ,
    origin : envVariables.FORNTEND_URL
}))
dbConfig()

app.use("/api/auth", authRoutes)

app.get("/", (req, res) => {
    res.send("Server is running !")
})

export default app