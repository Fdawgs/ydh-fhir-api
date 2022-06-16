const fp = require("fastify-plugin");
const bearer = require("@fastify/bearer-auth");
const { scrypt } = require("crypto");
const secJSON = require("secure-json-parse");
const { promisify } = require("util");

const scryptAsync = promisify(scrypt);

/**
 * @author Frazer Smith
 * @description Decorator plugin that adds bearer token authentication,
 * querying a database for hashed and salted bearer token keys.
 * @param {object} server - Fastify instance.
 */
async function plugin(server) {
	server.register(bearer, {
		addHook: false,
		errorResponse:
			/* istanbul ignore next: @fastify/auth handles errors, response set for posterity */
			(err) => ({
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

			const authorized = await Promise.any(
				tokens.map((token) =>
					scryptAsync(key, token.salt, 64).then((derivedKey) => {
						if (derivedKey.toString("hex") === token.hash) {
							return token;
						}

						throw new Error("No match");
					})
				)
			)
				.then((token) => {
					req.scopes = secJSON.parse(token.scopes);

					req.log.info({ client: token.name });
					return true;
				})
				.catch(() => false);

			return authorized;
		},
	});
}

module.exports = fp(plugin, {
	fastify: "3.x",
	name: "hashed-bearer-auth",
	dependencies: ["db"],
});
