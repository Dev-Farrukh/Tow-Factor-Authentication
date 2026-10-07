import express from "express";
import * as authController from "../controller/auth.controller.js";
import { body } from "express-validator";
import tokenValid from "../middleware/tokenCheck.js";
import uploadFile from "../middleware/fileUpload.js";
const router = express.Router();

router.post("/register", [
    body("firstName").trim().notEmpty().isLength({ min: 2, max: 10 }).withMessage("First name is invalid"),
    body("lastName").trim().notEmpty().isLength({ min: 2, max: 10 }).withMessage("Last name is invalid"),
    body("userName").trim().notEmpty().isLength({ min: 3, max: 10 }).withMessage("User name is invalid"),
    body("email").trim().notEmpty().isLength({ min: 3 }).isEmail().withMessage("Email is invalid"),
    body("password").trim().notEmpty().withMessage("Password is invalid"),
], authController.registerUser)

router.post("/verify", [
    body("userName").trim().notEmpty().isLength({ min: 3, max: 10 }).withMessage("User name is invalid"),
    body("otp").trim().notEmpty().isLength({ min: 3, max: 10 }).withMessage("Otp is invalid"),
], authController.verifyUser)

router.post("/login", [
    body("userName").trim().notEmpty().isLength({ min: 3, max: 10 }).withMessage("User name is invalid"),
    body("password").trim().notEmpty().withMessage("Password is invalid"),
], authController.loginUser)

router.post("/two_factor", [
    body("userName").trim().notEmpty().isLength({ min: 3, max: 10 }).withMessage("User name is invalid"),
    body("otp").trim().notEmpty().isLength({ min: 3, max: 10 }).withMessage("Otp is invalid"),
], authController.twoFactor)

router.get("/logout", authController.logout)

router.get("/get-user", tokenValid, authController.getMe)

router.post("/file", tokenValid , uploadFile.single("file"), authController.getFile)

router.post("/refresh" , authController.refreshToken)


export default router
