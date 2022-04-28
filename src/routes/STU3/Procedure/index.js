// Import plugins
const cors = require("@fastify/cors");

/**
 * @author Frazer Smith
 * @description Sets routing options for server.
 * @param {object} server - Fastify instance.
 * @param {object} options - Route config values.
 * @param {object} options.cors - CORS settings.
 */
async function route(server, options) {
	// Register plugins
	server
		// Enable CORS if options passed
		.register(cors, {
			...options.cors,
			methods: ["GET"],
		});

	server.route({
		method: "GET",
		url: "/:id",
		handler: (req, res) => {
			res.send("ok");
		},
	});
}

module.exports = route;
