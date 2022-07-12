const { faker } = require("@faker-js/faker/locale/en_GB");
const { chromium, firefox } = require("playwright");
const crypto = require("crypto");
const Fastify = require("fastify");
const createJWKSMock = require("mock-jwks").default;
const nock = require("nock");
const isHtml = require("is-html");
const startServer = require("./server");
const getConfig = require("./config");
const testConsts = require("../test_resources/constants");

const testId = faker.datatype.uuid();

const testAccessToken = `ydhfhir_${crypto.randomUUID().replace(/-/g, "_")}`;

const testSalt = crypto.randomBytes(16).toString("hex");
const testHash = crypto
	.scryptSync(testAccessToken, testSalt, 64)
	.toString("hex");

const dbHashedBearerToken = {
	recordsets: [
		[
			{
				name: faker.commerce.productName(),
				salt: testSalt,
				hash: testHash,
				scopes: JSON.stringify(["all"]),
			},
			// Tests "No match" error thrown in hashed-bearer-auth plugin
			{
				name: faker.commerce.productName(),
				salt: testSalt,
				hash: "brown",
				scopes: JSON.stringify(["all"]),
			},
		],
	],
};

// Expected Response Headers
const expResHeaders = {
	"cache-control": "no-store, max-age=0, must-revalidate",
	connection: "keep-alive",
	"content-length": expect.stringMatching(/\d+/),
	"content-security-policy": "default-src 'self';frame-ancestors 'none'",
	"content-type": expect.stringContaining("text/plain"),
	date: expect.any(String),
	"expect-ct": "max-age=0",
	expires: "0",
	"permissions-policy": "interest-cohort=()",
	pragma: "no-cache",
	"referrer-policy": "no-referrer",
	"strict-transport-security": "max-age=31536000; includeSubDomains",
	"surrogate-control": "no-store",
	vary: "Origin, accept-encoding",
	"x-content-type-options": "nosniff",
	"x-dns-prefetch-control": "off",
	"x-download-options": "noopen",
	"x-frame-options": "SAMEORIGIN",
	"x-permitted-cross-domain-policies": "none",
	"x-ratelimit-limit": expect.any(Number),
	"x-ratelimit-remaining": expect.any(Number),
	"x-ratelimit-reset": expect.any(Number),
};

const expResHeadersFhir = {
	...expResHeaders,
	"content-type": expect.stringContaining("application/fhir"),
};

const expResHeadersHtml = {
	...expResHeaders,
	"content-security-policy":
		"default-src 'self';base-uri 'self';img-src 'self' data:;object-src 'none';child-src 'self';frame-ancestors 'none';form-action 'self';upgrade-insecure-requests;block-all-mixed-content",
	"content-type": expect.stringContaining("text/html"),
	"x-xss-protection": "0",
};

const expResHeadersHtmlStatic = {
	...expResHeadersHtml,
	"accept-ranges": "bytes",
	"cache-control": "private, max-age=180",
	"content-length": expect.any(Number), // @fastify/static plugin returns content-length as number
	"content-security-policy":
		"default-src 'self';base-uri 'self';img-src 'self' data:;object-src 'none';child-src 'self' blob:;frame-ancestors 'none';form-action 'self';upgrade-insecure-requests;block-all-mixed-content;script-src 'self' 'unsafe-inline';style-src 'self' 'unsafe-inline'",
	etag: expect.any(String),
	"last-modified": expect.any(String),
	vary: "accept-encoding",
};
delete expResHeadersHtmlStatic.expires;
delete expResHeadersHtmlStatic.pragma;
delete expResHeadersHtmlStatic["surrogate-control"];

const expResHeadersJson = {
	...expResHeaders,
	"content-type": expect.stringContaining("application/json"),
};

const expResHeaders4xxErrors = {
	...expResHeadersJson,
	vary: "accept-encoding",
};
delete expResHeaders4xxErrors["keep-alive"];

const expResHeadersText = {
	...expResHeaders,
	"content-type": expect.stringContaining("text/plain"),
};

