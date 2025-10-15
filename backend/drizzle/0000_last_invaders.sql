CREATE TABLE `competencies` (
	`competency_id` text PRIMARY KEY NOT NULL,
	`subdomain_id` text NOT NULL,
	`competency_code` text NOT NULL,
	`competency_title` text NOT NULL,
	`competency_statement` text,
	`sort_order` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`subdomain_id`) REFERENCES `subdomains`(`subdomain_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `course_competencies` (
	`course_competency_id` text PRIMARY KEY NOT NULL,
	`course_id` text NOT NULL,
	`competency_id` text NOT NULL,
	`coverage_level` text,
	`notes` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`course_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`competency_id`) REFERENCES `competencies`(`competency_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `courses` (
	`course_id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`provider` text,
	`duration` text,
	`url` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `domains` (
	`domain_id` text PRIMARY KEY NOT NULL,
	`domain_code` text NOT NULL,
	`domain_name` text NOT NULL,
	`domain_title` text NOT NULL,
	`sort_order` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `performance_criteria` (
	`criteria_id` text PRIMARY KEY NOT NULL,
	`competency_id` text NOT NULL,
	`criteria_text` text NOT NULL,
	`sort_order` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`competency_id`) REFERENCES `competencies`(`competency_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `role_competencies` (
	`role_competency_id` text PRIMARY KEY NOT NULL,
	`role_id` text NOT NULL,
	`competency_id` text NOT NULL,
	`proficiency_level` text DEFAULT 'Required' NOT NULL,
	`is_required` integer DEFAULT true NOT NULL,
	`notes` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`role_id`) REFERENCES `roles`(`role_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`competency_id`) REFERENCES `competencies`(`competency_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `roles` (
	`role_id` text PRIMARY KEY NOT NULL,
	`role_code` text NOT NULL,
	`role_title` text NOT NULL,
	`role_type` text NOT NULL,
	`role_description` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `subdomains` (
	`subdomain_id` text PRIMARY KEY NOT NULL,
	`domain_id` text NOT NULL,
	`subdomain_code` text NOT NULL,
	`subdomain_name` text NOT NULL,
	`subdomain_title` text NOT NULL,
	`sort_order` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`domain_id`) REFERENCES `domains`(`domain_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `competencies_competency_code_unique` ON `competencies` (`competency_code`);--> statement-breakpoint
CREATE UNIQUE INDEX `domains_domain_code_unique` ON `domains` (`domain_code`);--> statement-breakpoint
CREATE UNIQUE INDEX `subdomains_subdomain_code_unique` ON `subdomains` (`subdomain_code`);