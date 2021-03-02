const signUp = (req, res, db, bcrypt) => {
	const { nickname, email, password } = req.body;
	const salt = bcrypt.genSaltSync(10);
	const hash = bcrypt.hashSync(password, salt);

	db.select("email")
		.from("users")
		.where("email", "=", email)
		.then((user) =>
			user.length
				? res.status(400).json("Sorry, but email is busy")
				: null
		);

	db.select("nickname")
		.from("users")
		.where("nickname", "=", nickname)
		.then((user) =>
			user.length
				? res.status(400).json("Sorry, but nickname is busy")
				: null
		);

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
};

module.exports = {
	signUp,
};
