-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'admin');

-- CreateEnum
CREATE TYPE "OperationType" AS ENUM ('START', 'ADD', 'SUB', 'MUL', 'DIV');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "avatar_url" TEXT,
    "role" "Role" NOT NULL DEFAULT 'user',
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calculation_nodes" (
    "id" UUID NOT NULL,
    "root_id" UUID,
    "parent_id" UUID,
    "operation" "OperationType" NOT NULL,
    "input_value" DOUBLE PRECISION NOT NULL,
    "calculated_value" DOUBLE PRECISION NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "calculation_nodes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE INDEX "idx_calculation_nodes_root_id" ON "calculation_nodes"("root_id");

-- CreateIndex
CREATE INDEX "idx_calculation_nodes_parent_id" ON "calculation_nodes"("parent_id");

-- CreateIndex
CREATE INDEX "idx_calculation_nodes_user_id" ON "calculation_nodes"("user_id");

-- AddForeignKey
ALTER TABLE "calculation_nodes" ADD CONSTRAINT "calculation_nodes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calculation_nodes" ADD CONSTRAINT "calculation_nodes_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "calculation_nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calculation_nodes" ADD CONSTRAINT "calculation_nodes_root_id_fkey" FOREIGN KEY ("root_id") REFERENCES "calculation_nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
