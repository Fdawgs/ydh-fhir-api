/**
 * @author Frazer Smith
 * @description Build SQL query string.
 * @param {object} options - Query string and database config values.
 * @param {string} options.linkedServer - Name of linked server.
 * @param {Array} options.whereClausePredicates - WHERE clause predicates.
 * @returns {string} Query string.
 */
const flagGetSearch = ({ linkedServer, whereClausePredicates }) => `
WITH
  flag_CTE
  AS
  (
    SELECT DISTINCT flagId,
      CASE ALM_Status
      WHEN 'I' THEN 'inactive'
      WHEN 'A' THEN 'active'
      END AS flagStatusCode,
      flagCategoryCodingDisplay,
      flagCategoryCodingCode,
      flagCodeCodingDisplay,
      flagCodeCodingCode,
      flagCodeText,
      flagSubjectReference,
      CONCAT(COALESCE(periodStartDate, ''),'T', COALESCE(periodStartTime, '')) AS periodStart,
      CONCAT(COALESCE(periodEndDate, ''),'T00:00:00') AS periodEnd
    FROM OPENQUERY(
		[${linkedServer}], 'SELECT DISTINCT
            ALM_Status,
            COALESCE(ALM_OnsetDate, ALM_CreateDate) AS periodStartDate,
            COALESCE(ALM_OnsetTime, ALM_CreateTime) AS periodStartTime,
            COALESCE(ALM_ExpiryDate, ALM_ClosedDate) AS periodEndDate,
            ALM_ClosedTime AS periodEndTime,
            REPLACE(alert.ALM_RowID, ''||'', ''-'') AS flagId,
            alert.ALM_Alert_DR->ALERT_Desc AS flagCodeCodingDisplay,
            alert.ALM_Alert_DR->ALERT_Code AS flagCodeCodingCode,
            alert.ALM_Message AS flagCodeText,
            alert.ALM_AlertCategory_DR->ALERTCAT_Desc AS flagCategoryCodingDisplay,
            alert.ALM_AlertCategory_DR->ALERTCAT_Code AS flagCategoryCodingCode,
            alert.ALM_PAPMI_ParRef->PAPMI_No AS flagSubjectReference
        FROM PA_AlertMsg alert
       WHERE alert.ALM_Alert_DR IS NOT NULL
	   ${whereClausePredicates?.[0] ? `AND ${whereClausePredicates[0]}` : ""}
         ')
  )
SELECT flag_CTE.*,
  snom.snomed_code AS flagCodeCodingSnomedCode,
  snom.snomed_display AS flagCodeCodingSnomedDisplay,
  -- Every resource query must always have a lastUpdated column
  CASE
       WHEN periodEnd > periodStart
       THEN periodEnd
       ELSE periodStart
       END AS lastUpdated
FROM flag_CTE
  LEFT JOIN lookup.patient_alerts AS snom WITH (NOLOCK)
  ON flag_CTE.flagCodeCodingCode = snom.trakcare_code
WHERE flagStatusCode IS NOT NULL ${
	whereClausePredicates?.[1] ? `AND ${whereClausePredicates[1]}` : ""
};`;

module.exports = {
	flagGetSearch,
};
