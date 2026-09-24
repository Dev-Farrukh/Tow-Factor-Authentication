/* eslint-disable no-undef */
import "dotenv/config"

const NAMES = ["PORT" , "MONGO_URI" , "TOKEN_SECRET" , "FORNTEND_URL" , "REFRESH_TOKEN_SECRET" , "API_KEY"]

NAMES.forEach((items)=> {
    if(!process.env[items]){
        throw new Error(`Variable ${items} is missing `)
    }

})

const envVariables = Object.fromEntries(
    NAMES.map((items)=> [items , process.env[items]])
)


export default envVariables