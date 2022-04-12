-- CreateTable
CREATE TABLE `Scheduling` (
    `date_time` DATETIME(3) NOT NULL,

    PRIMARY KEY (`date_time`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `birth_date` DATETIME(3) NOT NULL,
    `schedulingId` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_schedulingId_fkey` FOREIGN KEY (`schedulingId`) REFERENCES `Scheduling`(`date_time`) ON DELETE RESTRICT ON UPDATE CASCADE;
