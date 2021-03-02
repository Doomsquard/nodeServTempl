const { users } = require("../funcList.js");

const getAllUsers = (req, res) => {
	users.getAll().then((data) => res.json(data));
};
module.exports = { getAllUsers };
