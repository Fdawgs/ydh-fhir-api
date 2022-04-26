INSERT INTO lookup.patient_alerts
    (trakcare_code, trakcare_display, snomed_code, snomed_display, comments)
VALUES
    (N'ABU', N'History of Violence / Abuse', NULL, NULL, NULL),
    (N'ANTI', N'Significant Antibodies', NULL, NULL, NULL),
    (N'ARA', N'At Risk Adult', N'225915006', N'At risk of abuse', NULL),
    (N'ARC', N'At Risk Child', N'704659007', N'At risk of child abuse', NULL),
    (N'AST', N'Asthmatic', N'195967001', N'Asthma', NULL),
    (N'ATHENA', N'Athena notes on patient centre', NULL, NULL, NULL),
    (N'BABY', N'Baby loss', NULL, NULL, N'Unable to map as there are multiple types of baby loss: during birth; before birth; shortly after birth. There is no singular general SNOMED code.'),
    (N'BLE', N'Bleeding Disorder/s', N'64779008', N'Blood coagulation disorder', NULL),
    (N'BMI40', N'BMI>40', N'408512008', N'Body mass index 40+ - severely obese', NULL),
    (N'BRE', N'Breast Feeding Mother', N'169750002', N'Mother currently breast-feeding', NULL),
    (N'CANCFU', N'Cancer Follow Up', N'719864002', N'Monitoring following treatment for cancer', NULL),
    (N'CDIFF', N'Clostridium Difficile', N'186431008', N'Clostridium difficile infection', NULL),
    (N'CJD', N'CJD Risk', N'416805005', N'At risk of variant Creutzfeldt-Jakob disease', NULL),
    (N'CO2RET', N'CO2 Retainer', N'29596007', N'Hypercapnia', NULL),
    (N'COM', N'Communication or Language Difficulties', N'32000005', N'Difficulty using verbal communication', NULL),
    (N'CONFU', N'Prone to Confusion', N'706880001', N'At risk of confusion', NULL),
    (N'COPD', N'COPD', N'13645005', N'Chronic obstructive lung disease', NULL),
    (N'CPE', N'CPE  - Carbapenemase-producing Enterobacteriaceae', N'734351004', N'Carbapenemase-producing Enterobacteriaceae', NULL),
    (N'CTIMP', N'Drug Trial', N'713670002', N'Entered into drug clinical trial', NULL),
    (N'DDA', N'Do not disclose patient address', NULL, NULL, NULL),
    (N'DELER', N'Delirium', N'2776000', N'Delirium', NULL),
    (N'DEME', N'Dementia Pt', N'52448006', N'Dementia', NULL),
    (N'DEP', N'Deprivation of Liberty (DOL)', NULL, NULL, NULL),
    (N'DIF', N'Difficult intubation or airway management', N'718447001', N'Difficult intubation', NULL),
    (N'DNR', N'Do Not Resuscitate Pt', N'304253006', N'Not for resuscitation', NULL),
    (N'EDCP', N'ED Care Plan', NULL, NULL, NULL),
    (N'EOLCP', N'End of Life Care Plan', N'713673000', N'Has end of life care plan', NULL),
    (N'EPI', N'Epileptic', N'84757009', N'Epilepsy', NULL),
    (N'FEEDASSIST', N'Needs Assistance with Feeding', N'129033007', N'Feeding assisted', NULL),
    (N'FETALAB', N'Fetal abnormality', NULL, NULL, N'Unable to map as there are multiple SNOMED codes for fetal abnormalities but not a singular general code'),
    (N'FRA', N'Frailty', N'248279007', N'Frailty', NULL),
    (N'GBSTR', N'Group B Strep', N'426933007', N'Streptococcus agalactiae infection', NULL),
    (N'GRE', N'GRE- Glycopeptide Resistant Enterococcus', N'1065701000000100', N'Infection caused by glycopeptide resistant enterococcus', NULL),
    (N'HAEMACT', N'Haematology Active Treatment', NULL, NULL, NULL),
    (N'HAEMFU', N'Haematology Follow Up', NULL, NULL, NULL),
    (N'HEA', N'Heart Failure Patient', N'161505003', N'H/O: heart failure', NULL),
    (N'HEI', N'Hearing Impaired', N'15188001', N'Hearing loss', NULL),
    (N'INF', N'Other ', NULL, NULL, NULL),
    (N'LEGACYALERT', N'Legacy Alert and/or Allergy Information', NULL, NULL, NULL),
    (N'LTOT', N'Home Oxygen Therapy', N'426990007', N'Home oxygen therapy', NULL),
    (N'MAL', N'Malignant Hyperthermia Risk', NULL, NULL, NULL),
    (N'MRGNO', N'MRGNO – Multi-resistant Gram-negative ', NULL, NULL, NULL),
    (N'MRSA', N'MRSA', N'13790001000004100', N'Bacteraemia due to Methicillin resistant Staphylococcus aureus', NULL),
    (N'NBI', N'Newborn Feeding Issue', N'72552008', N'Feeding problems in newborn', NULL),
    (N'NBMO', N'Nil By Mouth', N'182923009', N'Nil by mouth', NULL),
    (N'NONCTIMP', N'Non-drug Trial', NULL, NULL, NULL),
    (N'ONCACTI', N'Cancer Active Treatment', N'395073001', N'Cancer treatment started', NULL),
    (N'OSA', N'Obstructive Sleep Apnoea (OSA)', N'78275009', N'Obstructive sleep apnoea syndrome', NULL),
    (N'PAC', N'Pacemaker in situ', N'441509002', N'Cardiac pacemaker in situ', NULL),
    (N'PAL', N'Palliative Care Patient', N'103735009', N'Palliative care', NULL),
    (N'PCN', N'Parent / Carer Notification', NULL, NULL, NULL),
    (N'PCP', N'Paediatric Complex Patient', NULL, NULL, NULL),
    (N'PON', N'Severe post-operative nausea / vomiting', NULL, NULL, NULL),
    (N'PPP', N'Previous Puerperal Psychosis', N'726623007', N'H/O: postpartum psychosis', NULL),
    (N'PRE', N'Pregnancy', N'77386006', N'Pregnant', NULL),
    (N'PRK', N'Parkinsons Disease Pt', N'49049000', N'Parkinson''s disease', NULL),
    (N'PVL', N'PVL Staph Aureus', N'446413008', N'Infection due to Panton-Valentine leucocidin producing Staphylococcus aureus', NULL),
    (N'REG', N'Registered Therapeutic Addict Patient', NULL, NULL, NULL),
    (N'REN', N'Renal Dialysis Patient', N'265764009', N'Renal dialysis', NULL),
    (N'RESORG', N'Resistant Organism- refer to notes', NULL, NULL, NULL),
    (N'SEC2', N'Detained-Section 2', N'413191000000109', N'Detained in hospital under Section 2 of the Mental Health Act 1983 (England and Wales)', NULL),
    (N'SEC3', N'Detained-Section 3', N'431071000000100', N'Detained in hospital under Section 3 of the Mental Health Act 1983 (England and Wales)', NULL),
    (N'SEC5', N'Detained-Section 5(2)', N'470621000000104', N'Detained in hospital under Section 5 (2) of the Mental Health Act 1983 (England and Wales)', NULL),
    (N'SECO', N'Detained-Other', NULL, NULL, NULL),
    (N'SIMEN', N'Significant Psychiatrc History', N'161464003', N'H/O: psychiatric disorder', NULL),
    (N'SPE', N'Speech Impaired', N'29164008', N'Disturbance in speech', NULL),
    (N'STRK', N'Stroke', N'230690007', N'Stroke', NULL),
    (N'SUX', N'Suxamethonium (Scoline) Apnoea Risk', N'54602006', N'Suxamethonium apnoea', NULL),
    (N'SWAL', N'Impaired Swallow', N'399122003', N'Swallowing problem', NULL),
    (N'TEP', N'Treatment Escalation Plan', N'735324008', N'Treatment escalation plan', NULL),
    (N'TIA', N'TIA', N'266257000', N'Transient cerebral ischaemia', NULL),
    (N'TYPE1DM', N'Type 1 Diabetes', N'46635009', N'Type 1 diabetes mellitus', NULL),
    (N'TYPE2DM', N'Type 2 Diabetes', N'44054006', N'Type 2 diabetes mellitus', NULL),
    (N'VIS', N'Visually Impaired', N'397540003', N'Visual impairment', NULL),
    (N'W10', N'Not for Ward 10', NULL, NULL, N'Unique to YDH; Ward 10 is Paediatric ward'),
    (N'WAND', N'Wanderer/Absconder', N'50239007', N'Wandering', NULL),
    (N'YBF', N'Patient is Breastfeeding Pt', N'169741004', N'Breast fed', NULL),
    (N'YDHEADD', N'Addison''s Disease', N'363732003', N'Addison''s disease', NULL),
    (N'YDHFALL', N'Fall Risk Alert', N'129839007', N'At risk for falls', NULL),
    (N'YDHLD', N'Learning Disability', N'1855002', N'Developmental academic disorder', NULL),
    (N'YDHSYMP', N'Symphony Patient', NULL, NULL, N'Unique to YDH'),
    (N'WN-CoV', N'WN-CoV: Pending - Swab Taken', N'840544004', N'Suspected COVID-19', NULL),
    (N'WIN-CoV-Negative', N'WN-CoV: Negative', NULL, NULL, NULL),
    (N'WIN-CoV-Positive', N'WN-CoV: Positive', N'840539006', N'COVID-19', NULL),
    (N'YDHUPPERGI', N'Upper G I', NULL, NULL, NULL);

