import app from "./src/app.js";
import envVariables from "./src/config/env.config.js";

app.listen(envVariables.PORT , ()=> {
    console.log(`Server is running on port ${envVariables.PORT}`);
})