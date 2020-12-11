import * as dbConnection from "./db-connection"
import {config} from "../../conf/config"

export class Author {
    id: number
    username: string
    fullname: string
    password: string

    constructor(email: string, password: string) {
        this.id = 0
        this.username = email
        this.fullname = ""
        this.password = password
    }

    isValid() {
        return this.username.length > 0 && this.password.length > 0
    }
}

export class AuthorDAO {
    private static instance: AuthorDAO

    private constructor() {}

    static getInstance() {
        if (!this.instance) {
            this.instance = new AuthorDAO()
        }
        return this.instance
    }
    
    getCollection() {
        return dbConnection.getDb().collection(config.db.collections.authors)
    }

    async findByUsername(username: string) {
        try {
            const response = await this.getCollection().findOne({username: username})

            if (response) {
                return response as Author
            }
            throw Error("Failed to retrieve admin with given email")
        } catch (error) {
            console.error(error)
            throw error
        }
    }

}