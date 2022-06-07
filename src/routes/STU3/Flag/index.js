// Import plugins
const cors = require("@fastify/cors");

// Import utils
const escSq = require("../../../utils/escape-single-quotes");

const { stu3FlagReadSchema, stu3FlagSearchSchema } = require("./schema");
const { stu3FlagGetSearch } = require("./query");

// TODO: plugin or util
/**
 * @author Frazer Smith
 * @description Build HL7 FHIR STU3 Bundle Resource that adheres to the HL7 spec.
 * See see https://www.hl7.org/fhir/STU3/bundle.html.
 * @param {string} requestUri - URI that search GET request was made to.
 * @returns {object} HL7 FHIR STU3 Flag Resource.
 */
function buildStu3BundleResource(requestUri) {
	return {
		resourceType: "Bundle",
		type: "searchset",
		total: 0,
		link: [{ relation: "self", url: requestUri }],
		entry: [],
	};
}

/**
 * @author Frazer Smith
 * @description Build HL7 FHIR STU3 Flag Resource, which adheres to its Care-Connect profile, from database result.
 * See https://fhir.hl7.org.uk/STU3/StructureDefinition/CareConnect-Flag-1.
 * @param {object} result - Database query result.
 * @param {string} result.id - id - Logical id of this artifact.
 * @param {('active'|'inactive')} result.status - status - Indicates whether this flag is active and
 * needs to be displayed to a user, or whether it is no longer needed.
 * @param {string=} result.category_coding_code - category.coding[0].code - Symbol in syntax defined by the system.
 * @param {string=} result.category_coding_display - category.coding[0].display - Representation defined by the system.
 * @param {string=} result.code_coding_code - code.coding[0].code - Symbol in syntax defined by TrakCare.
 * @param {string=} result.code_coding_display - code.coding[0].display - Representation defined by TrakCare.
 * @param {string=} result.code_coding_snomed_code - code.coding[1].code - Symbol in syntax defined by SNOMED.
 * @param {string=} result.code_coding_snomed_display - code.coding[1].code - Symbol in syntax defined by SNOMED.
 * @param {string} result.last_updated - meta.lastUpdated - When the resource version last changed.
 * @param {string=} result.period_start period.start - Starting time with inclusive boundary.
 * @param {string=} result.period_end - period.end - End time with inclusive boundary, if not ongoing.
 * @param {string} result.subject_reference - subject.reference - The patient, location, group, organization, or
 * practitioner, etc. this is about record this flag is associated with.
 * @param {object=} req - Fastify Request object.
 * @returns {object} HL7 FHIR STU3 Flag Resource.
 */
