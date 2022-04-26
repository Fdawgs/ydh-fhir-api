/**
 * @author Frazer Smith
 * @description Build SQL query string.
 * @param {object} options - Query string and database config values.
 * @param {string} options.linkedServer - Name of linked server.
 * @param {Array} options.whereClausePredicates - WHERE clause predicates.
 * @returns {string} Query string.
 */
const patientGetSearch = ({ linkedServer, whereClausePredicates }) => `
SELECT nhsNumber,
	nhsNumberTraceStatusDesc,
	nhsNumberTraceStatusCode,
	patient.patientNo,
	identifiers.secondaryIdentifiers,
	active,
	ethnicCategoryCode,
	ethnicCategoryDesc,
	ethnic.care_connect_code AS ethnicCategoryCareConnectCode,
	ethnic.care_connect_display AS ethnicCategoryCareConnectDesc,
	UPPER(religiousAffiliationCode) AS religiousAffiliationCode,
	religiousAffiliationDesc,
	homePhone,
	businessPhone,
	mobilePhone,
	appointmentSMS,
	email,
	preferredContactMethod,
	preferredLanguageCode,
	preferredLanguageDesc,
	interpreterRequired,
	nameFamily,
	nameGiven1First,
	nameGiven2Middle,
	namePrefix,
	maritalStatusDesc,
	maritalStatusCode,
	addressLine1,
	addressLine2,
	city,
	district,
	postalCode,
	gender,
	birthDate,
	CONCAT(COALESCE(deceasedDate, ''), 'T', COALESCE(deceasedTime, '')) AS deceasedDateTime,
	gpDesc,
	gpAddressLine1,
	gpAddressLine2,
	gpCity,
	gpPostalCode,
	gpIdentifier,
	contactName,
	contactPhone,
	contactText,
	dnd.dnd,
	school.schoolName,
	school.schoolId,
	school.schoolPhone,
	-- Every resource query must always have a lastUpdated column
	CONCAT(COALESCE(lastUpdateDate, ''), 'T', COALESCE(lastUpdateTime, '')) AS lastUpdated
FROM OPENQUERY(
		[${linkedServer}], 'SELECT
									patmas.PAPMI_PAPER_DR->PAPER_ID AS nhsNumber,
									patmas.PAPMI_TraceStatus_DR->TRACE_Desc AS nhsNumberTraceStatusDesc,
									patmas.PAPMI_TraceStatus_DR AS nhsNumberTraceStatusCode,
									patmas.PAPMI_No AS patientNo, -- MRN
									patmas.PAPMI_Active,	
									CASE
									WHEN patmas.PAPMI_Active IS NULL THEN ''true''
									WHEN patmas.PAPMI_Active = ''Y'' THEN ''true''
									ELSE NULL
									END AS active,
									-- ethnicCategory
									patmas.PAPMI_PAPER_DR->PAPER_IndigStat_DR->INDST_Desc AS ethnicCategoryDesc,
									patmas.PAPMI_PAPER_DR->PAPER_IndigStat_DR->INDST_Code AS ethnicCategoryCode,
									--religiousAffiliation
									patmas.PAPMI_PAPER_DR->PAPER_Religion_DR->CTRLG_Desc AS religiousAffiliationDesc,
									patmas.PAPMI_PAPER_DR->PAPER_Religion_DR->CTRLG_Code AS religiousAffiliationCode,
									-- nhsCommunication/Telecoms
									patmas.PAPMI_PAPER_DR->PAPER_TelH AS homePhone,
									patmas.PAPMI_PAPER_DR->PAPER_TelO AS businessPhone,
									patmas.PAPMI_PAPER_DR->PAPER_MobPhone AS mobilePhone,
									patmas.PAPMI_PAPER_DR->PAPER_AppointmentSMS AS appointmentSMS,
									patmas.PAPMI_PAPER_DR->PAPER_Email AS Email,
									patmas.PAPMI_PAPER_DR->PAPER_PreferredContactMethod AS preferredContactMethod,
									patmas.PAPMI_PAPER_DR->PAPER_PrefLanguage_DR->PREFL_Desc AS preferredLanguageDesc,
									patmas.PAPMI_PAPER_DR->PAPER_PrefLanguage_DR->PREFL_Code AS preferredLanguageCode,									
									patmas.PAPMI_PAPER_DR->PAPER_InterpreterRequired AS interpreterRequired,
									patmas.PAPMI_PAPER_DR->PAPER_UpdateDate AS lastUpdateDate,
									patmas.PAPMI_PAPER_DR->PAPER_UpdateTime AS lastUpdateTime,
									-- name (official)
									patmas.PAPMI_PAPER_DR->PAPER_Name AS nameFamily,
									patmas.PAPMI_PAPER_DR->PAPER_Name2 AS nameGiven1First,
									patmas.PAPMI_PAPER_DR->PAPER_Name3 AS nameGiven2Middle,
									patmas.PAPMI_PAPER_DR->PAPER_Title_DR->TTL_Desc AS nameprefix,
									-- contact (NoK)
									patmas.PAPMI_PAPER_DR->PAPER_NokName AS contactName,
									patmas.PAPMI_PAPER_DR->PAPER_NokPhone AS contactPhone,
									patmas.PAPMI_PAPER_DR->PAPER_NokText AS contactText,
									-- marital status
									CASE patmas.PAPMI_PAPER_DR->PAPER_Marital_DR->CTMAR_RowId
									WHEN 1 THEN ''Married''
									WHEN 2 THEN ''unknown''
									WHEN 3 THEN ''Widowed''
									WHEN 4 THEN ''unmarried''
									WHEN 5 THEN ''Legally Seperated''
									WHEN 6 THEN ''Divorced''
									END AS maritalStatusDesc,
									CASE patmas.PAPMI_PAPER_DR->PAPER_Marital_DR->CTMAR_Code
									WHEN ''N'' THEN ''U''
									ELSE patmas.PAPMI_PAPER_DR->PAPER_Marital_DR->CTMAR_Code
									END AS maritalStatusCode,
									-- address (home)
									patmas.PAPMI_PAPER_DR->PAPER_StName AS addressLine1,
									patmas.PAPMI_PAPER_DR->PAPER_ForeignAddress AS addressLine2,
									patmas.PAPMI_PAPER_DR->PAPER_CityCode_DR->CTCIT_Desc AS city,
									patmas.PAPMI_PAPER_DR->PAPER_CT_Province_DR->PROV_Desc AS district,
									patmas.PAPMI_PAPER_DR->PAPER_Zip_DR->CTZIP_Code AS postalCode,
									-- Misc extensions and data
									CASE patmas.PAPMI_PAPER_DR->PAPER_Sex_DR->CTSEX_RowId
									WHEN 1 THEN ''female''
									WHEN 2 THEN ''unknown''
									WHEN 3 THEN ''other''
									WHEN 4 THEN ''male''
									END AS gender,
									patmas.PAPMI_DOB AS birthDate,
									patmas.PAPMI_Deceased_Date as deceasedDate,
									patmas.PAPMI_DeceasedTime as deceasedTime,
									-- GP Practice
									patmas.PAPMI_PAPER_DR->PAPER_FamilyDoctor_DR->REFD_Desc AS gpDesc,
									patmas.PAPMI_PAPER_DR->PAPER_FamilyDoctorClinic_DR->CLN_Address1 AS gpAddressLine1,
									patmas.PAPMI_PAPER_DR->PAPER_FamilyDoctorClinic_DR->CLN_Address2 AS gpAddressLine2,
									patmas.PAPMI_PAPER_DR->PAPER_FamilyDoctorClinic_DR->CLN_City_DR->CTCIT_Desc AS gpCity,
									patmas.PAPMI_PAPER_DR->PAPER_FamilyDoctorClinic_DR->CLN_Zip_DR->CTZIP_Code AS gpPostalCode,
									patmas.PAPMI_PAPER_DR->PAPER_FamilyDoctorClinic_DR->CLN_Code AS gpIdentifier
								FROM PA_PatMas patmas
								WHERE COALESCE(PAPMI_Active,''Y'') = ''Y''
								AND (patmas.PAPMI_PAPER_DR->PAPER_ID IS NOT NULL OR patmas.PAPMI_No IS NOT NULL)
								${
									whereClausePredicates?.[0]
										? `AND ${whereClausePredicates[0]}`
										: ""
								}') AS patient
	LEFT JOIN lookup.patient_dnd AS dnd WITH (NOLOCK)
	ON patient.patientNo = dnd.patient_no

	LEFT JOIN OPENQUERY([${linkedServer}],
                 'SELECT DISTINCT NOK_NonGovOrg_DR->NGO_Code AS schoolId,
				 		 NOK_NonGovOrg_DR->NGO_Desc AS schoolName,
						 NOK_NonGovOrg_DR->NGO_Phone AS schoolPhone,
						 NOK_PAPMI_ParRef->PAPMI_No AS patientNo
                    FROM PA_NOK
                   WHERE NOK_Relation_DR->CTRLT_Code = ''SCH''
					 AND NOK_Inactive = ''N''
					 ${whereClausePredicates?.[1] ? `AND ${whereClausePredicates[1]}` : ""}
                   ') AS school
	ON patient.patientNo = school.patientNo

	LEFT JOIN lookup.patient_ethnicity ethnic WITH (NOLOCK)
	ON patient.ethnicCategoryCode = ethnic.trakcare_code

	LEFT JOIN( SELECT (
			SELECT 'secondary' AS "use",
			CASE code
			WHEN 'GEN' THEN 'https://fhir.ydh.nhs.uk/Id/medical-record-number'
			WHEN 'HSP' THEN 'https://fhir.ydh.nhs.uk/Id/legacy-hospital-number'
			WHEN 'KOR' THEN 'https://fhir.ydh.nhs.uk/Id/korner-number'
			WHEN 'XRA' THEN 'https://fhir.ydh.nhs.uk/Id/x-ray-number'
			ELSE NULL
			END AS [system],
			[value]
		FROM OPENQUERY([${linkedServer}],
							'SELECT RTMAS_MRType_DR->TYP_Code AS code,
									RTMAS_MRNo AS value
									FROM RT_Master
							  WHERE RTMAS_Active = ''Y''
							  	AND RTMAS_MRType_DR->TYP_Code != ''NHS''
								  ${whereClausePredicates?.[2] ? `AND ${whereClausePredicates[2]}` : ""}
							  ')
		FOR JSON PATH, ROOT('identifier')) AS secondaryIdentifiers) AS identifiers
	ON 1 = 1`;

module.exports = {
	patientGetSearch,
};
