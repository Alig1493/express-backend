import passport from "passport"
import { Strategy } from "passport-local"
// import { mockUsers, User } from "../types/users"
import { IUser, UserModel } from "../db/schemas/UserSchema"


passport.serializeUser(
    (user, done) => {
        console.log("Inside serializer for user: ")
        console.log(user)
        done(null, (user as IUser)._id)
    }
)

passport.deserializeUser(
    async (id, done) => {
        const findUser: any = await UserModel.findById(id)
        if (!findUser) {
            done(new Error("User does not exist"), false)
        }
        else {
            console.log("User found: " +findUser)
            findUser.password = "****"
            done(null, findUser)
        }
    }
)

export default passport.use(
    new Strategy(
        async (username, password, done) => {
            console.log(username +" " +password)
            try {
                const findUser: any = await UserModel.findOne({"username": username})
                // const findUser: User | undefined = mockUsers.find(
                //     (user: User) => {
                //         return user.username === username
                //     }
                // )
                console.log(findUser)
                if (!findUser) throw new Error("Invalid credentials")
                // console.log("Validating password: " +findUser.checkPassword(password))
                findUser.comparePassword(password, (err: any, isMatch: any) => {
                    if (err) throw err
                    if (!isMatch) throw new Error("Invalid credentials")
                    console.log("IsMatch: " +isMatch)
                    console.log(findUser.toObject())
                    const userDoc = findUser.toObject()
                    userDoc.password = "****"
                    return done(null, {...userDoc}, {message: "Login Suceeded"})
                })
            } catch(error: any) {
                done(null, false, {"message": error?.message || "Authentication Failed"})
            }
        }
    )
)
