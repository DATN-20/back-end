ALTER TABLE `albums` DROP FOREIGN KEY `albums_user_id_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `images` DROP FOREIGN KEY `images_user_id_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `images_album` DROP FOREIGN KEY `images_album_album_id_albums_id_fk`;
--> statement-breakpoint
ALTER TABLE `albums` ADD CONSTRAINT `albums_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `images` ADD CONSTRAINT `images_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `images_album` ADD CONSTRAINT `images_album_album_id_albums_id_fk` FOREIGN KEY (`album_id`) REFERENCES `albums`(`id`) ON DELETE cascade ON UPDATE no action;