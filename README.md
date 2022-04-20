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

### Background

[Somerset Clinical Commissioning Group](https://www.somersetccg.nhs.uk/#) (CCG) started the [SIDeR project](https://www.somersetccg.nhs.uk/about-us/digital-projects/sider/) with the purpose of linking up all main clinical and social care IT systems used in Somerset to improve and support direct care. [Black Pear Software Ltd.](https://www.blackpear.com/) (BP) is the technical partner that supports the project.

Stakeholders (as of 2022-04-04) are:

-   [Children's Hospice South West](https://www.chsw.org.uk/) (CHSW)
-   [Devon Doctors](https://www.devondoctors.co.uk/) (DD)
-   [Dorothy House Hospice](https://www.dorothyhouse.org.uk/) (DHH)
-   GP practices within Somerset (GPs)
-   [Somerset County Council](https://www.somerset.gov.uk/) (SCC)
-   [Somerset NHS Foundation Trust](https://www.somersetft.nhs.uk/) (SFT)
-   [South Western Ambulance Service NHS Foundation Trust](https://www.swast.nhs.uk/) (SWASFT)
-   [St Margaret’s Hospice](https://www.st-margarets-hospice.org.uk/) (SMH)
-   [Yeovil District Hospital NHS Foundation Trust](https://yeovilhospital.co.uk/) (YDH)

Black Pear have built a single-page web application for a shared care record, which retrieves data relating to a patient from each stakeholder that has the capability to do so, and amalgamate it into this record. The record is not stored in a cache anywhere and is built on the fly.
Care providers can then access this record through a contextual link (an embedded link within the PAS).
Clients using the web app need to be able to make GET requests to RESTful HL7® FHIR® API endpoints to retrieve a set of seven FHIR resources that adhere to their respective [NHS Care Connect API profiles](https://nhsconnect.github.io/CareConnectAPI/) to populate the record.

Since deployment these API endpoints are being used by a growing number of internal applications and processes at the hospital.

## Prerequisites

-   [Node.js](https://nodejs.org/en/) >=16.0.0 (if running outside of Docker)
-   [SQL Server](https://www.microsoft.com/en-gb/sql-server/sql-server-downloads) (either as a service/instance or Docker container)

## Setup

Perform the following steps before deployment:

1. Clone or download the repo
2. Navigate to the project directory
3. Make a copy of `.env.template` in the root directory and rename it to `.env`
4. Configure the application using the environment variables in `.env`

**Note:** You will need to create a database before using it in the `DB_CONNECTION_STRING` environment variable (this does not apply if using the included Docker Compose file to deploy)

**Note:** Set the following environment variables in `.env` to meet NHS Digital's recommendation to retain 6 months' worth of logs:

-   `LOG_ROTATION_DATE_FORMAT="YYYY-MM-DD"`
-   `LOG_ROTATION_FREQUENCY="daily"`
-   `LOG_ROTATION_MAX_LOGS="180"`

## Deployment

### Standard Deployment

1. Run `npm install --ignore-scripts --production` to install dependencies
2. Run `npm run db:migrate` to create supporting database, schemas, and tables
3. Run `npm start`

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

### Deploying Using Docker

This requires [Docker](https://www.docker.com) installed.

1. Run `docker compose up` (or `docker compose up -d` to run in background)

### Deploying Using PM2

If you are unable to deploy this into production using Docker, it is recommended that you use a process manager such as [PM2](https://pm2.keymetrics.io/).

1. Run `npm install --ignore-scripts --production` to install dependencies
2. Run `npm run db:migrate` to create supporting database, schemas, and tables
3. Run `npm install -g pm2` to install pm2 globally
4. Launch application with `pm2 start .pm2.config.js`
5. Check the application has been deployed using `pm2 list` or `pm2 monit`

#### To Install as a Windows Service:

If using a Microsoft Windows OS utilise [pm2-installer](https://github.com/jessety/pm2-installer) to install PM2 as a Windows service.

**Note:** PM2 will automatically restart the application if `.env` is modified.

## Contributing

Contributions are welcome, and any help is greatly appreciated!

See [the contributing guide](./CONTRIBUTING.md) for details on how to get started.
Please adhere to this project's [Code of Conduct](./CODE_OF_CONDUCT.md) when contributing.
