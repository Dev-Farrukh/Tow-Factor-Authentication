import "dotenv/config"

 if (!process.env.DB_URI) {
    throw new Error("DB URI is not defined in environment variables")
 }
 if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables")
 }
 if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error("JWT_REFRESH_SECRET is not defined in environment variables")
 }
 if (!process.env.CLIENT_SECRET) {
    throw new Error("CLIENT_SECRET is not defined in environment variables")
 }
 if (!process.env.CLIENT_ID) {
    throw new Error("CLIENT_ID is not defined in environment variables")
 }
 if (!process.env.USER_REFRESH_TOKEN) {
    throw new Error("USER_REFRESH_TOKEN is not defined in environment variables")
 }
 if (!process.env.GOOGLE_USER) {
    throw new Error("GOOGLE_USER is not defined in environment variables")
 }

 const config = {
   DB_URI : process.env.DB_URI,
   JWT_SECRET : process.env.JWT_SECRET ,
   JWT_REFRESH_SECRET : process.env.JWT_REFRESH_SECRET ,
   CLIENT_SECRET : process.env.CLIENT_SECRET ,
   CLIENT_ID : process.env.CLIENT_ID ,
   USER_REFRESH_TOKEN : process.env.USER_REFRESH_TOKEN ,
   GOOGLE_USER : process.env.GOOGLE_USER ,
 }

 export default config


