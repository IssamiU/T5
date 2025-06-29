CREATE TABLE `Cliente` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `nomeSocial` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Endereco` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `estado` VARCHAR(191) NOT NULL,
    `cidade` VARCHAR(191) NOT NULL,
    `bairro` VARCHAR(191) NOT NULL,
    `rua` VARCHAR(191) NOT NULL,
    `numero` VARCHAR(191) NOT NULL,
    `codigoPostal` VARCHAR(191) NOT NULL,
    `informacoesAdicionais` VARCHAR(191) NULL,
    `clienteId` INTEGER NOT NULL,

    UNIQUE INDEX `Endereco_clienteId_key`(`clienteId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Telefone` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ddd` VARCHAR(191) NOT NULL,
    `numero` VARCHAR(191) NOT NULL,
    `clienteId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Pet` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `raca` VARCHAR(191) NOT NULL,
    `genero` VARCHAR(191) NOT NULL,
    `clienteId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Produto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `preco` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Servico` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `preco` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Consumo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `data` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `quantidade` INTEGER NOT NULL,
    `valorTotal` DOUBLE NOT NULL,
    `clienteId` INTEGER NOT NULL,
    `produtoId` INTEGER NULL,
    `servicoId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `Endereco` ADD CONSTRAINT `Endereco_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `Cliente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `Telefone` ADD CONSTRAINT `Telefone_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `Cliente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `Pet` ADD CONSTRAINT `Pet_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `Cliente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `Consumo` ADD CONSTRAINT `Consumo_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `Cliente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `Consumo` ADD CONSTRAINT `Consumo_produtoId_fkey` FOREIGN KEY (`produtoId`) REFERENCES `Produto`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `Consumo` ADD CONSTRAINT `Consumo_servicoId_fkey` FOREIGN KEY (`servicoId`) REFERENCES `Servico`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
