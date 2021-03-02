const { users } = require("../funcList.js");

const signIn = (req, res, db, bcrypt) => {
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
};

module.exports = { signIn };
