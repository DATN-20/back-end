CREATE TABLE `albums` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`name` varchar(256) NOT NULL,
	`timestamp` timestamp DEFAULT (now()),
	CONSTRAINT `albums_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `images` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`url` text NOT NULL,
	`role` enum('UPLOADED','GENERATED'),
	`promp` text,
	`addition_info` text,
	`timestamp` timestamp DEFAULT (now()),
	CONSTRAINT `images_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `images_album` (
	`album_id` int NOT NULL,
	`image_id` int NOT NULL,
	`timestamp` timestamp DEFAULT (now())
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`username` varchar(256) NOT NULL,
	`password` varchar(256) NOT NULL,
	`first_name` varchar(256) NOT NULL,
	`last_name` varchar(256) NOT NULL,
	`alias_name` varchar(256),
	`phone` varchar(256),
	`address` varchar(256),
	`description` varchar(256),
	`socials` json,
	`role` enum('ADMIN','ARTIST','ARTIST'),
	`refresh_token` varchar(256),
	`access_token` varchar(256),
	`timestamp` timestamp DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `albums` ADD CONSTRAINT `albums_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `images` ADD CONSTRAINT `images_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `images_album` ADD CONSTRAINT `images_album_album_id_albums_id_fk` FOREIGN KEY (`album_id`) REFERENCES `albums`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `images_album` ADD CONSTRAINT `images_album_image_id_images_id_fk` FOREIGN KEY (`image_id`) REFERENCES `images`(`id`) ON DELETE no action ON UPDATE no action;