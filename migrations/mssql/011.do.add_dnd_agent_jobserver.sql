EXEC msdb.dbo.sp_add_jobserver
    @job_name = N'lookup.patient_dnd update',
    @server_name = N'(local)';