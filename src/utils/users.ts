import express from "express"
// import { mockUsers, User } from "../types/users"
import { UserModel } from "../db/schemas/UserSchema"
import { mockUsers, User } from "../types/users"

const SALT_WORK_FACTOR = 10
const bcrypt = require("bcrypt")


export const populateUsers = async () => {
    await Promise.all(mockUsers.map(async (user: User) => {
        await UserModel.create(user) 
    }))
}


export const resolveIndexByUserId = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const { params: { id } } = request
    try {
        const findUser = await UserModel.findById(id)
        // console.log(findUserIndex)
        if (!findUser) {
            response.status(404).send({msg: `User with id: ${id} not found`})
        }
        else {
            response.locals.findUserIndex = findUser._id
            next()
        }
    } catch(error: any) {
        response.status(404).send({msg: `Encountered error ${error.message}`})
    }
}


export const passwordHasher = async (password: string): Promise<string> => {
    try {
        const salt = await bcrypt.genSalt(SALT_WORK_FACTOR)
        return await bcrypt.hash(password, salt)
    } catch(error) {
        return await Promise.reject(error)
    }
}


export const passwordCompare = (password: string, hashedPassword: string, cb: Function) => {
    bcrypt.compare(password, hashedPassword, function(err: any, isMatch: any): Function {
        if (err) return cb(err)
        return cb(null, isMatch)
    })
}
