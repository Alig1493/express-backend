import express, { Router } from "express"
import { checkSchema, matchedData, cartProductValidatorSchema, validationResult } from "../utils/validators"

export const productsRouter = Router()


productsRouter.get("/api/products", (request: express.Request, response: express.Response) => {
    console.log(request.cookies)
    console.log(request.signedCookies)
    response.send([
        {
            id: 123,
            name: "Chicken",
            price: 12.99
        }
    ])
})


productsRouter.get("/api/cart", (request: express.Request, response: express.Response) => {
    if (!request.user) response.sendStatus(401)
    else {
        response.status(200).send(request.session.cart)
    }
})


productsRouter.post("/api/cart", checkSchema(cartProductValidatorSchema), (request: express.Request, response: express.Response) => {
    if (!request.user) response.sendStatus(401)
    else if (!validationResult(request).isEmpty()) {
        response.status(400).send(validationResult(request))
    }
    else {
        const cartData = matchedData(request)
        if (!request.session.cart) {
            request.session.cart = [{...cartData}]
        } else {
            request.session.cart.push({...cartData})
        }
        response.status(200).send(request.session.cart)
    }
})
