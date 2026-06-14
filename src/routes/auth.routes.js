import { Router } from "express";
import * as authContoller from "../controller/auth.controller.js";

const routes = Router()

routes.post("/register" , authContoller.register )
routes.post("/get-me" , authContoller.get_me )
routes.get("/logout" , authContoller.logout )
routes.get("/logoutAll" , authContoller.logoutAll )

export default routes