IF NOT EXISTS ( SELECT name FROM sys.schemas WHERE name = N'access' ) EXEC('CREATE SCHEMA access');

IF NOT EXISTS ( SELECT name FROM sys.schemas WHERE name = N'lookup' ) EXEC('CREATE SCHEMA lookup');