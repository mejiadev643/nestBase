const fs = require('fs');
const path = require('path');
// Obtener la raíz del proyecto
const rootDir = process.cwd();

const prismaDir = path.join(rootDir, 'prisma');
const modelsDir = path.join(prismaDir, 'models');
const schemaPath = path.join(prismaDir, 'schema.prisma');

const mainSchema = `
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["relationJoins"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
`;

const models = fs
  .readdirSync(modelsDir)
  .map((file) => fs.readFileSync(path.join(modelsDir, file), 'utf-8'))
  .join('\n\n');

fs.writeFileSync(schemaPath, `${mainSchema}\n\n${models}`);
console.log('Schema merged successfully!');
