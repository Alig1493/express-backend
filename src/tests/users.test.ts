import { describe } from "@jest/globals"
import mongoose from "mongoose"
import { passwordHasher, populateUsers } from "../utils/users"
import { mockUsers, User } from "../types/users"
import { app } from "../app"

const request = require("supertest")
interface ModifiedUser extends Omit<User, "password"> {
    password?: string
}

beforeAll(async () => {
    try {
        // console.log(process.env.MONGODB_URL)
        if (!process.env.MONGODB_URL) throw new Error("Requires MONGODB_URL to be set")
        await mongoose.connect(process.env.MONGODB_URL, {dbName: "UserTests"})
        await populateUsers()
    } catch(error: any) {
        console.error(error.message)
        process.exit(1)
    }
})

/* Closing database connection after each test. */
afterAll(async () => {
    try {
        await mongoose.connection.dropDatabase()
        await mongoose.connection.close()
    } catch(error) {
        console.error(error)
        process.exit(1)
    }
})


describe("GET /api/users", () => {
    it("should return all users", async () => {
        const res = await request(app).get("/api/users")
        let users = await Promise.all(
            mockUsers.map(async (user): Promise<ModifiedUser> => {
                user.password = await passwordHasher(user.password)
                return {
                    username: user.username,
                    displayName: user.displayName,
                }
            })
        )
        const sortFunc = (a: ModifiedUser, b: ModifiedUser) => {
            if (a.username > b.username) return 1
            else if (a.username < b.username) return -1
            return 0
        }
        let responseUsers = res.body.map((user: User): ModifiedUser => {
            return {
                username: user.username,
                displayName: user.displayName,
            }
        })
        expect(res.statusCode).toBe(200)
        expect(res.body.length).toBeGreaterThan(0)
        expect(responseUsers.sort(sortFunc)).toEqual(users.sort(sortFunc))
    })
})

  