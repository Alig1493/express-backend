import mongoose, { mongo } from "mongoose"


export const mongodbUrl: string | undefined = process.env.MONGODB_URL
export const connect = async () => {
    if (!mongodbUrl) {
        throw new Error("Must declare mongo url")
    }
    mongoose.connect(mongodbUrl).then(
        () => {
            console.log("Connected to database")
        }
    ).catch(
        (error) => {
            console.log(`Error ${error}`)
        }
    )
}
