ALTER TABLE `albums` RENAME COLUMN `timestamp` TO `created_at`;--> statement-breakpoint
ALTER TABLE `images` RENAME COLUMN `timestamp` TO `created_at`;--> statement-breakpoint
ALTER TABLE `images_album` RENAME COLUMN `timestamp` TO `added_at`;--> statement-breakpoint
ALTER TABLE `users` RENAME COLUMN `timestamp` TO `created_at`;--> statement-breakpoint
ALTER TABLE `albums` ADD `updated_at` timestamp DEFAULT (now());--> statement-breakpoint
ALTER TABLE `users` ADD `updated_at` timestamp DEFAULT (now());