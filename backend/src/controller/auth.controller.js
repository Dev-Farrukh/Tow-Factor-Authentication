import { validationResult } from "express-validator";
import userModel from "../model/user.schema.js";
import fileModel from "../model/file.schema.js";
import jwt from "jsonwebtoken"
import envVariables from "../config/env.config.js";
import blackListTokenModel from "../model/token.schema.js";
import sendEmail from "../services/sendEmail.js";


export const registerUser = async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() });
    }

    const { firstName, lastName, userName, password , otp } = req.body;

    const existingUser = await userModel.findOne({ userName })
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" })
    }
   
    
    const {Otp , data} = await sendEmail() 
    // Wait for user to enter otp  
    console.log(data)
    


                                                                                                                                                                                                                 


    const hashedPassword = await userModel.hashPassword(password);
    const newUser = await userModel.create({
        firstName,
        lastName,
        userName,
        password: hashedPassword
    })
    if (!newUser) {
        return res.status(500).json({ message: "Internal server error" })
    }

    const authToken = newUser.generateAccessToken();
    const refreshToken = newUser.generateRefreshToken();
    res.cookie("token", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const userResponse = newUser.toObject();
    delete userResponse.password;
    res.status(201).json({
        message: "User registered successfully",
        user: userResponse,
        authToken
    })
}

export const loginUser = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { userName, password } = req.body
    const user = await userModel.findOne({ userName }).select("+password")
    if (!user) return res.status(404).json({ message: "User not found" })

    const isPassword = await user.comparePassword(password)
    if (!isPassword) return res.status(404).json({ message: "Invalid email or password" })

    const authToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken()
    res.cookie("token", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const userResponse = user.toObject();
    delete userResponse.password
    res.status(200).json({
        message: "User login successfully",
        user: userResponse,
        authToken
    })


}

export const logout = async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1] || req.cookies.token
    if (!token) return res.status(404).json({ message: "Token not found" });
    const isBlacklisted = await blackListTokenModel.findOne({ token })
    if (isBlacklisted) return res.status(400).json({ message: "Inavlid Token " });
    const decoded = jwt.verify(token, envVariables.REFRESH_TOKEN_SECRET)
    if (!decoded) return res.status(400).json({ message: "Inavlid Token " });

    try {
        await blackListTokenModel.create({
            token,
            expiresAt: Date.now(),
            reason: "logout",
        })
    } catch (error) {
        res.clearCookie("token")
        return res.status(500).json({ error })
    }
    res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    })
    return res.status(200).json({ message: "Logged out successfully" });
}

export const getMe = async (req, res) => {
    try {
        res.status(200).json({
            message: "User fetched successfully",
            user: req.user
        })
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

export const getFile = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No file uploaded" });
        const file = req.file
        console.log(file);

        await fileModel.create({
            filename: file.filename,
            originalName: file.originalname,
            mimetype: file.mimetype,
            size: file.size
        })

        res.status(201).json({
            message: " File uploaded successfully",
            file: req.file
        })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

export const refreshToken = async (req, res) => {
    // Checks
    const token = req.headers.authorization?.split(" ")[1] || req.cookies.token
    if (!token) return res.status(404).json({ message: "Token not found" });
    const isBlacklisted = await blackListTokenModel.findOne({ token })
    if (isBlacklisted) return res.status(400).json({ message: "Inavlid Token " });
    try {
        const decoded = jwt.verify(token, envVariables.REFRESH_TOKEN_SECRET)
        // Genrating new one
        const refreshToken = jwt.sign({ id: decoded.id, }, envVariables.REFRESH_TOKEN_SECRET, { expiresIn: "7d" })
        res.cookie("token", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        const accessToken = jwt.sign({ id: decoded.id, }, envVariables.TOKEN_SECRET, { expiresIn: "15m" })
        // Blckilsting old one
        try {
            await blackListTokenModel.create({
                token,
                expiresAt: Date.now(decoded.exp * 1000),
                reason: "refresh",
            }
            )
        } catch (error) {
            return res.status(500).json({ error })
        }


        res.status(201).json({ accessToken })

    } catch (error) {
        return res.status(400).json({ message: "Inavlid Token ", error })
    }
}