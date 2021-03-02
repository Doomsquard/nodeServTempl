const { users } = require("../funcList.js");

const getUser = (req, res) => {
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
};

module.exports = {
	getUser,
};
