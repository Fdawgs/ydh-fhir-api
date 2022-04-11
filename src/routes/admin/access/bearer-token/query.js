const escSq = require("../../../../utils/escape-single-quotes");

/**
 * @author Frazer Smith
 * @description Build SQL query string.
 * @param {object} options - Query string and database config values.
 * @param {string} options.id - Logical id of the artifact.
 * @returns {string} Query string.
 */
const accessDelete = ({ id }) => escSq`DELETE
 FROM access.tokens
 WHERE id = '${id}';`;

/**
 * @author Frazer Smith
 * @description Build SQL query string.
 * @param {object} options - Query string and database config values.
 * @param {string} options.id - Logical id of the artifact.
 * @returns {string} Query string.
 */
const accessGetRead = ({ id }) => escSq`SELECT
    id,
    name,
    email,
    scopes,
    hash,
    salt,
    expires,
    created,
    last_updated
FROM access.tokens
WHERE id = '${id}';`;

/**
 * @author Frazer Smith
 * @description Build SQL query string.
 * @param {object} options - Query string and database config values.
 * @param {string} options.whereClausePredicates - WHERE clause predicates.
 * @param {number} options.page - Page to retrieve.
 * @param {number} options.perPage - Number of API key records to return per page.
 * @returns {string} Query string.
 */
const accessGetSearch = ({ whereClausePredicates, page, perPage }) => `
SELECT COUNT(DISTINCT id) AS total
FROM access.tokens
WHERE ${whereClausePredicates};

SELECT DISTINCT
    id,
    name,
    email,
    scopes,
    hash,
    salt,
    expires,
    created,
    last_updated
FROM access.tokens
WHERE ${whereClausePredicates}
ORDER BY created DESC
OFFSET ${page * perPage} ROWS
FETCH NEXT ${perPage} ROWS ONLY;`;

/**
 * @author Frazer Smith
 * @description Build SQL query string.
 * @param {object} options - Query string and database config values.
 * @param {string} options.name - Type of matching value.
 * @param {string} options.email - Matching Value.
 * @param {string} options.scopes - JSON string containing actions the API key can perform.
 * @param {string} options.hash - Hashed API key.
 * @param {string} options.salt - Salt used on hashed API key.
 * @param {string=} options.expires - Datetime the API key expires.
 * @returns {string} Query string.
 */
const accessPost = ({ name, email, scopes, hash, salt, expires }) =>
	escSq`INSERT INTO access.tokens (name, email, scopes, hash, salt, expires)
    OUTPUT Inserted.id, Inserted.scopes
    VALUES ('${name}', '${email}', '${scopes}', '${hash}', '${salt}', '${expires}');`;

module.exports = {
	accessDelete,
	accessGetRead,
	accessGetSearch,
	accessPost,
};
