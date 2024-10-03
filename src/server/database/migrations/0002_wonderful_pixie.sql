CREATE INDEX `orders_userId_Idx` ON `orders` (`user_id`);--> statement-breakpoint
CREATE INDEX `orders_productId_Idx` ON `orders` (`product_id`);--> statement-breakpoint
CREATE INDEX `is_available_for_purchase_idx` ON `products` (`is_available_for_purchase`);--> statement-breakpoint
CREATE UNIQUE INDEX `email_idx` ON `users` (`email`);