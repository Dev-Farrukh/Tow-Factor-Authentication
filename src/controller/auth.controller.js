import jwt from "jsonwebtoken"
import userModel from "../model/user.model.js"
import config from "../config/config.js"
import bcrypt from "bcrypt"
import mongoose from "mongoose"
import sessionModel from "../model/session.model.js"
import otpModel from "../model/otp.model.js"
import { generateOtp, generateOtpHtml } from "../utils/otp.utils.js"
import { sendEmail } from "../services/email.service.js"

export const register = async (req, res) => {
    const { userName, email, password } = req.body

    if (!userName || !email || !password) {
        return res.status(400).json({
            "message": "Required fields are missing"
        })
    }

    const userExist = await userModel.findOne({
        $or: [{ userName }, { email }]
    })

    if (userExist) {
        return res.status(400).json({
            "message": "User with this email already exist"
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otpCode = generateOtp()
    const hashedOtp = await bcrypt.hash(otpCode, 10);
    const html = generateOtpHtml(otpCode)

    const user = await userModel.create({
        userName,
        email,
        password: hashedPassword
    })

    await otpModel.create({
        user: user._id,
        email,
        otp: hashedOtp,
    })

    await sendEmail(email, "OTP Verification", `Your OTP code is ${otpCode}`, html)

    const token = jwt.sign(
        { id: user._id },
        config.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
    )

    const accessToken = jwt.sign(
        { id: user._id },
        config.JWT_SECRET,
        { expiresIn: "15m" }
    )

    const session = await sessionModel.create({
        user: user._id,
        refreshToken: token,
        ip: req.ip,
        userAgent: req.headers["user-agent"],

    })

    res.cookie("refreshToken", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 7
    })

    res.status(201).json({
        message: "User created successfully",
        accessToken
    })
}

export const get_me = async (req, res) => {
    console.log("headers", req.headers);
    // const token = req.headers.authorization?.split(" ")[1]
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
        return res.status(400).json({
            "message": "Token is missing"
        })
    }

    let decoded

    try {
        decoded = jwt.verify(token, config.JWT_SECRET)
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" })
    }

    const user = await userModel.findById(decoded.id).select("-password")

    if (!user) {
        return res.status(404).json({
            "message": "No user found"
        })
    }

    res.status(200).json({
        "message": "User fetched successfully",
        "user": user
    })
}

export const refresh_token = async (req, res) => {
    // const token = req.headers.authorization?.split(" ")[1]
    const token = req.cookies.refreshToken

    if (!token) {
        return res.status(404).json({
            message: "Token not found"
        })
    }

    const session = await sessionModel.findOne({
        refreshToken: token,
        revoke: false
    })

    if (!session) {
        return res.status(401).json({ message: "Session expired" })
    }

    let decoded

    try {
        decoded = jwt.verify(token, config.JWT_REFRESH_SECRET)
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" })
    }

    if (!decoded) {
        return res.status(404).json({
            "message": "Token is invalid"
        })
    }

    const accessToken = jwt.sign({ id: decoded.id }, config.JWT_SECRET, { expiresIn: "15m" })

    res.json({ accessToken })

}

export const logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
        return res.status(400).json({
            "message": "Token not found"
        })
    }
    const session = await sessionModel.findOne({ refreshToken: refreshToken, revoke: false })
    if (!session) return res.status(404).json({ message: "Session not found" })

    session.revoke = true
    await session.save()
    res.clearCookie("refreshToken")


    res.json({ "message": "Logout successfully" })
}

export const logoutAll = async (req, res) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
        return res.status(400).json({
            "message": "Token not found"
        })
    }

    let decoded

    try {
        decoded = jwt.verify(refreshToken, config.JWT_REFRESH_SECRET)
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" })
    }

    await sessionModel.updateMany(
        {
            user: decoded.id,
            revoke: false,
        },
        { revoke: true }
    )

    const session = await sessionModel.find({ user: decoded.id })


    res.clearCookie("refreshToken")

    res.json({ "message": "Logout successfully", session })


}

export const login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({
            "message": "Required fields are missing"
        })
    }

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(404).json({
            "message": "Invalid email or password"
        })
    }

    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
        return res.status(404).json({
            "message": "Invalid email or password"
        })
    }

    const token = jwt.sign(
        { id: user._id },
        config.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
    )

    const accessToken = jwt.sign(
        { id: user._id },
        config.JWT_SECRET,
        { expiresIn: "15m" }
    )

    const session = await sessionModel.create({
        user: user._id,
        refreshToken: token,
        ip: req.ip,
        userAgent: req.headers["user-agent"],

    })

    res.cookie("refreshToken", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 7
    })

    res.status(200).json({
        "message": "User login successfully",
        accessToken,
        "user": {
            _id: user._id,
            email: user.email,
            userName: user.userName
        }
    })
}