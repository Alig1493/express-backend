import passport from "passport";
import { IUser, UserModel } from "../db/schemas/UserSchema";

const GoogleStrategy = require("passport-google-oauth20").Strategy
const {OAuth2Client} = require("google-auth-library")
const client = new OAuth2Client()
const CLIENT_ID: string = process.env.GOOGLE_CLIENT_ID || ""
const CLIENT_SECRET: string = process.env.GOOGLE_CLIENT_SECRET || ""
const CALLBACK_URL: string = process.env.GOOGLE_CALLBACK_URL || "http://localhost/api/auth/google/callback"
  

async function verify(token: string) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If the request specified a Google Workspace domain:
    // const domain = payload['hd'];
}


passport.serializeUser(
    (user, done) => {
        done(null, (user as IUser)._id)
    }
)

passport.deserializeUser(
    async (id, done) => {
        const findUser: any = await UserModel.findById(id)
        if (!findUser) {
            done(new Error("Google User does not exist"), false)
        }
        else {
            console.log("Google User found: " +findUser)
            findUser.password = "****"
            done(null, findUser)
        }
    }
)

export default passport.use(new GoogleStrategy({
    clientID: CLIENT_ID, clientSecret: CLIENT_SECRET, callbackURL: CALLBACK_URL
},
  async function(accessToken: string, refreshToken: string, profile: any, cb: Function, ...otherParams: any[]) {
    // console.log("Profile: " +profile)
    // console.log("Access Token: " +accessToken)
    // console.log("Refresh Token: " +refreshToken)
    // console.log("Other params: " +otherParams)
    try {
        let googleProfile = await UserModel.findOne({"googleProfile.id": profile.id})
        // await verify(accessToken)
        if (!googleProfile) {
            googleProfile = await UserModel.create({
                username: profile.emails[0].value,
                displayName: profile.displayName,
                password: null,
                googleProfile: {
                    id: profile.id,
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    ...profile._json
                } 
            })
            return cb(null, googleProfile)
        } else {
            googleProfile.googleProfile = {
                id: profile.id,
                accessToken: accessToken,
                refreshToken: refreshToken,
                ...profile._json
            }
            await googleProfile.save()
            return cb(null, googleProfile)
        }
    } catch (err) {
        return cb(err, null)
    }
  }
));