import express, { Router } from "express";
import passport from "passport"
import "../strategies/google-strategy"

export const googleAuthRouter = Router()


googleAuthRouter.get("/api/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
)
  

googleAuthRouter.get("/api/auth/google/callback", 
    passport.authenticate("google", { failureRedirect: "/api/auth/login" }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect("/")
    }
)


googleAuthRouter.post("/api/auth/google/logout", (request: express.Request, response: express.Response) => {
    if (!request.user) response.status(401).send({})
	else {
        request.logout((err) => {
            if (err) response.status(400).send({msg: err.message})
            else {
                response.render("layout")
            }
        })
    }
})