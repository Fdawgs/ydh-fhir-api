const Fastify = require("fastify");
const plugin = require(".");
const getConfig = require("../../config");

describe("DB Plugin", () => {
	let config;
	let server;

	const query = "SELECT 'test' AS \"example\"";

	beforeAll(async () => {
		const DB_CONNECTION_STRING =
			"Server=localhost,1433;Database=master;User Id=sa;Password=Password!;Encrypt=true;TrustServerCertificate=true;";
		Object.assign(process.env, {
			DB_CONNECTION_STRING,
		});
		config = await getConfig();

		server = Fastify();
		server.register(plugin, config.database);
		server.route({
			method: "GET",
			url: "/",
			handler: async () => {
				const results = await server.db.query(query);
				return results;
			},
		});

		await server.ready();
	});

	afterAll(async () => {
		await server.close();
	});

	test("Should return 'test' string", async () => {
		const response = await server.inject({
			method: "GET",
			url: "/",
		});

		expect(JSON.parse(response.payload).recordsets[0][0].example).toBe(
			"test"
		);
		expect(response.statusCode).toBe(200);
	});
});
