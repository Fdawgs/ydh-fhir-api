IF OBJECT_ID('access.tokens', 'U') IS NULL CREATE TABLE access.tokens
    (
        id uniqueidentifier PRIMARY KEY NOT NULL DEFAULT newid(),
        [name] VARCHAR(MAX) NOT NULL,
        email VARCHAR(MAX) NOT NULL,
        [hash] VARCHAR(MAX) NOT NULL,
        salt VARCHAR(MAX) NOT NULL,
        scopes NVARCHAR(MAX) NOT NULL,
        expires DATETIMEOFFSET NOT NULL,
        created DATETIMEOFFSET NOT NULL DEFAULT CURRENT_TIMESTAMP,
        last_updated DATETIMEOFFSET DEFAULT CURRENT_TIMESTAMP
    );

IF OBJECT_ID('lookup.alerts', 'U') IS NULL CREATE TABLE lookup.alerts
    (
        trakcare_code NVARCHAR(50) PRIMARY KEY NOT NULL,
        trakcare_display NVARCHAR(100) NOT NULL,
        snomed_code NVARCHAR(50) NULL,
        snomed_display NVARCHAR(100) NULL,
        comments NVARCHAR(150) NULL,
        created DATETIMEOFFSET NOT NULL DEFAULT CURRENT_TIMESTAMP,
        last_updated DATETIMEOFFSET DEFAULT CURRENT_TIMESTAMP
    );

IF OBJECT_ID('lookup.ethnicity', 'U') IS NULL CREATE TABLE lookup.ethnicity
    (
        trakcare_code NVARCHAR(50) PRIMARY KEY NOT NULL,
        trakcare_display NVARCHAR(100) NOT NULL,
        care_connect_code NVARCHAR(50) NULL,
        care_connect_display NVARCHAR(100) NULL,
        comments NVARCHAR(150) NULL,
        created DATETIMEOFFSET NOT NULL DEFAULT CURRENT_TIMESTAMP,
        last_updated DATETIMEOFFSET DEFAULT CURRENT_TIMESTAMP
    );