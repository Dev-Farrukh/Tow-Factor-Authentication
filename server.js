import app from "./src/app.js";
import dbConfiguration from "./src/config/db_config.js";

dbConfiguration()

app.listen(3000 , (req,res)=> {
    console.log("Server is running");
})