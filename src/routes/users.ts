import express, { Router } from "express"
import { mockUsers, QueryParams, User } from "../types/users"
import { checkSchema, matchedData, query, userValidationSchema, validationResult } from "../utils/validators" 
import { ParamsDictionary } from "express-serve-static-core"
import { populateUsers, resolveIndexByUserId } from "../utils/users"
import { IUser, UserModel } from "../db/schemas/UserSchema"

export const usersRouter = Router()


usersRouter.post(
    "/api/users/loadusers",
    async (
        request: express.Request,
        response: express.Response
    ) => {
        try {
            await populateUsers()
            response.status(200).send({"msg": "OK"})
        } catch(error: any) {
            response.status(400).send({"msg": error.message})
        }
    }
)


usersRouter.get(
    "/api/users",
    query("filter").isString().notEmpty(),
    async (
        request: express.Request<{}, {}, {}, QueryParams>, 
        response: express.Response
    ) => 
        {   
            // console.log(validationResult(request))
            const { filter, value } = request.query
            // console.log(request.query)
            // console.log(filter +" " +value)

            if (!filter && !value) {
                const users = await UserModel.find({}).exec()
                response.status(200).send(users)
            }
            if (filter && value) {
                let filterValue: number | string = value
                if (!isNaN(parseInt(filterValue))) {
                    filterValue = parseInt(filterValue)
                }
                const users = await UserModel.find({[filter]: filterValue}).exec()
                response.status(200).send(users)
            }
        }
    )


usersRouter.post(
    "/api/users/", 
    checkSchema(userValidationSchema),
    async (request: express.Request<{}, User>, response: express.Response) => {
        const errors = validationResult(request)
        if (!errors.isEmpty()) {
            response.status(400).send(errors)
        }
        else {
            const body = matchedData(request)
            try {
                const newUser: IUser = await new UserModel(body).save()
                response.status(201).send(newUser)
            } catch (error: any) {
                console.error(error)
                response.status(400).send({msg: error.message})
            }
        }
    }
)

usersRouter.get("/api/users/:id", resolveIndexByUserId, async (request: express.Request, response: express.Response) => {
    try {
        const findUser: IUser | null = await UserModel.findById(response.locals.findUserIndex)
        // console.log(findUser?.displayName)
        response.status(200).send(findUser)
    } catch(error: any) {
        response.sendStatus(400).send({msg: error.message})
    }
})


usersRouter.patch("/api/users/:id", resolveIndexByUserId, async (request: express.Request<ParamsDictionary, User>, response: express.Response) => {
    try {
        const { username, displayName } = request.body
        const findUser: IUser | null = await UserModel.findById(response.locals.findUserIndex)
        if (!username && !displayName) response.status(400).send({msg: "Need at least username or displayName"})
        if (findUser && username) findUser.username = username
        if (findUser && displayName) findUser.displayName = displayName
        await findUser?.save()
        response.status(200).send(findUser)
    } catch (error: any) {
        response.sendStatus(400).send({msg: error.message})
    }
})


usersRouter.put("/api/users/:id", resolveIndexByUserId, async (request: express.Request<ParamsDictionary, User>, response: express.Response) => {
    try {
        const { body } = request
        const findUser: IUser | null = await UserModel.findByIdAndUpdate(response.locals.findUserIndex, {...body})
        response.status(200).send(findUser)
    } catch(error: any) {
        response.status(400).send({msg: error.message})
    }
})


usersRouter.delete("/api/users/:id", resolveIndexByUserId, async (request: express.Request, response: express.Response) => {
    try {
        await UserModel.findByIdAndDelete(response.locals.findUserIndex)
        response.status(200).send({})
    } catch(error: any) {
        response.status(400).send({msg: error.message})
    }
})

