import express, { Router } from "express"
import passport from "passport"
import "../strategies/local-strategy"

export const authRouter = Router()


authRouter.post("/api/auth", passport.authenticate("local"), (request: express.Request, response: express.Response) => {
    response.status(200).send({})
})


authRouter.post("/api/auth/logout", (request: express.Request, response: express.Response) => {
    if (!request.user) response.status(401).send({})
	else {
        request.logout((err) => {
            if (err) response.status(400).send({msg: err.message})
            else {
                response.status(200).send({})
            }
        })
    }
})


authRouter.get("/api/auth/status", (request: express.Request, response: express.Response) => {
    // {
    // id: 1,
    // username: 'anon',
    // displayName: 'Anon',
    // password: 'asdfgh345678'
    // }
    // Session {
    // cookie: {
    //     path: '/',
    //     _expires: 2024-10-15T12:26:49.602Z,
    //     originalMaxAge: 600000,
    //     httpOnly: true
    // },
    // passport: { user: 1 } -> serialized user id
    // }

    console.log(request.user)
    console.log(request.session)
    request.user ? response.status(200).send(request.user) : response.status(401).send({msg: "Not authenticated"})
})


// authRouter.post("/api/auth", checkSchema(loginValidationSchema), (request: express.Request<{}, {}, Login>, response: express.Response) => {
//     const { username, password } = matchedData(request)
//     const findUser = mockUsers.find(
//         (user: User) => {
//             return user.username == username
//         }
//     )
//     if (!findUser || findUser?.password !== password) {
//         request.session.user = null
//         response.status(401).send({msg: "Bad credentials"})
//     }
//     else {
//         request.session.user = findUser
//         response.status(200).send(findUser)
//     }
// })
