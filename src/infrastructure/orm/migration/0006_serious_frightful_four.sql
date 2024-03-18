CREATE TABLE `ai_models` (
	`name` varchar(256),
	`ai_name` enum('comfyui'),
	`type` enum('control_net','model','upscale'),
	`description` text,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `ai_models_name` PRIMARY KEY(`name`),
	CONSTRAINT `ai_models_name_idx` UNIQUE(`name`)
);
--> statement-breakpoint
ALTER TABLE `images` RENAME COLUMN `promp` TO `prompt`;--> statement-breakpoint
ALTER TABLE `images_interaction` RENAME COLUMN `created_at` TO `updated_at`;--> statement-breakpoint
ALTER TABLE `images` MODIFY COLUMN `role` enum('UPLOADED','Image To Image','Text To Image');