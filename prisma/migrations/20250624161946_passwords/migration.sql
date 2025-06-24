-- CreateTable
CREATE TABLE "Users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "uuid" UUID NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sitios" (
    "id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sitios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Credenciales" (
    "id" UUID NOT NULL,
    "usuario_id" UUID NOT NULL,
    "sitio_id" UUID NOT NULL,
    "nombre_usuario" TEXT NOT NULL,
    "contrasena_encriptada" TEXT NOT NULL,
    "notas" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Credenciales_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_uuid_key" ON "Users"("uuid");

-- CreateIndex
CREATE INDEX "Users_email_idx" ON "Users"("email");

-- CreateIndex
CREATE INDEX "Users_name_idx" ON "Users"("name");

-- CreateIndex
CREATE INDEX "Users_deletedAt_idx" ON "Users"("deletedAt");

-- CreateIndex
CREATE INDEX "Sitios_nombre_idx" ON "Sitios"("nombre");

-- CreateIndex
CREATE INDEX "Sitios_url_idx" ON "Sitios"("url");

-- CreateIndex
CREATE INDEX "Sitios_deletedAt_idx" ON "Sitios"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Sitios_nombre_url_key" ON "Sitios"("nombre", "url");

-- CreateIndex
CREATE INDEX "Credenciales_usuario_id_idx" ON "Credenciales"("usuario_id");

-- CreateIndex
CREATE INDEX "Credenciales_sitio_id_idx" ON "Credenciales"("sitio_id");

-- CreateIndex
CREATE INDEX "Credenciales_nombre_usuario_idx" ON "Credenciales"("nombre_usuario");

-- CreateIndex
CREATE INDEX "Credenciales_deletedAt_idx" ON "Credenciales"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Credenciales_usuario_id_sitio_id_nombre_usuario_key" ON "Credenciales"("usuario_id", "sitio_id", "nombre_usuario");

-- AddForeignKey
ALTER TABLE "Credenciales" ADD CONSTRAINT "Credenciales_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credenciales" ADD CONSTRAINT "Credenciales_sitio_id_fkey" FOREIGN KEY ("sitio_id") REFERENCES "Sitios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
