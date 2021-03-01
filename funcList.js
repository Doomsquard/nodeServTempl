// const db = require("knex")({
// 	client: "pg",
// 	connection: {
// 		host: "127.0.0.1",
// 		user: "postgres",
// 		password: "sqladmin",
// 		database: "testdb",
// 	},
// });
const { db } = require("./knexDB.js");

class funcList {
	constructor(db, table) {
		this.db = db;
		this.table = table;
	}

	getAll() {
		return this.db
			.select("*")
			.from(this.table)
			.then((data) => data);
	}

	getCurrentItem(id) {
		return this.db.select("*").from(this.table).where({ id });
	}
}

const users = new funcList(db, "users");

const login = new funcList(db, "login");

module.exports = {
	users,
	login,
};
