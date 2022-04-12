/* eslint-disable promise/prefer-await-to-callbacks */
const fp = require("fastify-plugin");
const { createVerifier, createDecoder } = require("fast-jwt");
const jwksClient = require("jwks-rsa");

/**
 * @author Frazer Smith
 * @author Mark Hunt
 * @description Retrieve signing key from JWKS endpoint.
 * @param {string} token - JSON web token.
 * @param {string} jwksUri - Endpoint containing JSON Web Key Set (JWKS).
 * @returns {Promise<string>} Signing key on resolve, error text on rejection.
 */
async function getSigningKey(token, jwksUri) {
	return new Promise((resolve, reject) => {
		const client = jwksClient({
			strictSsl: true, // Default value
			jwksUri,
		});

		const jwtDecoder = createDecoder({ complete: true });

		client.getSigningKey(jwtDecoder(token).header.kid, (err, key) => {
			if (err) {
				reject(err);
			} else {
				const signingKey = key.publicKey || key.rsaPublicKey;
				resolve(signingKey);
			}
		});
	});
}

/**
 * @author Frazer Smith
 * @description Decorator plugin that adds `verifyJWT` function
 * to authenticate JWTs using JWKS endpoint.
 * @param {object} server - Fastify instance.
 * @param {object[]} options - Plugin config values.
 * @param {string} options[].jwksEndpoint - URL of endpoint containing JWKS public keys.
 * @param {string|Array=} options[].allowedAudiences - Accepted recipient(s) that JWT is intended for.
 * @param {Array=} options[].allowedAlgorithms - Accepted signing algorithm(s).
 * @param {string|Array=} options[].allowedIssuers - Accepted principal(s) that issued JWT.
 * @param {string|Array=} options[].allowedSubjects - Accepted subjects(s).
 * @param {string=} options[].maxAge - The maximum allowed age for tokens to still be valid.
 */
async function plugin(server, options) {
	server.decorate("verifyJWT", async (req, res) => {
		const header = req.headers.authorization;
		if (!header) {
			res.badRequest("Missing authorization header");
		}

		// Remove 'Bearer' from beginning of token
		const token = header.replace(/^Bearer/, "").trim();

		try {
			// Allow through aslong as the JWT is authenticated by atleast one JWKS endpoint
			await Promise.any(
				options.map(async (element) => {
					const signingKey = await getSigningKey(
						token,
						element?.jwksEndpoint
					);

					/**
					 * Verifier config options explicitly defined as functionality not tested;
					 * will stop changes to defaults in dependency from impacting auth
					 */
					const jwtVerifier = createVerifier({
						algorithms: element?.allowedAlgorithms,
						allowedAud: element?.allowedAudiences,
						allowedIss: element?.allowedIssuers,
						allowedSub: element?.allowedSubjects,
						cache: true,
						cacheTTL: 600000,
						clockTimestamp: Date.now(),
						clockTolerance: 0,
						ignoreExpiration: false,
						ignoreNotBefore: false,
						key: signingKey,
						maxAge: element?.maxAge,
					});

					await jwtVerifier(token);
				})
			);
		} catch (err) {
			throw new Error("invalid authorization header");
		}
	});
}

module.exports = fp(plugin, {
	fastify: "3.x",
	name: "jwt-jwks-auth",
	dependencies: ["fastify-sensible"],
});
