-- AlterTable
ALTER TABLE `user` ADD COLUMN `status` ENUM('attended', 'not_attended', 'pending') NOT NULL DEFAULT 'pending';
