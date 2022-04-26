// eslint-disable-next-line func-names
module.exports.generateSql = function () {
	return `IF NOT EXISTS ( SELECT srvname FROM sys.sysservers WHERE srvname = N'${process.env.DB_LINKED_SERVER_NAME}' )
    EXEC master.dbo.sp_addlinkedserver
        @server = N'${process.env.DB_LINKED_SERVER_NAME}',
        @srvproduct = N'${process.env.DB_LINKED_SERVER_NAME}',
        @provider = N'MSDASQL',
        @datasrc = N'${process.env.DB_LINKED_SERVER_NAME}';`;
};
