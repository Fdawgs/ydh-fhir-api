const dbError = { recordsets: [[]] };

const dbSTU3Flag = {
	recordsets: [
		[
			{
				id: "126844-10",
				status: "active",
				category_coding_display: "Maternity",
				category_coding_code: "YDHMATR",
				code_coding_display: "Baby loss",
				code_coding_code: "BABY",
				subject_reference: "5484125",
				period_start: "2017-03-07T06:55:53",
				period_end: "1900-01-01T00:00:00",
				code_coding_snomed_code: null,
				code_coding_snomed_display: null,
				last_updated: "2017-03-07T06:55:53",
			},
		],
	],
};

module.exports = {
	dbError,
	dbSTU3Flag,
};
