/**
 * Development notes:
 *
 * FHIR Encounter types: inpatient | outpatient | ambulatory | emergency
 * FHIR status types:  planned | arrived | triaged | in-progress | onleave |
 * 					finished | cancelled | entered-in-error | unknown
 * PA_Adm Visit status types: Admit (A) | Cancel (C) | Discharged (D) | Pre-Admission (P) |
 * 					 Released (R) | DNA (N)
 * RB_Appointment APPT_status types : Inserted (I) | Admitted (A) | Transferred (T) | Cancelled (X) |
 * 							  Closed (C) | Booked (P) | NotAttended (N) | Hold(Postponed) (H) |
 * 							  Hold(Inserted) (J) | Could Not Wait (W) | Arrived Not Seen (S) |
 * 							  Departed (D)
 * J and C not in use
 *
 * Encounter structures within TrakCare
 * ====================================
 * The 'Patient Enquiry Display' is actually regarding RTT pathways, the 'Date'
 * is the day the referral was recieved for outpatient appointments.
 * An episode can have 0..* appointments under it as children.
 *
 * RB_Appointment holds outpatient appointments ONLY.
 *
 * Staff misuse the discharge date in outpatients as 'time all admin complete', not the time patient left.
 * This will be set to NULL to account for data quality issue.
 *
 * PA_Adm holds inpatient and emergency encounters, AND the top level episode for outpatient appointments (but will not be used)
 * PA_Adm2 holds additional details and is 1:1 with PA_Adm
 *
 * Unique Identifiers
 * ==================
 * For Emergency and Inpatient, use enc.PAADM_ADMNo as unique identifier, replace the / in emerg with a dash
 * For Outpatients, use app.APPT_RowID, replacing the || with a dash
 *
 * SNOMED CT codes:
 * Accident and Emergency department: 225728007
 * Outpatient environment: 440655000
 * Inpatient environment: 440654001
 */

/**
 * @author Frazer Smith
 * @description Build SQL query string.
 * @param {object} options - Query string and database config values.
 * @param {string} options.linkedServer - Name of linked server.
 * @param {Array} options.whereClausePredicates - WHERE clause predicates.
 * @returns {string} Query string.
 */
const encounterGetSearch = ({ linkedServer, whereClausePredicates }) => `
SELECT id,
	patientReference,
	allergyGroupDesc,
	allergyCodingDesc,
	allergyDrugDesc,
	allergyDrugGenericDesc,
	allergyDrugCategoryDesc,
	allergyDrugFormDesc,
	allergyDrugIngredientDesc,
	allergyComment,
	clinicalStatusCode,
	verificationStatusCode,
	typeCode,
	criticalityCode,
	CONCAT(COALESCE(assertedDate, ''), 'T', COALESCE(assertedTime, '')) AS assertedDate,
	-- Every resource query must always have a lastUpdated column
	CONCAT(COALESCE(lastUpdateDate, ''), 'T', COALESCE(lastUpdateTime, '')) AS lastUpdated
FROM OPENQUERY([${linkedServer}],
  				'SELECT REPLACE(alle.ALG_RowId, ''||'', ''-'') AS id,
				  		-- patient reference
				  		alle.ALG_PAPMI_ParRef->PAPMI_No AS patientReference,
						-- Concat these in resource builder to create code.text
						alle.ALG_AllergyGrp_DR->ALGR_Desc AS allergyGroupDesc,
						alle.ALG_TYPE_DR->ALG_Desc AS allergyCodingDesc,
						alle.ALG_PHCDM_DR->PHCD_ProductName AS allergyDrugDesc, -- Drug Master
						alle.ALG_PHCGE_DR->PHCGE_Name AS allergyDrugGenericDesc, -- Drug Generic
						alle.ALG_PHCSC_DR->PHCSC_Desc AS allergyDrugCategoryDesc, -- Drug Category
						alle.ALG_PHCDRGForm_DR->PHCDF_Description AS allergyDrugFormDesc, -- Drug Form
						alle.ALG_Ingred_DR->INGR_Desc AS allergyDrugIngredientDesc, -- Drug Ingredient
						alle.ALG_Comments AS allergyComment,
						-- clinical status
						CASE alle.ALG_Status
						WHEN ''A'' THEN ''active''
						WHEN ''I'' THEN ''inactive''
						WHEN ''R'' THEN ''resolved''
						ELSE NULL
						END AS clinicalStatusCode,
						-- verification Status unconfirmed |confirmed
						CASE
						WHEN alle.ALG_Status = ''C'' THEN ''unconfirmed''
						WHEN alle.ALG_ConfirmedDate IS NOT NULL OR (alle.ALG_Status != ''C'' AND alle.ALG_Status IS NOT NULL) THEN ''confirmed''
						ELSE ''unconfirmed''
						END as verificationStatusCode,
						-- type
						CASE alle.ALG_Category_DR->ALRGCAT_DESC
						WHEN ''ALLERGY'' THEN ''allergy''
						WHEN ''SIDEEFFECT'' THEN ''intolerance''
						ELSE NULL
						END AS typeCode,
						CASE alle.ALG_Severity_DR
						WHEN 1 THEN ''high'' -- moderate assigned to be high, better safe than sorry
						WHEN 2 THEN ''low''
						WHEN 5 THEN ''high''
						WHEN 4 THEN ''unable-to-assess''
						ELSE NULL
						END AS criticalityCode,
						alle.ALG_Date AS assertedDate,
						alle.ALG_Time AS assertedTime,
						alle.ALG_LastUpdateDate AS lastUpdateDate,
						alle.ALG_LastUpdateTime as lastUpdateTime
				   FROM PA_Allergy alle
				  WHERE (alle.ALG_PAPMI_ParRef->PAPMI_No IS NOT NULL)
					${whereClausePredicates?.[0] ? `AND ${whereClausePredicates[0]}` : ""}
					') ${whereClausePredicates?.[1] ? `WHERE ${whereClausePredicates[1]}` : ""};`;

module.exports = {
	encounterGetSearch,
};