function buildStu3FlagResource(result, req) {
	const resource = {
		/**
		 * Hard-coding meta profile and resourceType into resource
		 * as this should not be changed for this resource, ever
		 */
		resourceType: "Flag",
		id: result.id,
		meta: {
			versionId: "1", // TrakCare does not hold historic versions of records, hard-coded to 1
			lastUpdated:
				result.last_updated.toString().substring(0, 1) !== "T" &&
				result.last_updated.toString().substring(0, 4) !== "1900"
					? result.last_updated
					: undefined,
			profile: [
				"https://fhir.hl7.org.uk/STU3/StructureDefinition/CareConnect-Flag-1",
			],
			tag: [
				{
					system: "https://fhir.blackpear.com/ui/shared-care-record-visibility",
					code: "summary",
					display: "Display in Summary and Detail View",
				},
			],
		},

		status: result.status,

		subject: {
			// cleanObject will remove the undefined url key if present
			reference:
				req !== undefined
					? new URL(
							`/STU3/Patient/${result.subject_reference}`,
							`${req.protocol}://${req.hostname}`
					  ).href
					: undefined,
		},
	};

	/**
	 * Add SIDeR specific tags
	 * Set tag to 'Do not Display' if not in set of accepted SNOMED codes or if inactive
	 */
	const siderAcceptedFlagSnomedCodes = [
		"13790001000004100",
		"15188001",
		"32000005",
		"713673000",
	];
	if (
		result.status === "inactive" ||
		!siderAcceptedFlagSnomedCodes.includes(result?.code_coding_snomed_code)
	) {
		resource.meta.tag[0] = {
			system: "https://fhir.blackpear.com/ui/shared-care-record-visibility",
			code: "none",
			display: "Do not Display",
		};
	}

	// Add category
	if (result?.category_coding_code) {
		resource.category = {
			coding: [
				{
					system: "https://trakcare.ydh.nhs.uk",
					code: result.category_coding_code,
					display: result?.category_coding_display,
				},
			],
		};
	}

	// Add coding
	if (result?.code_coding_code || result?.code_snomed_code) {
		resource.code = {
			coding: [],
		};

		if (result?.code_coding_code) {
			resource.code.coding.push({
				system: "https://trakcare.ydh.nhs.uk",
				code: result.code_coding_code,
				display: result?.code_coding_display,
			});
		}

		if (result?.code_coding_snomed_code) {
			resource.code.coding.push({
				system: "http://snomed.info/sct",
				code: result.code_coding_snomed_code,
				display: result?.code_coding_snomed_display,
			});
		}
	}

	// Add period
	if (result?.period_start || result?.period_end) {
		resource.period = {};
		if (
			result.period_start.substring(0, 1) !== "T" &&
			result.period_start.substring(0, 4) !== "1900"
		) {
			resource.period.start = result.period_start;
		}
		if (
			result.period_end.substring(0, 1) !== "T" &&
			result.period_end.substring(0, 4) !== "1900"
		) {
			resource.period.end = result.period_end;
		}
	}

	return resource;
}

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
		schema: stu3FlagReadSchema,
		handler: async (req, res) => {
			const whereArray = [[]];

			try {
				// Double-quoted as `whereArray[0]` is used inside OPENQUERY
				whereArray[0].push(
					escSq`(alert.ALM_RowID = REPLACE(''${req.params.id}'', ''-'', ''||''))`
				);

				// Aggregrate all predicates in whereArray and build SQL WHERE clause from it
				const whereClausePredicates = [];
				whereArray.forEach((element, index) => {
					if (element.length > 0) {
						whereClausePredicates[index] = element.join(" AND ");
					}
				});

				const results = await server.db.query(
					stu3FlagGetSearch({
						linkedServer: options.database.linkedServer.name,
						whereClausePredicates,
					})
				);

				const resource = results?.recordsets?.[0];

				if (resource && resource.length > 0) {
					// TODO: dynamic type
					res.type("application/fhir+json; charset=utf-8").send(
						server.cleanObject(
							buildStu3FlagResource(resource[0], req)
						)
					);
				} else {
					// TODO: respond with OperationOutcome Resource
					res.notFound("Flag Resource not found");
				}
			} catch (err) {
				// TODO: respond with OperationOutcome Resource
				throw res.internalServerError(err);
			}
		},
	});

	server.route({
		method: "GET",
		url: "/",
		schema: stu3FlagSearchSchema,
		handler: async (req, res) => {
			const bundle = buildStu3BundleResource(
				new URL(`${req.url}`, `${req.protocol}://${req.hostname}`).href
			);

			const whereArray = [[], []];

			try {
				if (req?.query?.patient) {
					whereArray[0].push(
						escSq`(alert.ALM_PAPMI_ParRef->PAPMI_No = ''${req?.query?.patient}'')`
					);
				}

				if (req?.query?.["patient.identifier"]) {
					const patientId =
						req?.query?.["patient.identifier"].split("|");

					switch (patientId[0]) {
						case "https://fhir.nhs.uk/Id/nhs-number":
							whereArray[0].push(
								escSq`(alert.ALM_PAPMI_ParRef->PAPMI_No = (SELECT PAPMI_No FROM PA_PatMas pm WHERE pm.PAPMI_ID = ''${patientId[1]}'' AND PAPMI_Active IS NULL)`
							);
							break;
						case "https://fhir.ydh.nhs.uk/Id/local-patient-identifier":
						default:
							whereArray[0].push(
								escSq`(alert.ALM_PAPMI_ParRef->PAPMI_No = ''${patientId[1]}'')`
							);
							break;
					}
				}

				/**
				 * Stop intentional or unintentional DOS attacks due to long-running SQL queries,
				 * see Search Caveats section in the readme
				 */
				//
				// TODO: replace with JSON Schema subschemas when supported
				if (req?.query?.patient || req?.query?.["patient.identifier"]) {
					// date - Time period when flag is active
					if (req?.query?.date) {
						let period = [];
						if (Array.isArray(req.query.date)) {
							period = req.query.date;
						} else {
							period.push(req.query.date);
						}

						period.forEach((periodDate) => {
							let date = periodDate;
							const operator = server.convertDateParamOperator(
								date.substring(0, 2)
							);

							if (Number.isNaN(Number(date.substring(0, 2)))) {
								date = date.substring(2, date.length);
							}

							whereArray[1].push(
								escSq`(period_start ${operator} '${date}')`
							);
						});
					}

					// status - Flag status: active, or inactive
					if (req?.query?.status) {
						whereArray[1].push(
							escSq`(status = '${req.query.status}')`
						);
					}
				}

				const whereClausePredicates = [];
				whereArray.forEach((element, index) => {
					if (element.length > 0) {
						whereClausePredicates[index] = element.join(" AND ");
					}
				});

				// Stops SQL query with empty WHERE clause from being made and throwing errors
				if (whereClausePredicates.length === 0) {
					// TODO: respond with OperationOutcome Resource
					res.badRequest("Error searching resources.");
				} else {
					const results = await server.db.query(
						stu3FlagGetSearch({
							linkedServer: options.database.linkedServer.name,
							whereClausePredicates,
						})
					);

					const resources = results?.recordsets?.[0];
					// Populate Bundle Resource with Flag Resources
					if (resources && resources.length > 0) {
						resources.forEach((resource) => {
							const resourceObject = {
								fullUrl: new URL(
									`/STU3/Flag/${resource.id}`,
									`${req.protocol}://${req.hostname}`
								).href,
								resource: server.cleanObject(
									buildStu3FlagResource(resource, req)
								),
							};

							bundle.entry.push(resourceObject);
							bundle.total += 1;
						});

						// TODO: dynamic type
						res.type("application/fhir+json; charset=utf-8").send(
							bundle
						);
					} else {
						// TODO: respond with OperationOutcome Resource
						res.notFound("Flag Resource not found");
					}
				}
			} catch (err) {
				// TODO: respond with OperationOutcome Resource
				throw res.internalServerError(err);
			}
		},
	});
}

module.exports = route;
