<a href="https://yeovilhospital.co.uk/">
	<img alttext="Yeovil District Hospital Logo" src="https://github.com/Fdawgs/ydh-logos/raw/HEAD/images/ydh-full-logo-transparent-background.svg" width="480" />
</a>

# Yeovil District Hospital NHS Foundation Trust - FHIR API

[![GitHub Release](https://img.shields.io/github/release/Fdawgs/ydh-fhir-api.svg)](https://github.com/Fdawgs/ydh-fhir-api/releases/latest/)
![Build Status](https://github.com/Fdawgs/ydh-fhir-api/workflows/CI/badge.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/Fdawgs/ydh-fhir-api/badge.svg?branch=master)](https://coveralls.io/github/Fdawgs/ydh-fhir-api?branch=master)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)](https://github.com/prettier/prettier)

> Yeovil District Hospital NHSFT's RESTful HL7® FHIR® API

## Intro

This is [Yeovil District Hospital NHSFT](https://yeovilhospital.co.uk/)'s RESTful HL7® FHIR® API, a Node.js application using the [Fastify](https://www.fastify.io/) web framework.

Background information detailing the history and purpose of this API can be found [here](./docs/history.md).

## Prerequisites

-   InterSystems IRIS ODBC35 ODBC Driver 2021 (All InterSystems prerequisites must be sourced from them directly)
-   InterSystems IRIS for Health 2020
-   InterSystems TrakCare v2020
-   [Node.js](https://nodejs.org/en/) >=16.0.0
-   [SQL Server](https://www.microsoft.com/en-gb/sql-server/sql-server-downloads) (As a Windows service/instance; SQL Server on Linux [does not support linked servers](https://docs.microsoft.com/en-us/sql/linux/sql-server-linux-editions-and-components-2019?view=sql-server-ver15#Unsupported))

## Setup

Perform the following steps before deployment:

1. Clone or download the repo
2. Navigate to the project directory
3. Make a copy of `.env.template` in the root directory and rename it to `.env`
4. Configure the application using the environment variables in `.env`
5. Install InterSystems IRIS ODBC35 ODBC Driver
6. Follow the InterSystems documentation for [Defining an ODBC Data Source on Windows](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=BNETODBC_winodbc) as a System DSN

**Note:** You will need to create a database before using it in the `DB_CONNECTION_STRING` environment variable

**Note:** Set the following environment variables in `.env` to meet NHS Digital's recommendation to retain 6 months' worth of logs:

-   `LOG_ROTATION_DATE_FORMAT="YYYY-MM-DD"`
-   `LOG_ROTATION_FREQUENCY="daily"`
-   `LOG_ROTATION_MAX_LOGS="180"`

## Deployment

### Standard Deployment

1. Run `npm i --ignore-scripts --production` to install dependencies
2. Run `npm start`

The service should be up and running on the port set in the config. You should see output similar to the following in stdout or in the log file specified using the `LOG_ROTATION_FILENAME` environment variable:

```json
{
	"level": "info",
	"time": "2022-01-10T10:17:35.556Z",
	"pid": 18,
	"hostname": "MYCOMPUTER",
	"msg": "Connecting to MSSQL DB"
}
```

```json
{
	"level": "info",
	"time": "2022-01-10T10:17:35.558Z",
	"pid": 18,
	"hostname": "MYCOMPUTER",
	"msg": "MSSQL DB connection opened"
}
```

```json
{
	"level": "info",
	"time": "2022-01-10T10:17:35.760Z",
	"pid": 18,
	"hostname": "MYCOMPUTER",
	"msg": "Server listening at http://0.0.0.0:8204"
}
```

To quickly test it, use [Insomnia](https://insomnia.rest/) and import the example requests from `./test_resources/insomnia_test_requests.json`.

### Deploying Using PM2

It is recommended that you use a process manager such as [PM2](https://pm2.keymetrics.io/).

1. Run `npm i --ignore-scripts --production` to install dependencies
2. Run `npm i -g pm2` to install pm2 globally
3. Launch application with `pm2 start .pm2.config.js`
4. Check the application has been deployed using `pm2 list` or `pm2 monit`

#### To Install as a Windows Service:

If using a Microsoft Windows OS utilise [pm2-installer](https://github.com/jessety/pm2-installer) to install PM2 as a Windows service.

**Note:** PM2 will automatically restart the application if `.env` is modified.

## Known Issues and Caveats

Issues with InterSystems TrakCare PAS (used by YDH) and staff misuse of the PAS have affected how the data is presented in the endpoints and how searches can be performed.

### Data Quality

-   AllergyIntolerance resources:
    -   Unable to provide SNOMED codes for allergies and intolerances in AllergyIntolerance resources due to these being free text inputs in TrakCare
    -   Low recordings of allergy and intolerance data in TrakCare:
        -   350,513 non-deceased patients with records in TrakCare as of 2020-11-19
            -   34,405 patients have ‘No Known Allergy’ recorded (9.8%)
            -   13,139 patients have one or more allergies recorded (3.7%)
    -   Due to the above issues, Paul Foster (CCIO at YDH) on 2020-11-19 suggested we **do not provide AllergyIntolerance resources** (functionality is still present however)
-   Condition resources:
    -   **Unable to provide Condition resources** as conditions are held in SimpleCode, not TrakCare
-   DocumentReference resources:
    -   **Unable to provide DocumentReference resources** as these are held in Patient Centre, not TrakCare
-   Encounter resources:
    -   Discharge/end dates for outpatient Encounter resources are not provided due to poor data quality. Staff in outpatients misuse these input fields in TrakCare to mark when “all admin has been completed for that outpatient encounter” and not when the encounter actually finished
    -   Unable to provide clinician contact details for Encounter resources due to the following:
        -   In TrakCare a care provider has a mobile number field against them, but it is rarely populated
        -   There is not an internal contact number field in TrakCare
        -   If you want to reach say, a gynaecology consultant, you need to manually search a list on YDH’s intranet for their secretary’s extension number, and there is no indication as to how current the list is
        -   Teams do not have a contact number
-   Patient resources:
    -   Unable to provide SNOMED codes for religious affiliation as these are not in TrakCare (NHS Data Dictionary coding is provided, however)
    -   Unable to provide GP surgery/organisation `name` value for inline Organization FHIR resource as this data is also not held in TrakCare; using GP consultant name as a placeholder
    -   A sizeable number of patient records without postcodes

### Search Caveats

-   Every search request to a FHIR resource endpoint that is **NOT** the Patient FHIR resource endpoint **MUST** have a `patient` search parameter, this is to stop intentional or unintentional DOS attacks due to long-running SQL queries:
    -   `GET [baseUrl]/AllergyIntolerance?criticality=[code]` will return a 500 error
    -   `GET [baseUrl]/AllergyIntolerance?patient=[id]&criticality=[code]` will work

This is due to YDH not having direct control over the underlying databases of the PAS, so cannot add indexes or make appropriate performance tweaks to support searches without also filtering by patient.

## Contributing

Contributions are welcome, and any help is greatly appreciated!

See [the contributing guide](./CONTRIBUTING.md) for details on how to get started.
Please adhere to this project's [Code of Conduct](./CODE_OF_CONDUCT.md) when contributing.

## Acknowledgements

-   **Adam Wiles** - Procedure FHIR resource advice
-   **David Suckling** - TrakCare database table structure and frontend support
-   [**Dunmail Hodkinson**](https://github.com/Dunmail) - HL7 FHIR STU3 specification adherence and best practices advice
-   **George Dampier** - MedicationStatement FHIR resource advice
-   **Jessica Male** - TrakCare frontend support
-   [**Julian Matthews**](https://github.com/NHS-juju) - Bug reports
-   **John Simpson** - MedicationStatement FHIR resource advice
-   [**Mark Hunt**](https://github.com/nhsbandit) - JWT and JWKS integration and testing
-   **Michael McCormack** - SQL query optimisation
-   [**Neil Hayes-Webster**](https://github.com/NeilHW-YDH) - SQL query optimisation
-   **Nicolas Noblet** - SQL query optimisation, TrakCare database table structure advice
-   [**Will Jehring**](https://github.com/wjehring) - HL7 FHIR STU3 specification adherence advice, JWT testing

## License

`ydh-fhir-api` is licensed under the [MIT](./LICENSE) license.
