import {config} from "../../conf/config"
import * as dbConnect from "./db-connection"

/**
 * Data model
 */
export class Post {
    id: number
    titulo: string
    local: string
    autor: string
    data: string
    conteudo: string
    capa: string

    constructor(titulo: string, autor: string, 
        data: string, conteudo: string) {
            this.id = 0
            this.titulo = titulo
            this.local = ""
            this.autor = autor
            this.data = data
            this.conteudo = conteudo
            this.capa = ""
        }
    
    isValid(): boolean {
        return this.titulo.length > 0 && this.autor.length > 0
            && this.data.length > 0 && this.conteudo.length > 0
    }
}

/**
 * DAO object
 */
 export class PostDAO {
     private static instance: PostDAO

     private constructor() {}

     private getCollection() {
         return dbConnect.getDb().collection(config.db.collections.posts)
     }

     static getInstance(): PostDAO {
         if (!PostDAO.instance) {
             PostDAO.instance = new PostDAO()
         }

         return PostDAO.instance
     }

     /**
      * Insert a new post
      * @param post the post
      */
     async insert(post: Post): Promise<boolean> {
        // TODO
     }

     /**
      * List all posts
      */
     async listAll(): Promise<Post[]> {
         // TODO
     }

     /**
      * Find by post using its id
      * @param id the profile id
      */
     async findById(id: number): Promise<Post> {
         // TODO
     }

     async update(post: Post): Promise<boolean> {
        console.log(post)
        try {
            const response = await this.getCollection().replaceOne(
                {id: post.id}, post)

            return (response) ? response.modifiedCount > 0 : false
        } catch (error) {
            console.error("Failed to update post")
            throw error
        }
     }

     async removeById(id: number): Promise<boolean> {
        try {
            const response = await this.getCollection().deleteOne({id: id}, {})
            return (response.deletedCount) ? response.deletedCount > 0 : false
        } catch (error) {
            console.log("Failed to remove element")
            throw error
        }
     }

     /**
      * Generate a new profile id using a db sequence.
      */
     async nextId(): Promise<number> {
        try {
            const seqColl = dbConnect.getDb()
                .collection(config.db.collections.sequences)
            const result = await seqColl.findOneAndUpdate(
                {name: "post_id"}, 
                {$inc: {value: 1}})
            if (result.ok) {
                return result.value.value as number
            }
            throw Error()
        } catch (error) {
            console.error("Failed to generate a new post id")
            throw error
        }
     }
 }
