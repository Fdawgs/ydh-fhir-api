# Yeovil District Hospital NHS Foundation Trust - FHIR API - History

## Background

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
Clients using the web app need to be able to make GET requests to RESTful HL7® FHIR® API endpoints to retrieve a set of seven FHIR resources that adhere to their respective [NHS Care Connect API profiles](https://nhsconnect.github.io/CareConnectAPI/) to populate the record, the resources being:

-   AllergyIntolerance
-   CapabilityStatement
-   Encounter
-   Flag
-   MedicationStatement
-   Patient
-   Procedure

## Original Development

These APIs were originally built and deployed using a combination of [Mirth Connect channels](https://github.com/Fdawgs/ydh-fhir-listeners) and a Node.js [authentication service}(https://github.com/Fdawgs/ydh-fhir-authentication-service) that acted as middleware. However, Mirth Connect has its limitations (poor E2E and unit testing support; difficult to extend etc.) and it was decided to rewrite the APIs fully in Node.js.