INSERT INTO lookup.patient_ethnicity
    (trakcare_code, trakcare_display, care_connect_code, care_connect_display, comments)
VALUES
    (N'A', N'White British', N'A', N'British, Mixed British', NULL),
    (N'B', N'White Irish', N'B', N'Irish', NULL),
    (N'C', N'Any other White background', N'C', N'Any other White background', NULL),
    (N'D', N'White and Black Caribbean', N'D', N'White and Black Caribbean', NULL),
    (N'E', N'White and Black African', N'E', N'White and Black African', NULL),
    (N'F', N'White and Asian', N'F', N'White and Asian', NULL),
    (N'G', N'Any other mixed background', N'G', N'Any other mixed background', NULL),
    (N'H', N'Indian', N'H', N'Indian or British Indian', NULL),
    (N'J', N'Pakistani', N'J', N'Pakistani or British Pakistani', NULL),
    (N'K', N'Bangladeshi', N'K', N'Bangladeshi or British Bangladeshi', NULL),
    (N'L', N'Any other Asian background', N'L', N'Any other Asian background', NULL),
    (N'M', N'Caribbean', N'M', N'Caribbean', NULL),
    (N'N', N'African', N'N', N'African', NULL),
    (N'P', N'Any other Black background', N'P', N'Any other Black background', NULL),
    (N'R', N'Chinese', N'R', N'Chinese', NULL),
    (N'S', N'Any other ethnic group', N'S', N'Any other ethnic group', NULL),
    (N'Z', N'Not stated', N'Z', N'Not stated', NULL),
    (N'99', N'Not Known', N'Z', N'Not stated', N'No corresponding value for Not Known, mapped to Z');