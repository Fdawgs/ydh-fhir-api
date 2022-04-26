// eslint-disable-next-line func-names
module.exports.generateSql = function () {
	return `IF NOT EXISTS ( SELECT remote_name FROM sys.linked_logins link_log
        LEFT JOIN sys.sysservers serv on link_log.server_id = serv.srvid
        WHERE serv.srvname = N'${process.env.DB_LINKED_SERVER_NAME}'
        AND link_log.remote_name = N'${process.env.DB_LINKED_SERVER_USERNAME}' )
    EXEC master.dbo.sp_addlinkedsrvlogin
        @rmtsrvname = N'${process.env.DB_LINKED_SERVER_NAME}',
        @useself = N'False',
        @locallogin = NULL,
        @rmtuser = N'${process.env.DB_LINKED_SERVER_USERNAME}',
        @rmtpassword = '${process.env.DB_LINKED_SERVER_PASSWORD}';`;
};
