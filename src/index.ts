import * as dotenv from "dotenv"

const path = require("path")
// https://stackoverflow.com/questions/58684642/should-i-call-dotenv-in-every-node-js-file
dotenv.config({debug: true, encoding: "UTF-8"})

import { connect, mongodbUrl } from "./db/mongoose"
import { app } from "./app"
const PORT = process.env?.PORT || 3000
const start = async () => {
    try {
        await connect()
        app.listen(PORT, () => {
            console.log(`Running on port: ${PORT}`)
        })
    } catch(error) {
        console.log(`Error: ${error}`)
        process.exit(1)
    }
}
start()
