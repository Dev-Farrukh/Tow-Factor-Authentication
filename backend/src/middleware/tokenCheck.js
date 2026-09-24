import jwt from "jsonwebtoken"
import envVariables from "../config/env.config.js"
import userModel from "../model/user.schema.js"

const tokenValid = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) return res.status(400).json({ message: "Token not found" })

    try {
        const decoded = jwt.verify(token, envVariables.TOKEN_SECRET)
        const user =await userModel.findById(decoded.id)
        if (!user) return res.status(400).json({ message: "Invalid Token" })
        req.user = user
        next()
    } catch (error) {
        return res.status(401).json({ error: error.message })
    }
}

export default tokenValid