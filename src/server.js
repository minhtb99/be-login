const fs = require("fs");
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors')
app.use(cors())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const TOKEN_SECRET = "b91028378997c0b3581821456edefd0ec7958f953f8c1a6dd856e2de27f0d7e0fb1a01cda20d1a6890267e629f0ff5dc7ee46bce382aba62d13989614417606a"

let users = [];

fs.readFile("./src/data/users.json", "utf8", (err, jsonString) => {
    if (err) {
        console.log("File read failed:", err);
        return;
    }
    users = JSON.parse(jsonString)
});

app.post('/login', (req, res) => {
    const reqUsername = req.body.username;
    const reqPassword = req.body.password;

    const user = users.find(item => item.email === reqUsername)

    if (user) {
        try {
            const match = bcrypt.compareSync(reqPassword, user.password_hash);

            const accessToken = jwt.sign(JSON.stringify(user), TOKEN_SECRET)
            if (match) {
                res.json({ accessToken: accessToken, name: user.name });
            } else {
                res.json({ message: "Invalid Credentials" });
            }
        } catch (e) {
            console.log(e)
        }
    } else {
        res.json({ message: "Invalid Credentials" });
    }



});

app.listen(8888, function () {
    console.log('Node app is running on port 8888');
});
module.exports = app;