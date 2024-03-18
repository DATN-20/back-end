ALTER TABLE `images` MODIFY COLUMN `role` enum('UPLOADED','Image To Image','Text To Image');--> statement-breakpoint
ALTER TABLE `images_interaction` MODIFY COLUMN `type` enum('like') NOT NULL;--> statement-breakpoint
ALTER TABLE `images_interaction` ADD PRIMARY KEY(`image_id`,`user_id`,`type`);--> statement-breakpoint
ALTER TABLE `images` ADD `visibility` enum('PUBLIC','PRIVATE','HIDDEN');