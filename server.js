const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");

const { db } = require("./knexDB.js");
const { currentUser } = require("./funcList.js");
const { allFromUsers } = require("./funcList.js");
const { users, login } = require("./funcList.js");

const port = 3000;
const app = express();

app.use(bodyParser.json());
app.use(cors());

//-----------------------------------------GET--------------------------------------------
app.get("/", (req, res) => {
	users.getAll().then((data) => res.json(data));
});

app.get("/users/:id", (req, res) => {
	const { id } = req.params;
	users
		.getCurrentItem(id)
		.then((user) =>
			user.length
				? res.json(user[0])
				: res.status(400).json("user not found")
		)
		.catch((err) => {
			res.status(400);
			res.send(err);
		});
});

//-----------------------------------------POST-------------------------------------------

app.post("/signin", (req, res) => {
	const { email, password } = req.body;

	db.select("*")
		.from("login")
		.where("email", "=", email)
		.then((data) => {
			const isValidPas = bcrypt.compareSync(password, data[0].hash);

			db.select("id")
				.from("users")
				.where("email", "=", email)
				.then((id) => {
					users.getCurrentItem(id[0].id).then((item) => {
						db.select("id")
							.from("users")
							.where("id", "=", id[0].id)
							.increment("entries", 1)
							.returning("entries")
							.then((data) => data);
						item[0].email === email && isValidPas
							? users
									.getCurrentItem(id[0].id)
									.then((user) => res.json(user[0]))
							: res.send("password or login is not correct");
					});
				});
		})
		.catch((err) => res.status(400).json("user not found"));
});

app.post("/signup", (req, res) => {
	const { nickname, email, password } = req.body;
	const salt = bcrypt.genSaltSync(10);
	const hash = bcrypt.hashSync(password, salt);

	db.transaction((trx) => {
		trx.insert({
			hash,
			email,
		})
			.into("login")
			.returning("email")
			.then((loginEmail) => {
				return trx("users")
					.returning("*")
					.insert({
						email: loginEmail[0],
						nickname: nickname,
						entries: 0,
						joined: new Date(),
					})
					.then((user) => res.json(user));
			})
			.then(trx.commit)
			.catch(trx.rollback);
	})
		.then((data) => res.json(data))
		.catch((err) => res.json(err));
});

//------------------------------------PUT------------------------------------------

app.listen(port, () => {
	`server start in port:${port}`;
});
