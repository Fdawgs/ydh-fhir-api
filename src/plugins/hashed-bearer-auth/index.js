const fp = require("fastify-plugin");
const bearer = require("@fastify/bearer-auth");
const crypto = require("crypto");
const secJSON = require("secure-json-parse");

/**
 * @author Frazer Smith
 * @description Decorator plugin that adds bearer token authentication,
 * querying a database for hashed and salted bearer token keys.
 * @param {object} server - Fastify instance.
 */
async function plugin(server) {
	server.register(bearer, {
		addHook: false,
		errorResponse: (err) => ({
			statusCode: 401,
			error: "Unauthorized",
			message: err.message,
		}),
		auth: async (key, req) => {
			const results = await server.db.query(
				`SELECT DISTINCT
					name,
                    hash,
                    salt,
                    scopes
                FROM access.tokens
                WHERE expires > CURRENT_TIMESTAMP`
			);

			const tokens = results?.recordsets?.[0];

			let authorized = false;
			for (let index = 0; index < tokens.length; index += 1) {
				// eslint-disable-next-line security/detect-object-injection
				const token = tokens[index];
				// TODO: look at making this async with Promise.any and Array.map
				/* istanbul ignore else */
				if (
					crypto.scryptSync(key, token.salt, 64).toString("hex") ===
					token.hash
				) {
					authorized = true;
					req.scopes = secJSON.parse(token.scopes);

					req.log.info({ client: token.name });
					break;
				}
			}

			return authorized;
		},
	});
}

module.exports = fp(plugin, {
	fastify: "3.x",
	name: "hashed-bearer-auth",
	dependencies: ["db"],
});
