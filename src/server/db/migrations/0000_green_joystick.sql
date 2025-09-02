CREATE TABLE `beneficiaryTypes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(10) NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `beneficiaryTypes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `children` (
	`id` int AUTO_INCREMENT NOT NULL,
	`id_num` varchar(20) NOT NULL,
	`first_name` varchar(255) NOT NULL,
	`middle_name` varchar(255),
	`last_name` varchar(255) NOT NULL,
	`second_last_name` varchar(255),
	`kinship_id` int NOT NULL,
	`guardian_id` int NOT NULL,
	`identification_id` int NOT NULL,
	`beneficiary_type_id` int NOT NULL,
	`gender_id` int NOT NULL,
	`birth_date` date NOT NULL,
	`affiliation_date` date NOT NULL,
	`deactivation_date` date,
	`country_id` int NOT NULL,
	`state_id` int NOT NULL,
	`city_id` int NOT NULL,
	`birth_state_id` int NOT NULL,
	`birth_city_id` int NOT NULL,
	`education_level_id` int NOT NULL,
	`school_grade_id` int NOT NULL,
	`area_type` enum('urban','rural') NOT NULL,
	`address` varchar(255),
	`ethnicity_id` int NOT NULL,
	`population_id` int NOT NULL,
	`vulnerability_factor_id` int NOT NULL,
	`shift_id` int NOT NULL,
	`indigenous_reserve_id` int NOT NULL,
	`indigenous_community_id` int NOT NULL,
	`deactivation_reason` text,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `children_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(10) NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `cities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `countries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(10) NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `countries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `educationLevels` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(10) NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `educationLevels_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ethnicities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(10) NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `ethnicities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `genders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(10) NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `genders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `guardians` (
	`id` int AUTO_INCREMENT NOT NULL,
	`id_num` varchar(20) NOT NULL,
	`first_name` varchar(255) NOT NULL,
	`middle_name` varchar(255),
	`last_name` varchar(255) NOT NULL,
	`second_last_name` varchar(255),
	`identification_id` int,
	`phone` varchar(10),
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `guardians_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `identifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(5) NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `identifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `indigenousCommunities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(10) NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `indigenousCommunities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `indigenousReserves` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(10) NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `indigenousReserves_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `inventories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`qty` int NOT NULL,
	`resource_id` int NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `inventories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `invetoryTransactionLines` (
	`id` int AUTO_INCREMENT NOT NULL,
	`qty` int NOT NULL,
	`resource_id` int NOT NULL,
	`inventory_transaction_id` int NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `invetoryTransactionLines_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `inventoryTransactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`note` text NOT NULL,
	`type` enum('stock','restock','consume','adjustment') NOT NULL,
	`status` enum('pending','confirmed','rejected') NOT NULL DEFAULT 'pending',
	`supplier_invoice_number` varchar(255),
	`order_number` varchar(255),
	`plan_modality_activity_school_id` int,
	`rejection_note` text,
	`approve_note` text,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `inventoryTransactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `kinships` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(10) NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `kinships_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `modalities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`program_id` int NOT NULL,
	`modality_type_id` int NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `modalities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `modalityTypes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(10) NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `modalityTypes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `planModalities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`plan_id` int NOT NULL,
	`modality_id` int NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `planModalities_id` PRIMARY KEY(`id`),
	CONSTRAINT `planModalities_plan_id_modality_id_unique` UNIQUE(`plan_id`,`modality_id`)
);
--> statement-breakpoint
CREATE TABLE `planModalityActivities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`required_proof_of_completion_count` int NOT NULL,
	`plan_modality_id` int NOT NULL,
	`plan_id` int NOT NULL,
	`service_aipi_id` int NOT NULL,
	`start_date` datetime(3) NOT NULL,
	`end_date` datetime(3) NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `planModalityActivities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `planModalityActivityProofFiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`proof_file_classification_id` int NOT NULL,
	`plan_modality_activity_id` int NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `planModalityActivityProofFiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `planModalityActivityResources` (
	`id` int AUTO_INCREMENT NOT NULL,
	`qty` int NOT NULL,
	`resource_id` int NOT NULL,
	`plan_modality_activity_id` int NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `planModalityActivityResources_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `planModalityActivitySchoolChildren` (
	`id` int AUTO_INCREMENT NOT NULL,
	`plan_modality_activity_school_id` int NOT NULL,
	`child_id` int NOT NULL,
	`status` enum('pending','confirmed','rejected') NOT NULL DEFAULT 'pending',
	`rejection_note` text,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `planModalityActivitySchoolChildren_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `planModalityActivitySchoolProfessionals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`plan_modality_activity_school_id` int NOT NULL,
	`professional_id` int NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `planModalityActivitySchoolProfessionals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `planModalityActivitySchoolProofChildrenAttendances` (
	`id` int AUTO_INCREMENT NOT NULL,
	`plan_modality_activity_school_proof_id` int NOT NULL,
	`plan_modality_activity_school_child_id` int NOT NULL,
	`attended` boolean NOT NULL DEFAULT false,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `planModalityActivitySchoolProofChildrenAttendances_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `planModalityActivitySchoolProofChildrenResources` (
	`id` int AUTO_INCREMENT NOT NULL,
	`plan_modality_activity_school_proof_id` int NOT NULL,
	`plan_modality_activity_school_child_id` int NOT NULL,
	`plan_modality_activity_school_resource_id` int NOT NULL,
	`attended` boolean NOT NULL DEFAULT false,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `planModalityActivitySchoolProofChildrenResources_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `planModalityActivitySchoolProofFiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`plan_modality_activity_school_proof_id` int NOT NULL,
	`proof_file_classification_id` int NOT NULL,
	`file_path` varchar(255) NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `planModalityActivitySchoolProofFiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `planModalityActivitySchoolProofs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`plan_modality_activity_school_id` int NOT NULL,
	`note` text,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `planModalityActivitySchoolProofs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `planModalityActivitySchoolResources` (
	`id` int AUTO_INCREMENT NOT NULL,
	`plan_modality_activity_resource_id` int NOT NULL,
	`plan_modality_activity_school_id` int NOT NULL,
	`resources_qty` int NOT NULL,
	`resources_received_qty` int NOT NULL DEFAULT 0,
	`resources_used_qty` int NOT NULL DEFAULT 0,
	`note` text,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `planModalityActivitySchoolResources_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `planModalityActivitySchools` (
	`id` int AUTO_INCREMENT NOT NULL,
	`plan_modality_activity_id` int NOT NULL,
	`school_id` int NOT NULL,
	`start_date` datetime(3) NOT NULL,
	`end_date` datetime(3) NOT NULL,
	`participants_qty` int NOT NULL,
	`rejection_note` text,
	`status` enum('pending','planning','requested_resources','confirmed_resources','active','completed','verified','rejected') NOT NULL DEFAULT 'pending',
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `planModalityActivitySchools_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `plans` (
	`id` int AUTO_INCREMENT NOT NULL,
	`year` int NOT NULL,
	`long_term_objective` text,
	`short_term_objective` text,
	`justification` text,
	`description` text,
	`status` enum('draft','pending review','reviewed','rejected','approved') DEFAULT 'draft',
	`rejection_note` text,
	`program_id` int NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `plans_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `population` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(10) NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `population_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `professionals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`id_num` varchar(20) NOT NULL,
	`identification_id` int,
	`first_name` varchar(255) NOT NULL,
	`middle_name` varchar(255),
	`last_name` varchar(255) NOT NULL,
	`second_last_name` varchar(255),
	`address` varchar(255),
	`email` varchar(255) NOT NULL,
	`phone` varchar(10),
	`auth_id` int NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `professionals_id` PRIMARY KEY(`id`),
	CONSTRAINT `professionals_email_unique` UNIQUE(`email`),
	CONSTRAINT `professionals_auth_id_unique` UNIQUE(`auth_id`)
);
--> statement-breakpoint
CREATE TABLE `programs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `programs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `proofFileClassifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `proofFileClassifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `resourceClassifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `resourceClassifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `resources` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`price` float NOT NULL,
	`resource_classification_id` int NOT NULL,
	`type` enum('internal','external') NOT NULL DEFAULT 'internal',
	`usage_type` enum('general','individual') NOT NULL DEFAULT 'general',
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `resources_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `resourcesToSuppliers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`supplier_id` int NOT NULL,
	`resource_id` int NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `resourcesToSuppliers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `schoolGrades` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(10) NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `schoolGrades_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `schools` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`infrastructure_code` varchar(255) NOT NULL,
	`dane_code` varchar(255) NOT NULL,
	`branch_code` varchar(255) NOT NULL,
	`area_type` enum('urban','rural') NOT NULL,
	`sector_type` enum('official / public','private','mixed','not applicable') NOT NULL,
	`city_id` int NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `schools_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `servicesAipi` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(10) NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `servicesAipi_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `shifts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(10) NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `shifts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `states` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(10) NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `states_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `suppliers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `suppliers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vulnerabilityFactors` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(10) NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	CONSTRAINT `vulnerabilityFactors_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `children` ADD CONSTRAINT `children_kinship_fk` FOREIGN KEY (`kinship_id`) REFERENCES `kinships`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `children` ADD CONSTRAINT `children_guardian_fk` FOREIGN KEY (`guardian_id`) REFERENCES `guardians`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `children` ADD CONSTRAINT `children_identification_fk` FOREIGN KEY (`identification_id`) REFERENCES `identifications`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `children` ADD CONSTRAINT `children_beneficiary_type_fk` FOREIGN KEY (`beneficiary_type_id`) REFERENCES `beneficiaryTypes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `children` ADD CONSTRAINT `children_gender_fk` FOREIGN KEY (`gender_id`) REFERENCES `genders`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `children` ADD CONSTRAINT `children_country_fk` FOREIGN KEY (`country_id`) REFERENCES `countries`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `children` ADD CONSTRAINT `children_state_fk` FOREIGN KEY (`state_id`) REFERENCES `states`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `children` ADD CONSTRAINT `children_city_fk` FOREIGN KEY (`city_id`) REFERENCES `cities`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `children` ADD CONSTRAINT `children_birth_state_fk` FOREIGN KEY (`birth_state_id`) REFERENCES `states`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `children` ADD CONSTRAINT `children_birth_city_fk` FOREIGN KEY (`birth_city_id`) REFERENCES `cities`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `children` ADD CONSTRAINT `children_education_level_fk` FOREIGN KEY (`education_level_id`) REFERENCES `educationLevels`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `children` ADD CONSTRAINT `children_school_grade_fk` FOREIGN KEY (`school_grade_id`) REFERENCES `schoolGrades`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `children` ADD CONSTRAINT `children_ethnicity_fk` FOREIGN KEY (`ethnicity_id`) REFERENCES `ethnicities`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `children` ADD CONSTRAINT `children_population_fk` FOREIGN KEY (`population_id`) REFERENCES `population`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `children` ADD CONSTRAINT `children_vulnerability_factor_fk` FOREIGN KEY (`vulnerability_factor_id`) REFERENCES `vulnerabilityFactors`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `children` ADD CONSTRAINT `children_shift_fk` FOREIGN KEY (`shift_id`) REFERENCES `shifts`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `children` ADD CONSTRAINT `children_indigenous_reserve_fk` FOREIGN KEY (`indigenous_reserve_id`) REFERENCES `indigenousReserves`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `children` ADD CONSTRAINT `children_indigenous_community_fk` FOREIGN KEY (`indigenous_community_id`) REFERENCES `indigenousCommunities`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `guardians` ADD CONSTRAINT `guardians_identification_fk` FOREIGN KEY (`identification_id`) REFERENCES `identifications`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `inventories` ADD CONSTRAINT `inventories_resource_fk` FOREIGN KEY (`resource_id`) REFERENCES `resources`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invetoryTransactionLines` ADD CONSTRAINT `inv_tran_line_resource_fk` FOREIGN KEY (`resource_id`) REFERENCES `resources`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invetoryTransactionLines` ADD CONSTRAINT `inv_tran_line_inv_tran_fk` FOREIGN KEY (`inventory_transaction_id`) REFERENCES `inventoryTransactions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `inventoryTransactions` ADD CONSTRAINT `plan_modality_activity_school_inventory_fk` FOREIGN KEY (`plan_modality_activity_school_id`) REFERENCES `planModalityActivitySchools`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `modalities` ADD CONSTRAINT `modality_types_fk` FOREIGN KEY (`modality_type_id`) REFERENCES `modalityTypes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `modalities` ADD CONSTRAINT `modality_program_fk` FOREIGN KEY (`program_id`) REFERENCES `programs`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `planModalities` ADD CONSTRAINT `plan_modality_plan_fk` FOREIGN KEY (`plan_id`) REFERENCES `plans`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `planModalities` ADD CONSTRAINT `plan_modality_modality_fk` FOREIGN KEY (`modality_id`) REFERENCES `modalities`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `planModalityActivities` ADD CONSTRAINT `plan_modality_activities_aipi_fk` FOREIGN KEY (`service_aipi_id`) REFERENCES `servicesAipi`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `planModalityActivities` ADD CONSTRAINT `plan_modality_activities_plan_fk` FOREIGN KEY (`plan_id`) REFERENCES `plans`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `planModalityActivities` ADD CONSTRAINT `plan_modality_activities_modality_fk` FOREIGN KEY (`plan_modality_id`) REFERENCES `planModalities`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `planModalityActivityProofFiles` ADD CONSTRAINT `plan_proof_file_classification_fk` FOREIGN KEY (`proof_file_classification_id`) REFERENCES `proofFileClassifications`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `planModalityActivityProofFiles` ADD CONSTRAINT `plan_modality_activity_proof_file_fk` FOREIGN KEY (`plan_modality_activity_id`) REFERENCES `planModalityActivities`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `planModalityActivityResources` ADD CONSTRAINT `plan_modality_activity_resource_fk` FOREIGN KEY (`resource_id`) REFERENCES `resources`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `planModalityActivityResources` ADD CONSTRAINT `plan_modality_activity_resources_modality_activity_fk` FOREIGN KEY (`plan_modality_activity_id`) REFERENCES `planModalityActivities`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `planModalityActivitySchoolChildren` ADD CONSTRAINT `plan_modality_activity_school_child_school_fk` FOREIGN KEY (`plan_modality_activity_school_id`) REFERENCES `planModalityActivitySchools`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `planModalityActivitySchoolChildren` ADD CONSTRAINT `plan_modality_activity_school_child_child_fk` FOREIGN KEY (`child_id`) REFERENCES `children`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `planModalityActivitySchoolProfessionals` ADD CONSTRAINT `plan_modality_activity_school_professional_school_fk` FOREIGN KEY (`plan_modality_activity_school_id`) REFERENCES `planModalityActivitySchools`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `planModalityActivitySchoolProfessionals` ADD CONSTRAINT `plan_modality_activity_school_professional_professional_fk` FOREIGN KEY (`professional_id`) REFERENCES `professionals`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `planModalityActivitySchoolProofChildrenAttendances` ADD CONSTRAINT `plan_modality_activity_school_proof_fk` FOREIGN KEY (`plan_modality_activity_school_proof_id`) REFERENCES `planModalityActivitySchoolProofs`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `planModalityActivitySchoolProofChildrenAttendances` ADD CONSTRAINT `plan_modality_activity_school_proof_children_proof_fk` FOREIGN KEY (`plan_modality_activity_school_child_id`) REFERENCES `planModalityActivitySchoolChildren`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `planModalityActivitySchoolProofChildrenResources` ADD CONSTRAINT `plan_modality_activity_school_proof_children_fk` FOREIGN KEY (`plan_modality_activity_school_proof_id`) REFERENCES `planModalityActivitySchoolProofs`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `planModalityActivitySchoolProofChildrenResources` ADD CONSTRAINT `plan_modality_activity_school_proof_children_school_fk` FOREIGN KEY (`plan_modality_activity_school_child_id`) REFERENCES `planModalityActivitySchoolChildren`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `planModalityActivitySchoolProofChildrenResources` ADD CONSTRAINT `plan_modality_activity_school_proof_resource_school_fk` FOREIGN KEY (`plan_modality_activity_school_resource_id`) REFERENCES `planModalityActivitySchoolResources`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `planModalityActivitySchoolProofFiles` ADD CONSTRAINT `plan_modality_activity_school_proof_file_school_fk` FOREIGN KEY (`plan_modality_activity_school_proof_id`) REFERENCES `planModalityActivitySchoolProofs`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `planModalityActivitySchoolProofFiles` ADD CONSTRAINT `proof_file_classification_fk` FOREIGN KEY (`proof_file_classification_id`) REFERENCES `proofFileClassifications`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `planModalityActivitySchoolProofs` ADD CONSTRAINT `plan_modality_activity_school_proof_school_fk` FOREIGN KEY (`plan_modality_activity_school_id`) REFERENCES `planModalityActivitySchools`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `planModalityActivitySchoolResources` ADD CONSTRAINT `plan_modality_activity_school_resource_school_fk` FOREIGN KEY (`plan_modality_activity_school_id`) REFERENCES `planModalityActivitySchools`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `planModalityActivitySchoolResources` ADD CONSTRAINT `plan_modality_activity_school_resource_resource_fk` FOREIGN KEY (`plan_modality_activity_resource_id`) REFERENCES `planModalityActivityResources`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `planModalityActivitySchools` ADD CONSTRAINT `plan_modality_activity_school_fk` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `planModalityActivitySchools` ADD CONSTRAINT `plan_modality_activity_schools_modality_activity_fk` FOREIGN KEY (`plan_modality_activity_id`) REFERENCES `planModalityActivities`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `plans` ADD CONSTRAINT `plan_program_fk` FOREIGN KEY (`program_id`) REFERENCES `programs`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `professionals` ADD CONSTRAINT `professionals_identification_fk` FOREIGN KEY (`identification_id`) REFERENCES `identifications`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `resources` ADD CONSTRAINT `resources_resource_classification_fk` FOREIGN KEY (`resource_classification_id`) REFERENCES `resourceClassifications`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `resourcesToSuppliers` ADD CONSTRAINT `resources_supplier_fk` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `resourcesToSuppliers` ADD CONSTRAINT `resources_resource_fk` FOREIGN KEY (`resource_id`) REFERENCES `resources`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `inv_tran_supplier_invoice_number_idx` ON `inventoryTransactions` (`supplier_invoice_number`);--> statement-breakpoint
CREATE INDEX `inv_tran_type_idx` ON `inventoryTransactions` (`type`);--> statement-breakpoint
CREATE INDEX `plan_modality_name_idx` ON `planModalityActivities` (`name`);--> statement-breakpoint
CREATE INDEX `plan_modality_activity_schools_status_idx` ON `planModalityActivitySchools` (`status`);--> statement-breakpoint
CREATE INDEX `suppliers_name_idx` ON `suppliers` (`name`);