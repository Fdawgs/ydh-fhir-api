const fp = require("fastify-plugin");
const buildGetJwks = require("get-jwks");
const { createVerifier, createDecoder } = require("fast-jwt");

const getJwks = buildGetJwks({
	providerDiscovery: true, // Automatically obtain jwks_uri from the OpenID Provider Discovery Endpoint
	ttl: 900000, // Cache for 15 mins
});
const jwtDecoder = createDecoder({ complete: true });

/**
 * @author Frazer Smith
 * @description Decorator plugin that adds `verifyJWT` function
 * to authenticate JWTs using JWKS endpoint.
 * @param {object} server - Fastify instance.
 * @param {object[]} options - Plugin config values.
 * @param {string} options[].issuerDomain - URI of accepted principal that issued JWT.
 * @param {string|Array=} options[].allowedAudiences - Accepted recipient(s) that JWT is intended for.
 * @param {Array=} options[].allowedAlgorithms - Accepted signing algorithm(s).
 * @param {string|Array=} options[].allowedSubjects - Accepted subjects(s).
 * @param {string=} options[].maxAge - The maximum allowed age for tokens to still be valid.
 */
async function plugin(server, options) {
	server.decorate("verifyJWT", async (req, res) => {
		const header = req.headers.authorization;
		if (!header) {
			res.unauthorized("missing authorization header");
		}

		// Remove 'Bearer' from beginning of token
		const token = header.replace(/^Bearer/, "").trim();

		// JWT header always starts with "ey", which is "{" base64 encoded
		if (token.substring(0, 2) === "ey") {
			try {
				// Allow through aslong as the JWT is verified by atleast one JWKS public key
				await Promise.any(
					options.map(async (element) =>
						/**
						 * Verifier config options explicitly defined as functionality not tested;
						 * will stop changes to defaults in dependency from impacting auth
						 */
						createVerifier({
							algorithms: element?.allowedAlgorithms,
							allowedAud: element?.allowedAudiences,
							allowedIss: element.issuerDomain,
							allowedSub: element?.allowedSubjects,
							clockTimestamp: Date.now(),
							clockTolerance: 0,
							ignoreExpiration: false,
							ignoreNotBefore: false,
							key: await getJwks.getPublicKey({
								domain: element.issuerDomain,
								alg: jwtDecoder(token).header.alg,
								kid: jwtDecoder(token).header.kid,
							}),
							maxAge: element?.maxAge,
						})(token)
					)
				);
			} catch (err) {
				/**
				 * Retrieve and log errors from Promise.any()'s AggregateError,
				 * assists in diagnosing connection issues to JWKS endpoints
				 */
				err.errors.forEach((element) => {
					if (
						element.message !== "No matching JWK found in the set."
					) {
						req.log.error({ req, err: element }, element?.message);
					}
				});

				throw new Error("invalid authorization header");
			}
		} else {
			throw new Error("invalid authorization header");
		}
	});
}

module.exports = fp(plugin, {
	fastify: "3.x",
	name: "jwt-jwks-auth",
	dependencies: ["fastify-sensible"],
});
