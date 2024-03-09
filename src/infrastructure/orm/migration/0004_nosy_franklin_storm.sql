CREATE TABLE `images_interaction` (
	`user_id` int NOT NULL,
	`image_id` int NOT NULL,
	`type` enum('like') NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `images_interaction_user_id` PRIMARY KEY(`user_id`)
);
--> statement-breakpoint
ALTER TABLE `images` ADD `storage_id` text;--> statement-breakpoint
ALTER TABLE `images_interaction` ADD CONSTRAINT `images_interaction_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `images_interaction` ADD CONSTRAINT `images_interaction_image_id_images_id_fk` FOREIGN KEY (`image_id`) REFERENCES `images`(`id`) ON DELETE cascade ON UPDATE no action;