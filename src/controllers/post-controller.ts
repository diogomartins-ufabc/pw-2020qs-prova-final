import e from "express"
import * as fs from "fs"
import * as path from "path"
import multipartyExpress from "multiparty-express"
import * as model from "../models/post-model"
import { config } from "../../conf/config"
import "../session-data"

/**
 * List all profiles.
 * @param req the request object
 * @param res the response object
 */
export async function list(req: e.Request, res: e.Response) {
    try {
        res.render('list', {
            posts: await model.PostDAO.getInstance().listAll()
        })
    } catch(error) {
        console.error(error)
        res.render("error") // TODO
    }
}

/**
 * Show the details of a profile.
 * @param req the request object
 * @param res the response object
 */
export async function details(req: e.Request, res: e.Response) {
    const id = parseInt(req.params.id) || 0

    try {
        res.render("post", {
            post: await model.PostDAO.getInstance().findById(id)
        })
    } catch(err) {
        res.render("error", {
            type: "unknown_post", 
            params: {
                id: req.params.id
            }
        })
    }
}

 export function addForm(req: e.Request, res: e.Response) {
     const now = new Date()
     const date = new Date().toString()
     res.render("add", {
        post: new model.Post("", req.session.authorName || "", date, "")
    })
 }

 async function save(req: e.Request, res: e.Response, edit: boolean) {
    const getField = (name: string) => 
        (name in req.fields) ? req.fields[name].pop() : ""
    const savePicture = async (file: multipartyExpress.File | undefined) => {
        try {
            const fileInfo = await fs.promises.stat(file?.path || "")

            if (file && fileInfo.isFile() && fileInfo.size > 0) {
                const filename = path.basename(file.path)
                const newPath = path.join(config.upload_dir, filename)

                await fs.promises.copyFile(file.path, newPath)

                return filename
            } 
        } catch (error) {
            console.error("Failed to move post cover")
            throw error
        }

        return ""
    }

    const titulo = getField("titulo")
    const local = getField("local")
    const autor = getField("autor")
    const data = getField("data")
    const conteudo = getField("conteudo")
    const post = new model.Post(titulo, autor, data, conteudo)

    post.local = local
    try {
        if (post.isValid()) {
            if ("picture" in req.files) {
                post.capa = 
                    await savePicture(req.files["picture"].pop())
            }
            if (edit) { // edit
                post.id = parseInt(getField("id")) || 0
                if (await model.PostDAO.getInstance().update(post)) {
                    res.render("status", {type: "post_edit_success"})
                } else {
                    throw Error("Failed to update post in the database")
                }
            } else { // insert
                if (await model.PostDAO.getInstance().insert(post)) {
                    res.render("status", {type: "post_add_success"})
                } else {
                    throw Error("Failed to insert post in the database")
                }
            }
        } else {
            throw Error("Invalid fields in the form. Please try again.")
        }
    } catch (error) {
        console.error(error)
        res.render("status", {
            type: (edit) ? "post_edit_error" : "post_add_error"
        })
    }
 }

 export async function addFormProcessing(req: e.Request, res: e.Response) {
    save(req, res, false)
 }