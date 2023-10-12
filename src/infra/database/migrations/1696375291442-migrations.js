module.exports = class Initial1688580760046 {
  async up(queryRunner) {
    await queryRunner.query(`
          CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        `);

    await queryRunner.query(`
          CREATE TABLE "Address" (
            "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            "address" VARCHAR(255),
            "complement" VARCHAR(255),
            "number" VARCHAR(255),
            "district" VARCHAR(255),
            "cep" VARCHAR(255),
            "city" VARCHAR(255),
            "state" VARCHAR(255),
            "createdAt" TIMESTAMP,
            "updatedAt" TIMESTAMP,
            "deletedAt" TIMESTAMP
          );
        `);

    await queryRunner.query(`
          CREATE TABLE "Customer" (
            "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            "name" VARCHAR(255),
            "email" VARCHAR(255),
            "companyId" UUID,
            "phone" VARCHAR(255),
            "cpfCnpj" VARCHAR(255),
            "whatsapp" VARCHAR(255),
            "createdAt" TIMESTAMP,
            "updatedAt" TIMESTAMP,
            "deletedAt" TIMESTAMP,
            "addressId" UUID REFERENCES "Address"("id")
          );
        `);

    // Adicione os relacionamentos nas tabelas
    await queryRunner.query(`
          ALTER TABLE "Customer" ADD CONSTRAINT "FK_Customer_Address" FOREIGN KEY ("addressId") REFERENCES "Address"("id");
        `);
  }

  async down(queryRunner) {
    await queryRunner.query(`;
        DROP TABLE "Customer";
        DROP TABLE "Address";
      `);
  }
};
