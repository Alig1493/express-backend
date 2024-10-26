import mongoose, { mongo } from "mongoose"
import { passwordCompare, passwordHasher } from "../../utils/users"
import bcrypt from "bcrypt"


export interface IUser extends mongoose.Document {
    username: string
    displayName?: string
    password: string,
    googleProfile: any
}
  

interface IUserMethods extends mongoose.Document {
    checkPassword(password: string): boolean
}

type UserModelType = mongoose.Model<IUser, {}, IUserMethods>

export const UserSchema = new mongoose.Schema<IUser, {}, IUserMethods>(
    {
        username: {
            type: mongoose.Schema.Types.String,
            required: true,
            unique: true
        },
        displayName: {
            type: mongoose.Schema.Types.String
        },
        password: {
            type: mongoose.Schema.Types.String,
            required: false
        },
        googleProfile: {
            type: mongoose.Schema.Types.Map,
            required: false
        }
    }
)


UserSchema.pre("save", async function(next) {
    var user = this

    // only hash the password if it has been modified (or is new)
    if (!user.isModified("password")) return next()

    // generate a salt
    // bcrypt.genSalt(SALT_WORK_FACTOR, function(err: any, salt: any) {
    //     if (err) return next(err)

    //     // hash the password using our new salt
    //     bcrypt.hash(user.password, salt, function(err: any, hash: any) {
    //         if (err) return next(err)
    //         // override the cleartext password with the hashed one
    //         user.password = hash;
    //         next()
    //     })
    // })
    if (!user.isModified("password")) return next()
    try {
        user.password = await passwordHasher(user.password)
        return next()
    } catch (error: any) {
        return next(error)
    }
})


UserSchema.methods.comparePassword = function(candidatePassword: any, cb: Function) {
    return passwordCompare(candidatePassword, this.password, cb)
}


export const UserModel = mongoose.model<IUser, UserModelType>("User", UserSchema)
