ALTER TABLE `images_interaction` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `images_interaction` MODIFY COLUMN `type` enum('like');