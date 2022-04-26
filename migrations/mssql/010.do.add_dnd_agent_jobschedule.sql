EXEC msdb.dbo.sp_add_jobschedule
    @job_name = N'lookup.patient_dnd update',
    @name = N'Hourly',
    @freq_type = 4,
    @freq_interval = 1,
    @freq_subday_type = 8,
    @freq_subday_interval = 1,
    @freq_relative_interval = 0;