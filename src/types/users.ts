export type QueryParams = {
    filter: string
    value: string
}

export type User = {
    id?: number
    username: string
    displayName: string,
    password: string
}

export type Login = {
    username: string
    password: string
}

export const mockUsers: User[] = [
    {id: 1, username: "anon", displayName: "Anon", password: "asdfgh345678"},
    {id: 2, username: "jack", displayName: "Jack", password: "@#$%^&fGHJ"},
    {id: 3, username: "adam", displayName: "Adam", password: "FGHJK%^&*()<>"}
]
