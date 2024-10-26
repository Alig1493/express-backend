import express, { Request, Response } from "express"
import cookieParser from "cookie-parser"
import passport from "passport"
import session from "express-session"
import MongoStore from "connect-mongo"
import { usersRouter } from "./routes/users"
import { productsRouter } from "./routes/products"
// import { User } from "./types/users"
import { authRouter } from "./routes/auth"
import { Product } from "./types/products"
import { googleAuthRouter } from "./routes/googleAuth"
import { mongodbUrl } from "./db/mongoose"


export const app = express()
const path = require("path")

declare module "express-session" {
    interface SessionData {
        // user?: User | null;
        cart?: [Product] | null
    }
}

const expressLayouts = require("express-ejs-layouts")
const loggingMiddleware = (request: Request, response: Response, next: express.NextFunction) => {
    console.log(`${request.method} - ${request.url}`)
    next()
}
app.use(session(
    {
        secret: "sessionSecret@#$%^&*",
        saveUninitialized: false,
        resave: false,
        store: MongoStore.create({
            mongoUrl: mongodbUrl || "localhost:2776",
        }),
        cookie: {
            maxAge: 60000000
        }
    }
))
app.use(cookieParser("signedSecret"))
app.use(passport.initialize(), passport.session())
app.use(express.json(), loggingMiddleware)
app.use(authRouter, googleAuthRouter, productsRouter, usersRouter)
// EJS setup
app.use(expressLayouts)
// Setting the root path for views directory
app.set("views", path.join(__dirname, "views"))
// app.set("views", __dirname + "/views")
// Setting the view engine
app.set("view engine", "ejs")


app.get("/", (request: Request, response: Response) => {
    response.cookie(
        "name",
        "value",
        {
            maxAge: 6000,
            signed: true
        }
    )
    // console.log(request.user)
    // console.log(request.session)
    // console.log(request.sessionStore)
    // console.log(request.sessionStore.get(request.sessionID, (sessionData, error) => {
    //     if (error) throw error
    //     console.log("Session data: " +" " +sessionData)
    // }))
    // console.log(request.sessionID)
    response.locals.user = request.user
    response.render("index")
})
