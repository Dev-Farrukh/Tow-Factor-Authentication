import config from "../config/config.js";
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAUTH2",
        user: config.GOOGLE_USER,
        clientId: config.CLIENT_ID,
        clientSecret: config.CLIENT_SECRET,
        refreshToken: config.USER_REFRESH_TOKEN
    }
})

transporter.verify((error, success) => {
    if (error) {
        return console.error("Error ", error)
    } else {
        console.log("Server is ready");

    }
})

export const sendEmail = async (to , subject , text , html) => {
    try {
        const info = await transporter.sendMail({
            from : `Name ${config.GOOGLE_USER}` ,
            to,
            subject,
            text ,
            html
        })
        console.log("Sent " , info.messageId);
        
    } catch (error) {
        return console.log(error);
        
    }
}