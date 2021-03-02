const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");

const { db } = require("./knexDB.js");
const { currentUser } = require("./funcList.js");
const { allFromUsers } = require("./funcList.js");

const { signIn } = require("./controllers/signin.js");
const { signUp } = require("./controllers/signUp.js");
const { getUser } = require("./controllers/getUser.js");
const { getAllUsers } = require("./controllers/getAllUsers.js");

const port = 3000;
const app = express();

app.use(bodyParser.json());
app.use(cors());

//-----------------------------------------GET--------------------------------------------
app.get("/", (req, res) => getAllUsers(req, res));

app.get("/users/:id", (req, res) => getUser(req, res));

//-----------------------------------------POST-------------------------------------------

app.post("/signin", (req, res) => signIn(req, res, db, bcrypt));

app.post("/signup", (req, res) => signUp(req, res, db, bcrypt));

//------------------------------------PUT------------------------------------------

app.listen(port, () => {
	`server start in port:${port}`;
});
