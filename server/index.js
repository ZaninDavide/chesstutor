const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const zxcvbn = require("zxcvbn")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const db = require("./database")
const { ObjectID } = require("mongodb")
require("dotenv").config()

async function main() {
    const app = express()
    app.use(cors())
    app.use(bodyParser.json())

    const { User } = await db

    const PORT = process.env.PORT || 5000
    const SALT_ROUNDS = 10
    const SECRET = process.env.SECRET

    app.get("/", (req, res) => res.send("Hello World!"))

    app.post("/signup", async (req, res) => {
        if (!req.body.email || !req.body.password) {
            res.status(400).send(
                "You need to specify email and password in the body"
            )
            return
        }
        const passwordCheck = zxcvbn(req.body.password, [req.body.email])
        if (passwordCheck.score <= 2) {
            res.status(400).send(
                "Weak password - " +
                    passwordCheck.feedback.suggestions.join(", ")
            )
            return
        }

        const otherUserFound = await User.findOne({ email: req.body.email })
        if (otherUserFound) {
            res.status(400).send(
                "Another user with the same email already exists"
            )
            return
        }

        const { insertedId } = await User.insertOne({
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, SALT_ROUNDS),
        })

        const token = jwt.sign(
            {
                tokenType: "LOGIN",
                userId: insertedId,
            },
            SECRET
        )

        res.send(token)
    })

    app.post("/login", async (req, res) => {
        if (!req.body.email || !req.body.password) {
            res.status(400).send(
                "You need to specify email and password in the body"
            )
            return
        }

        const userFound = await User.findOne({ email: req.body.email })

        if (userFound === null) {
            res.status(400).send("Wrong email")
            return
        } else if (
            !(await bcrypt.compare(req.body.password, userFound.password))
        ) {
            res.status(400).send("Wrong password")
            return
        }

        const token = jwt.sign(
            {
                tokenType: "LOGIN",
                userId: userFound._id,
            },
            SECRET
        )

        res.send(token)
    })

    function checkAuthorization(req, res, next) {
        const header = req.headers["authorization"]

        if (!header || !header.startsWith("Bearer ")) {
            res.status(400).send("Set the authoriation token in the header")
            return
        }

        const token = header.substring("Bearer ".length)

        try {
            const decoded = jwt.verify(token, SECRET)
            req.auth = decoded
            next()
        } catch (e) {
            res.status(400).send("Invalid token")
            return
        }
    }

    app.get("/user", checkAuthorization, async (req, res) => {
        const userFound = await User.findOne({ _id: ObjectID(req.auth.userId) })
        res.send(
            JSON.stringify({
                ...userFound,
                password: undefined,
            })
        )
    })
    app.post("/user", checkAuthorization, async (req, res) => {
        await User.updateOne(
            { _id: ObjectID(req.auth.userId) },
            { $set: req.body }
        )
        res.send("Ok")
    })

    app.listen(PORT, () =>
        console.log(`Example app listening on port ${PORT}!`)
    )
}

main()
