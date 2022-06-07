const S = require("fluent-json-schema");

const tags = ["STU3"];

const dateTimeSearchPattern =
	/^(?:eq|ne|ge|le|gt|lt|sa|eb|ap|)\d{4}(?:-[0-1]\d-[0-3]\d(?:t(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?))?)?$/im;

const dateTimeSearchPatternExamples = [
	"2022",
	"2022-01-13",
	"2022-01-13T00:00:01Z",
	"2022-01-13T00:00:01.001Z",
	"2022-01-13T00:00:01+01:00",
	"ge2022",
	"ge2022-01-13",
	"ge2022-01-13T00:00:01Z",
	"ge2022-01-13T00:00:01.001Z",
	"ge2022-01-13T00:00:01+01:00",
];

/**
 * Fastify uses AJV for JSON Schema Validation,
 * see https://www.fastify.io/docs/latest/Validation-and-Serialization/
 *
 * Input validation protects against XSS, HPP, and most injection attacks.
 */
const stu3FlagReadSchema = {
	tags,
	summary: "Read an HL7 FHIR STU3 Flag resource",
	description: "Return a single HL7 FHIR STU3 Flag resource.",
	operationId: "getReadStu3Flag",
	produces: ["application/fhir+json", "application/fhir+xml"],
	params: S.object()
		.prop(
			"id",
			S.string()
				.description("Logical id of artifact")
				.examples(["999999-99"])
				.pattern(/^[\d-]+$/m)
		)
		.required(["id"]),
	response: {
		// TODO: build out 200 response object
		// 200: S.object(),
		401: S.ref("responses#/definitions/unauthorized").description(
			"Unauthorized"
		),
		// 404: S.ref(
		// 	"responses#/definitions/notFoundOperationOutcome"
		// ).description("Not Found"),
		406: S.ref("responses#/definitions/notAcceptable").description(
			"Not Acceptable"
		),
		429: S.ref("responses#/definitions/tooManyRequests").description(
			"Too Many Requests"
		),
		500: S.ref("responses#/definitions/internalServerError").description(
			"Internal Server Error"
		),
		503: S.ref("responses#/definitions/serviceUnavailable").description(
			"Service Unavailable"
		),
	},
};

const stu3FlagSearchSchema = {
	tags,
	summary: "Search HL7 FHIR STU3 Flag resources",
	description: "Return a bundle of HL7 FHIR STU3 Flag resources.",
	operationId: "getSearchStu3Flag",
	produces: ["application/fhir+json", "application/fhir+xml"],
	query: S.object()
		.prop(
			"date",
			S.anyOf([
				S.string()
					.description("Time period when flag is active")
					.examples(dateTimeSearchPatternExamples)
					.pattern(dateTimeSearchPattern),
				S.array()
					.items(
						S.string()
							.description("Time period when flag is active")
							.examples(dateTimeSearchPatternExamples)
							.pattern(dateTimeSearchPattern)
					)
					.minItems(2)
					.maxItems(2)
					.uniqueItems(true),
			])
		)
		.prop(
			"patient",
			S.number().description(
				"The identity of a subject to list flags for"
			)
		)
		.prop(
			"patient.identifier",
			S.string().description(
				"The identity of a subject to list flags for"
			)
		)
		.prop("status", S.string().enum(["active", "inactive"])),
	response: {
		// TODO: build out 200 response object
		// 200: S.object(),
		401: S.ref("responses#/definitions/unauthorized").description(
			"Unauthorized"
		),
		// 404: S.ref(
		// 	"responses#/definitions/notFoundOperationOutcome"
		// ).description("Not Found"),
		406: S.ref("responses#/definitions/notAcceptable").description(
			"Not Acceptable"
		),
		429: S.ref("responses#/definitions/tooManyRequests").description(
			"Too Many Requests"
		),
		500: S.ref("responses#/definitions/internalServerError").description(
			"Internal Server Error"
		),
		503: S.ref("responses#/definitions/serviceUnavailable").description(
			"Service Unavailable"
		),
	},
};

module.exports = {
	stu3FlagReadSchema,
	stu3FlagSearchSchema,
};
