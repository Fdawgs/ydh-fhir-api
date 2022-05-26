const fp = require("fastify-plugin");

const mssql = require("mssql");

/**
 * @author Frazer Smith
 * @description Decorator plugin that adds Microsoft SQL Server client.
 * @param {object} server - Fastify instance.
 * @param {object} options - Plugin config values.
 * @param {string} options.connection - Database connection string.
 * Example connection string: `mssql://username:password@localhost/database`.
 */
async function plugin(server, options) {
	try {
		server.log.info("Connecting to MSSQL DB");
		await mssql.connect(options.connection);
		server.log.info("MSSQL DB connection opened");

		server.decorate("db", mssql);
		server.addHook("onClose", async () => {
			server.log.info("Closing MSSQL DB connection");
			await mssql.close();
			server.log.info("MSSQL DB connection closed");
		});
	} catch (err) /* istanbul ignore next */ {
		server.log.error(`Unable to connect to MSSQL DB instance: ${err}`);
		process.exit(1);
	}
}

module.exports = fp(plugin, { fastify: "3.x", name: "db" });
