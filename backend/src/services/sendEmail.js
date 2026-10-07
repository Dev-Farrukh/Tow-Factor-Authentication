import { Resend } from 'resend';
import { randomInt } from "crypto";
import envVariables from '../config/env.config.js';

const sendEmail = async (userEmail) => {
    let generated_Otp ;
    try{ generated_Otp = randomInt(0 , 100000).toString().padStart(6 , "0")}
    // eslint-disable-next-line preserve-caught-error
    catch(error){throw new Error(`Can not generate Otp ${error}`)}
    console.log("otp ", generated_Otp);
    console.log("email ", userEmail);

    const resend = new Resend(envVariables.API_KEY)
    const { data, error } = await resend.emails.send({
        from: "Practice  <onboarding@resend.dev>",
        to: [userEmail],
        subject: "Otp Verification",
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>OTP Verification</title>
            </head>
            <body style="font-family: Arial, sans-serif; background-color: #f4f4f7; margin: 0; padding: 20px;">
                <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h2 style="color: #333333; margin-top: 0; text-align: center;">Verification Code</h2>
                <p style="color: #666666; font-size: 16px; line-height: 1.5; text-align: center;">
                    Please use the following One-Time Password (OTP) to complete your verification:
                </p>
                <div style="text-align: center; margin: 30px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #4F46E5; background-color: #EEF2FF; padding: 12px 24px; border-radius: 6px; display: inline-block;">
                    ${generated_Otp}
                    </span>
                </div>
                <p style="color: #666666; font-size: 14px; line-height: 1.5; text-align: center;">
                    This code will expire in 10 minutes. If you did not request this code, please ignore this email.
                </p>
                <hr style="border: none; border-top: 1px solid #eaeaeb; margin: 30px 0;">
                <p style="color: #999999; font-size: 12px; text-align: center; margin: 0;">
                    &copy; Practice App. All rights reserved.
                </p>
                </div>
            </body>
            </html>
        `,

    })

    if (error) {
        return console.error({ error });
    }
    return {generated_Otp , data}
}

export default sendEmail