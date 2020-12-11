import e from "express"
import * as bcrypt from "bcrypt"
import * as model from "../models/author-model"
import "../session-data"

export function loginForm(req: e.Request, res: e.Response) {
    res.render("login")
}

export async function loginFormProcessing(req: e.Request, res: e.Response) {
    const username = req.body.username || ""
    const password = req.body.password || ""
    const author = new model.Author(username, password)

    try {
        if (!author.isValid())
            throw Error("Invalid login parameters")
        const retrAuthor = 
            await model.AuthorDAO.getInstance().findByUsername(author.username)
        if (await bcrypt.compare(author.password, retrAuthor.password)) {
            req.session.authenticated = true
            req.session.authorName = author.username
            req.flash("type", "login")
            req.flash("name", retrAuthor.fullname)
            res.redirect("/")
        } else {
            throw Error("Login credentials did not match")
        }
    } catch (error) {
        req.session.authenticated = false
        console.error(error)
        res.render("status", {type: "invalid_login"})
    }
}

export function logout(req: e.Request, res: e.Response) {
    if (req.session.authenticated) {
        req.session.authenticated = false
        req.session.authorName = ""
        req.flash("type", "logout")
    }
    res.redirect("/")
}