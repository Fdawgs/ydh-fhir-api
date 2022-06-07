/**
 * @author Frazer Smith
 * @description Build SQL query string.
 * @param {object} options - Query string and database config values.
 * @param {string} options.linkedServer - Name of linked server.
 * @param {Array} options.whereClausePredicates - WHERE clause predicates.
 * @returns {string} Query string.
 */
const stu3FlagGetSearch = ({ linkedServer, whereClausePredicates }) => `
WITH
  flag_CTE
  AS
  (
    SELECT DISTINCT id,
      CASE ALM_Status
      WHEN 'I' THEN 'inactive'
      WHEN 'A' THEN 'active'
      END AS status,
      category_coding_display,
      category_coding_code,
      code_coding_display,
      code_coding_code,
      subject_reference,
      CONCAT(COALESCE(period_start_date, ''),'T', COALESCE(period_start_time, '')) AS period_start,
      CONCAT(COALESCE(period_end_date, ''),'T', COALESCE(period_end_time, '')) AS period_end
    FROM OPENQUERY(
		[${linkedServer}], 'SELECT DISTINCT
            REPLACE(alert.ALM_RowID, ''||'', ''-'') AS id,
            ALM_Status,
            alert.ALM_AlertCategory_DR->ALERTCAT_Desc AS category_coding_display,
            alert.ALM_AlertCategory_DR->ALERTCAT_Code AS category_coding_code,
            alert.ALM_Alert_DR->ALERT_Desc AS code_coding_display,
            alert.ALM_Alert_DR->ALERT_Code AS code_coding_code,
            COALESCE(ALM_OnsetDate, ALM_CreateDate) AS period_start_date,
            COALESCE(ALM_OnsetTime, ALM_CreateTime) AS period_start_time,
            COALESCE(ALM_ExpiryDate, ALM_ClosedDate) AS period_end_date,
            ALM_ClosedTime AS period_end_time,
            alert.ALM_PAPMI_ParRef->PAPMI_No AS subject_reference
        FROM PA_AlertMsg alert
       WHERE alert.ALM_Alert_DR IS NOT NULL
	   ${whereClausePredicates?.[0] ? `AND ${whereClausePredicates[0]}` : ""}
         ')
  )
SELECT flag_CTE.*,
  snom.snomed_code AS code_coding_snomed_code,
  snom.snomed_display AS code_coding_snomed_display,
  -- Every resource query must always have a lastUpdated column
  CASE
       WHEN period_end > period_start
       THEN period_end
       ELSE period_start
       END AS last_updated
FROM flag_CTE
  LEFT JOIN lookup.patient_alerts AS snom WITH (NOLOCK)
  ON flag_CTE.code_coding_code = snom.trakcare_code
WHERE status IS NOT NULL ${
	whereClausePredicates?.[1] ? `AND ${whereClausePredicates[1]}` : ""
};`;

module.exports = {
	stu3FlagGetSearch,
};
