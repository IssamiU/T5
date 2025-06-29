ALTER TABLE `consumo` DROP FOREIGN KEY `Consumo_clienteId_fkey`;

ALTER TABLE `endereco` DROP FOREIGN KEY `Endereco_clienteId_fkey`;

ALTER TABLE `pet` DROP FOREIGN KEY `Pet_clienteId_fkey`;

ALTER TABLE `telefone` DROP FOREIGN KEY `Telefone_clienteId_fkey`;

DROP INDEX `Consumo_clienteId_fkey` ON `consumo`;

DROP INDEX `Pet_clienteId_fkey` ON `pet`;

DROP INDEX `Telefone_clienteId_fkey` ON `telefone`;

ALTER TABLE `consumo` ADD COLUMN `itemNome` VARCHAR(191) NOT NULL,
    ADD COLUMN `itemTipo` VARCHAR(191) NOT NULL,
    ADD COLUMN `precoUnitario` DOUBLE NOT NULL,
    ALTER COLUMN `data` DROP DEFAULT;

ALTER TABLE `pet` MODIFY `raca` VARCHAR(191) NULL;

ALTER TABLE `Endereco` ADD CONSTRAINT `Endereco_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `Cliente`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Telefone` ADD CONSTRAINT `Telefone_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `Cliente`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Pet` ADD CONSTRAINT `Pet_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `Cliente`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Consumo` ADD CONSTRAINT `Consumo_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `Cliente`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
