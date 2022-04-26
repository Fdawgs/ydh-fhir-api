const { parseConnectionString } = require("@tediousjs/connection-string");

// eslint-disable-next-line func-names
module.exports.generateSql = function () {
	return `
    EXEC msdb.dbo.sp_add_jobstep
        @job_name = N'lookup.patient_dnd update',
        @step_name = N'Repopulate DND',
        @step_id = 1,
        @cmdexec_success_code = 0,
        @on_success_action = 1,
        @on_success_step_id = 0,
        @on_fail_action = 2,
        @on_fail_step_id = 0,
        @retry_attempts = 0,
        @retry_interval = 0,
        @subsystem = N'TSQL',
        @command = 'IF OBJECT_ID(''lookup.patient_dnd'', ''U'') IS NOT NULL
            TRUNCATE TABLE lookup.patient_dnd;

            INSERT INTO lookup.patient_dnd
            SELECT dnd,
                   patient_no
              FROM OPENQUERY([${process.env.DB_LINKED_SERVER_NAME}],
                ''SELECT DISTINCT ALM_PAPMI_ParRef->PAPMI_PAPER_DR->PAPER_ID AS dnd,
                         ALM_PAPMI_ParRef->PAPMI_PAPER_DR->PAPER_PAPMI_DR->PAPMI_No AS patient_no
                    FROM PA_ALertMsg
                   WHERE ALM_Alert_DR->ALERT_Code = (''''DDA'''')
                     AND (ALM_ClosedDate IS NULL
                            OR ALM_ClosedDate < CURRENT_TIMESTAMP)'');',
        @database_name = N'${
			parseConnectionString(process.env.DB_CONNECTION_STRING).database
		}',
        @flags = 0`;
};