// eslint-disable-next-line no-unused-vars
const expResHeadersXml = {
	...expResHeaders,
	"content-security-policy":
		"default-src 'self';base-uri 'self';img-src 'self' data:;object-src 'none';child-src 'self';frame-ancestors 'none';form-action 'self';upgrade-insecure-requests;block-all-mixed-content",
	"content-type": expect.stringContaining("application/xml"),
	"x-xss-protection": "0",
};

describe("Server Deployment", () => {
	const invalidIssuerUri = "https://invalid-issuer.ydh.nhs.uk";
	const validIssuerUri = "https://valid-issuer.ydh.nhs.uk";
	let mockJwksServerOne;
	let mockJwksServerTwo;
	let token;

	beforeAll(() => {
		Object.assign(process.env, {
			DB_CONNECTION_STRING:
				"Server=localhost,1433;Database=master;User Id=sa;Password=Password!;Encrypt=true;TrustServerCertificate=true;",
		});

		nock.disableNetConnect();

		// Create an issuer that we have a valid JWT for
		nock(validIssuerUri)
			.get("/.well-known/openid-configuration")
			.reply(200, {
				jwks_uri: "https://valid-issuer.sft.nhs.uk/jwks",
			})
			.persist();
		mockJwksServerOne = createJWKSMock(
			"https://valid-issuer.sft.nhs.uk",
			"/jwks"
		);
		mockJwksServerOne.start();

		token = mockJwksServerOne.token({
			aud: "private",
			iss: validIssuerUri,
		});

		// Create an issuer that we do not have a valid JWT for
		nock(invalidIssuerUri)
			.get("/.well-known/openid-configuration")
			.reply(200, {
				jwks_uri: "https://invalid-issuer.sft.nhs.uk/jwks",
			})
			.persist();
		mockJwksServerTwo = createJWKSMock(
			"https://invalid-issuer.sft.nhs.uk",
			"/jwks"
		);
		mockJwksServerTwo.start();
	});

	afterAll(async () => {
		nock.cleanAll();
		nock.enableNetConnect();
		await mockJwksServerOne.stop();
		await mockJwksServerTwo.stop();
	});

	describe("Basic Auth", () => {
		let config;
		let server;

		beforeAll(async () => {
			Object.assign(process.env, {
				ADMIN_USERNAME: "admin",
				ADMIN_PASSWORD: "password",
			});
			config = await getConfig();

			server = Fastify();
			server.register(startServer, config);

			await server.ready();
		});

		afterAll(async () => {
			await server.close();
		});

		describe("/admin/access/bearer-token/:id Route", () => {
			const basicAuthTests = [
				{
					testName: "basic auth username invalid",
					authString: "invalidadmin:password",
				},
				{
					testName: "basic auth password invalid",
					authString: "admin:invalidpassword",
				},
				{
					testName: "basic auth username and password invalid",
					authString: "invalidadmin:invalidpassword",
				},
			];

			basicAuthTests.forEach((testObject) => {
				test(`Should return HTTP status code 401 if ${testObject.testName}`, async () => {
					const response = await server.inject({
						method: "GET",
						url: `/admin/access/bearer-token/${testId}`,
						headers: {
							authorization: `Basic ${Buffer.from(
								`${testObject.authString}`
							).toString("base64")}`,
						},
					});

					expect(JSON.parse(response.payload)).toEqual({
						error: "Unauthorized",
						message: "Unauthorized",
						statusCode: 401,
					});
					expect(response.headers).toEqual({
						...expResHeadersJson,
						vary: "accept-encoding",
					});
					expect(response.statusCode).toBe(401);
				});
			});

			test("Should return response if basic auth username and password valid", async () => {
				const response = await server.inject({
					method: "GET",
					url: `/admin/access/bearer-token/${testId}`,
					headers: {
						accept: "application/json",
						authorization: `Basic ${Buffer.from(
							"admin:password"
						).toString("base64")}`,
					},
				});

				expect(response.headers).toEqual(expResHeadersJson);
				expect(response.statusCode).not.toBe(401);
				expect(response.statusCode).not.toBe(406);
			});

			test("Should return HTTP status code 406 if basic auth username and password valid, and media type in `Accept` request header is unsupported", async () => {
				const response = await server.inject({
					method: "GET",
					url: "/admin/access/bearer-token",
					headers: {
						accept: "application/javascript",
						authorization: `Basic ${Buffer.from(
							"admin:password"
						).toString("base64")}`,
					},
				});

				expect(JSON.parse(response.payload)).toEqual({
					error: "Not Acceptable",
					message: "Not Acceptable",
					statusCode: 406,
				});
				expect(response.headers).toEqual(expResHeadersJson);
				expect(response.statusCode).toBe(406);
			});
		});
	});

	describe("Bearer and JWT Auth", () => {
		let config;
		let server;
		let currentEnv;

		beforeAll(() => {
			Object.assign(process.env, {
				BEARER_TOKEN_AUTH_ENABLED: "",
				JWT_JWKS_ARRAY: "",
			});
			currentEnv = { ...process.env };
		});

		afterEach(async () => {
			// Reset the process.env to default after each test
			Object.assign(process.env, currentEnv);

			await server.close();
		});

		const authTests = [
			{
				testName: "Bearer Token Auth Enabled and JWKS JWT Auth Enabled",
				envVariables: {
					BEARER_TOKEN_AUTH_ENABLED: true,
					JWT_JWKS_ARRAY: `[{"issuerDomain": "${validIssuerUri}"}]`,
				},
			},
			{
				testName:
					"Bearer Token Auth Enabled and JWKS JWT Auth Disabled",
				envVariables: {
					BEARER_TOKEN_AUTH_ENABLED: true,
					JWT_JWKS_ARRAY: "",
				},
			},
			{
				testName:
					"Bearer Token Auth Disabled and JWKS JWT Auth Enabled With One JWKS Endpoint",
				envVariables: {
					BEARER_TOKEN_AUTH_ENABLED: "",
					JWT_JWKS_ARRAY: `[{"issuerDomain": "${validIssuerUri}"}]`,
				},
			},
			{
				testName:
					"Bearer Token Auth Disabled and JWKS JWT Auth Enabled With One JWKS Endpoint with different aud",
				envVariables: {
					BEARER_TOKEN_AUTH_ENABLED: "",
					JWT_JWKS_ARRAY: `[{"issuerDomain": "${validIssuerUri}", "allowedAudiences": "ydh"}]`,
				},
			},
			{
				testName:
					"Bearer Token Auth Disabled and Jwks Jwt Auth Enabled With Two Jwks Endpoints (With Valid Key for One)",
				envVariables: {
					BEARER_TOKEN_AUTH_ENABLED: "",
					JWT_JWKS_ARRAY: `[{"issuerDomain": "${validIssuerUri}"},{"issuerDomain": "${invalidIssuerUri}"}]`,
				},
			},

			{
				testName:
					"Bearer Token Auth Disabled and Jwks Jwt Auth Enabled With One Jwks Endpoint (With an Invalid Key)",
				envVariables: {
					BEARER_TOKEN_AUTH_ENABLED: "",
					JWT_JWKS_ARRAY: `[{"issuerDomain": "${invalidIssuerUri}"}]`,
				},
			},
		];

		authTests.forEach((testObject) => {
			describe(`${testObject.testName}`, () => {
				beforeAll(async () => {
					Object.assign(process.env, testObject.envVariables);
					config = await getConfig();
				});

				beforeEach(async () => {
					server = Fastify();
					server.register(startServer, config);
					await server.ready();
				});

				describe("/STU3/Flag Route", () => {
					if (
						testObject?.envVariables?.BEARER_TOKEN_AUTH_ENABLED ===
						true
					) {
						test("Should return HL7 FHIR STU3 Flag Resource using a valid bearer token", async () => {
							const mockQueryFn = jest
								.fn()
								.mockResolvedValueOnce(dbHashedBearerToken)
								.mockResolvedValueOnce(testConsts.dbSTU3Flag);

							server.db = {
								query: mockQueryFn,
							};

							const response = await server.inject({
								method: "GET",
								url: "/STU3/Flag/126844-10",
								headers: {
									accept: "application/fhir+json",
									authorization: `Bearer ${testAccessToken}`,
								},
							});

							expect(JSON.parse(response.payload)).toHaveProperty(
								"resourceType",
								"Flag"
							);
							expect(response.headers).toEqual(expResHeadersFhir);
							expect(response.statusCode).toBe(200);
						});
					}

					test("Should fail to return HL7 FHIR STU3 Flag Resource using an invalid bearer token/JWT", async () => {
						const mockQueryFn = jest
							.fn()
							.mockResolvedValue(testConsts.dbError);

						server.db = {
							query: mockQueryFn,
						};

						const response = await server.inject({
							method: "GET",
							url: "/STU3/Flag/126844-10",
							headers: {
								accept: "application/fhir+json",
								authorization: "Bearer invalidtoken",
							},
						});

						expect(JSON.parse(response.payload)).toEqual({
							error: "Unauthorized",
							message: "invalid authorization header",
							statusCode: 401,
						});
						expect(response.headers).toEqual(expResHeadersJson);
						expect(response.statusCode).toBe(401);
					});

					test("Should fail to return HL7 FHIR STU3 Flag Resource if bearer token/JWT is missing", async () => {
						const mockQueryFn = jest
							.fn()
							.mockResolvedValue(testConsts.dbError);

						server.db = {
							query: mockQueryFn,
						};

						const response = await server.inject({
							method: "GET",
							url: "/STU3/Flag/126844-10",
							headers: {
								accept: "application/fhir+json",
							},
						});

						expect(JSON.parse(response.payload)).toEqual({
							error: "Unauthorized",
							message: "missing authorization header",
							statusCode: 401,
						});
						expect(response.headers).toEqual(expResHeadersJson);
						expect(response.statusCode).toBe(401);
					});

					if (
						testObject?.envVariables?.JWT_JWKS_ARRAY !== "" &&
						testObject?.envVariables?.JWT_JWKS_ARRAY !==
							`[{"issuerDomain": "${invalidIssuerUri}"}]` &&
						testObject?.envVariables?.JWT_JWKS_ARRAY !==
							`[{"issuerDomain": "${validIssuerUri}", "allowedAudiences": "ydh"}]`
					) {
						test("Should return HL7 FHIR STU3 Flag Resource using valid JWT against a valid Issuer", async () => {
							const mockQueryFn = jest
								.fn()
								.mockResolvedValue(testConsts.dbSTU3Flag);

							server.db = {
								query: mockQueryFn,
							};

							const response = await server.inject({
								method: "GET",
								url: "/STU3/Flag/126844-10",
								headers: {
									accept: "application/fhir+json",
									authorization: `Bearer ${token}`,
								},
							});

							expect(JSON.parse(response.payload)).toHaveProperty(
								"resourceType",
								"Flag"
							);
							expect(response.headers).toEqual(expResHeadersFhir);
							expect(response.statusCode).toBe(200);
						});
					}

					if (
						testObject?.envVariables?.JWT_JWKS_ARRAY === "" ||
						testObject?.envVariables?.JWT_JWKS_ARRAY ===
							`[{"issuerDomain": "${invalidIssuerUri}"}]` ||
						testObject?.envVariables?.JWT_JWKS_ARRAY ===
							`[{"issuerDomain": "${validIssuerUri}", "allowedAudiences": "ydh"}]`
					) {
						test("Should fail to return HL7 FHIR STU3 Flag Resource using valid JWT against a invalid Issuer", async () => {
							const mockQueryFn = jest
								.fn()
								.mockResolvedValueOnce(dbHashedBearerToken)
								.mockResolvedValueOnce(testConsts.dbSTU3Flag);

							server.db = {
								query: mockQueryFn,
							};

							const response = await server.inject({
								method: "GET",
								url: "/STU3/Flag/126844-10",
								headers: {
									accept: "application/fhir+json",
									authorization: `Bearer ${token}`,
								},
							});

							expect(JSON.parse(response.payload)).toEqual({
								error: "Unauthorized",
								message: "invalid authorization header",
								statusCode: 401,
							});
							expect(response.headers).toEqual(expResHeadersJson);
							expect(response.statusCode).toBe(401);
						});
					}
				});
			});
		});
	});

	describe("CORS", () => {
		let config;
		let server;
		let currentEnv;

		beforeAll(() => {
			Object.assign(process.env, {
				BEARER_TOKEN_AUTH_ENABLED: "",
				JWT_JWKS_ARRAY: "",
			});
			currentEnv = { ...process.env };
		});

		afterEach(async () => {
			// Reset the process.env to default after each test
			Object.assign(process.env, currentEnv);

			await server.close();
		});

		const corsTests = [
			{
				testName: "CORS Disabled",
				envVariables: {
					CORS_ORIGIN: "",
				},
				request: {
					headers: {
						origin: null,
					},
				},
				expected: {
					response: {
						headers: {
							basic: expResHeaders,
							fhir: expResHeadersFhir,
							json: expResHeadersJson,
							text: expResHeadersText,
						},
					},
				},
			},
			{
				testName: "CORS Enabled",
				envVariables: {
					CORS_ORIGIN: true,
				},
				request: {
					headers: {
						origin: "https://notreal.ydh.nhs.uk",
					},
				},
				expected: {
					response: {
						headers: {
							basic: {
								...expResHeaders,
								"access-control-allow-origin":
									"https://notreal.ydh.nhs.uk",
							},
							fhir: {
								...expResHeadersFhir,
								"access-control-allow-origin":
									"https://notreal.ydh.nhs.uk",
							},
							json: {
								...expResHeadersJson,
								"access-control-allow-origin":
									"https://notreal.ydh.nhs.uk",
							},
							text: {
								...expResHeadersText,
								"access-control-allow-origin":
									"https://notreal.ydh.nhs.uk",
							},
						},
					},
				},
			},
			{
				testName: "Cors Enabled and Set to String",
				envVariables: {
					CORS_ORIGIN: "https://notreal.ydh.nhs.uk",
				},
				request: {
					headers: {
						origin: "https://notreal.ydh.nhs.uk",
					},
				},
				expected: {
					response: {
						headers: {
							basic: {
								...expResHeaders,
								"access-control-allow-origin":
									"https://notreal.ydh.nhs.uk",
							},
							fhir: {
								...expResHeadersFhir,
								"access-control-allow-origin":
									"https://notreal.ydh.nhs.uk",
							},
							json: {
								...expResHeadersJson,
								"access-control-allow-origin":
									"https://notreal.ydh.nhs.uk",
							},
							text: {
								...expResHeadersText,
								"access-control-allow-origin":
									"https://notreal.ydh.nhs.uk",
							},
						},
					},
				},
			},
			{
				testName: "Cors Enabled and Set to Array of Strings",
				envVariables: {
					CORS_ORIGIN: [
						"https://notreal.ydh.nhs.uk",
						"https://notreal.sft.nhs.uk",
					],
				},
				request: {
					headers: {
						origin: "https://notreal.ydh.nhs.uk",
					},
				},
				expected: {
					response: {
						headers: {
							basic: {
								...expResHeaders,
								"access-control-allow-origin":
									"https://notreal.ydh.nhs.uk",
							},
							fhir: {
								...expResHeadersFhir,
								"access-control-allow-origin":
									"https://notreal.ydh.nhs.uk",
							},
							json: {
								...expResHeadersJson,
								"access-control-allow-origin":
									"https://notreal.ydh.nhs.uk",
							},
							text: {
								...expResHeadersText,
								"access-control-allow-origin":
									"https://notreal.ydh.nhs.uk",
							},
						},
					},
				},
			},
			{
				testName: "Cors Enabled and Set to Wildcard",
				envVariables: {
					CORS_ORIGIN: "*",
				},
				request: {
					headers: {
						origin: "https://notreal.ydh.nhs.uk",
					},
				},
				expected: {
					response: {
						headers: {
							basic: {
								...expResHeaders,
								"access-control-allow-origin": "*",
							},
							fhir: {
								...expResHeadersFhir,
								"access-control-allow-origin": "*",
							},
							json: {
								...expResHeadersJson,
								"access-control-allow-origin": "*",
							},
							text: {
								...expResHeadersText,
								"access-control-allow-origin": "*",
							},
						},
					},
				},
			},
		];

		corsTests.forEach((testObject) => {
			describe(`${testObject.testName}`, () => {
				beforeAll(async () => {
					Object.assign(process.env, testObject.envVariables);
					config = await getConfig();
				});

				beforeEach(async () => {
					server = Fastify();
					server.register(startServer, config);
					await server.ready();
				});

				describe("/admin/healthcheck Route", () => {
					test("Should return `ok`", async () => {
						const response = await server.inject({
							method: "GET",
							url: "/admin/healthcheck",
							headers: {
								accept: "text/plain",
								origin: testObject.request.headers.origin,
							},
						});

						expect(response.payload).toBe("ok");
						expect(response.headers).toEqual(
							testObject.expected.response.headers.text
						);
						expect(response.statusCode).toBe(200);
					});

					test("Should return HTTP status code 406 if media type in `Accept` request header is unsupported", async () => {
						const response = await server.inject({
							method: "GET",
							url: "/admin/healthcheck",
							headers: {
								accept: "application/javascript",
								origin: testObject.request.headers.origin,
							},
						});

						expect(JSON.parse(response.payload)).toEqual({
							error: "Not Acceptable",
							message: "Not Acceptable",
							statusCode: 406,
						});
						expect(response.headers).toEqual(
							testObject.expected.response.headers.json
						);
						expect(response.statusCode).toBe(406);
					});
				});

				describe("/STU3/Flag Route", () => {
					test("Should return HL7 FHIR STU3 Flag Resource", async () => {
						const mockQueryFn = jest
							.fn()
							.mockResolvedValue(testConsts.dbSTU3Flag);

						server.db = {
							query: mockQueryFn,
						};

						const response = await server.inject({
							method: "GET",
							url: "/STU3/Flag/126844-10",
							headers: {
								accept: "application/fhir+json",
								origin: testObject.request.headers.origin,
							},
						});

						expect(JSON.parse(response.payload)).toHaveProperty(
							"resourceType",
							"Flag"
						);
						expect(response.headers).toEqual(
							testObject.expected.response.headers.fhir
						);
						expect(response.statusCode).toBe(200);
					});

					test("Should return HL7 FHIR STU3 Bundle Resource using search route and query string params", async () => {
						const mockQueryFn = jest
							.fn()
							.mockResolvedValue(testConsts.dbSTU3Flag);

						server.db = {
							query: mockQueryFn,
						};

						const response = await server.inject({
							method: "GET",
							url: "/STU3/Flag",
							headers: {
								accept: "application/fhir+json",
								origin: testObject.request.headers.origin,
							},
							query: {
								"patient.identifier": "484125",
							},
						});

						expect(JSON.parse(response.payload)).toHaveProperty(
							"resourceType",
							"Bundle"
						);
						expect(response.headers).toEqual(
							testObject.expected.response.headers.fhir
						);
						expect(response.statusCode).toBe(200);
					});

					// Only applicable to "CORS Enabled" test
					if (testObject.envVariables.CORS_ORIGIN === true) {
						test("Should not set 'access-control-allow-origin' if configured to reflect 'origin' in request header, but 'origin' missing", async () => {
							const mockQueryFn = jest
								.fn()
								.mockResolvedValue(testConsts.dbSTU3Flag);

							server.db = {
								query: mockQueryFn,
							};

							const response = await server.inject({
								method: "GET",
								url: "/STU3/Flag/126844-10",
								headers: {
									accept: "application/fhir+json",
								},
							});

							expect(JSON.parse(response.payload)).toHaveProperty(
								"resourceType",
								"Flag"
							);
							expect(response.headers).toEqual(expResHeadersFhir);
							expect(response.statusCode).toBe(200);

							await server.close();
						});
					}

					test("Should return HTTP status code 406 if content-type in `Accept` request header unsupported", async () => {
						const response = await server.inject({
							method: "GET",
							url: "/STU3/Flag/126844-10",
							headers: {
								accept: "application/javascript",
								origin: testObject.request.headers.origin,
							},
						});

						expect(JSON.parse(response.payload)).toEqual({
							error: "Not Acceptable",
							message: "Not Acceptable",
							statusCode: 406,
						});
						expect(response.headers).toEqual(
							testObject.expected.response.headers.json
						);
						expect(response.statusCode).toBe(406);
					});
				});

				describe("Undeclared Route", () => {
					test("Should return HTTP status code 404 if route not found", async () => {
						const response = await server.inject({
							method: "GET",
							url: "/invalid",
							headers: {
								accept: "application/fhir+json",
								origin: testObject.request.headers.origin,
							},
						});

						expect(JSON.parse(response.payload)).toEqual({
							error: "Not Found",
							message: "Route GET:/invalid not found",
							statusCode: 404,
						});
						expect(response.headers).toEqual(
							expResHeaders4xxErrors
						);
						expect(response.statusCode).toBe(404);
					});
				});
			});
		});
	});

	describe("API Documentation", () => {
		let config;
		let server;

		let browser;
		let page;

		beforeAll(async () => {
			Object.assign(process.env, {
				SERVICE_HOST: "localhost",
				SERVICE_PORT: "8204",
				HTTPS_PFX_PASSPHRASE: "",
				HTTPS_PFX_FILE_PATH: "",
				HTTPS_SSL_CERT_PATH: "",
				HTTPS_SSL_KEY_PATH: "",
				HTTPS_HTTP2_ENABLED: "",
			});
			config = await getConfig();

			// Turn off logging for test runs
			delete config.fastifyInit.logger;
			server = Fastify(config.fastifyInit);
			server.register(startServer, config);

			await server.listen(config.fastify);
		});

		afterAll(async () => {
			await server.close();
		});

		describe("Content", () => {
			describe("/docs Route", () => {
				test("Should return HTML", async () => {
					const response = await server.inject({
						method: "GET",
						url: "/docs",
						headers: {
							accept: "text/html",
						},
					});

					expect(isHtml(response.payload)).toBe(true);
					expect(response.headers).toEqual(expResHeadersHtmlStatic);
					expect(response.statusCode).toBe(200);
				});
			});
		});

		describe("Frontend", () => {
			afterEach(async () => {
				await page.close();
				await browser.close();
			});

			// Webkit not tested as it is flakey in context of Playwright
			const browsers = [chromium, firefox];
			browsers.forEach((browserType) => {
				test(`Should render docs page without error components - ${browserType.name()}`, async () => {
					browser = await browserType.launch();
					page = await browser.newPage();

					await page.goto("http://localhost:8204/docs");
					expect(await page.title()).toBe(
						"HL7® FHIR® API | Documentation"
					);
					/**
					 * Checks redoc has not rendered an error component
					 * https://github.com/Redocly/redoc/blob/master/src/components/ErrorBoundary.tsx
					 */
					const heading = page.locator("h1 >> nth=0");
					await heading.waitFor();

					expect(await heading.textContent()).not.toEqual(
						expect.stringMatching(/something\s*went\s*wrong/i)
					);
				});
			});
		});
	});
});
