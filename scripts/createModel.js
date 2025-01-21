const fs = require('fs');
const path = require('path');

// Ruta al directorio de modelos
const prismaDir = path.join(__dirname, '../prisma');
const modelsDir = path.join(prismaDir, 'models');

// Crear la carpeta `models` si no existe
if (!fs.existsSync(modelsDir)) {
    fs.mkdirSync(modelsDir, { recursive: true });
    console.log(`📁 Carpeta creada: ${modelsDir}`);
}
// Obtener fecha actual
const getCurrentDateTime = () => new Date().toISOString().replaceAll('T', '_').replaceAll('Z', '').split('.')[0].replaceAll(':', '-');//.replaceAll('-','');

// Template para generar un modelo
const generateModelTemplate = (modelName) => `
model ${modelName} {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
`;

(async () => {
    const modelName = process.argv[2];
    if (!modelName) {
        console.error('❌ Por favor, proporciona un nombre para el modelo.');
        process.exit(1);
    }

    const capitalizedModelName =
        modelName.charAt(0).toUpperCase() + modelName.slice(1);
    // Verificar si ya existe un modelo con el mismo nombre
    const files = fs.readdirSync(modelsDir);
    const modelExists = files.some((file) => {
        const match = file.match(/_Model_(\w+)\.prisma$/);
        return match && match[1] === capitalizedModelName;
    });

    if (modelExists) {
        console.error(`❌ El modelo ${capitalizedModelName} ya existe.`);
        process.exit(1);
    }

    const modelFile = path.join(modelsDir, `${getCurrentDateTime()}_Model_${capitalizedModelName}.prisma`);

    try {
        fs.writeFileSync(modelFile, generateModelTemplate(capitalizedModelName));
        console.log(`✅ Modelo ${capitalizedModelName} creado en ${modelFile}`);
    } catch (error) {
        console.error('❌ Error al crear el modelo:', error.message);
    }
})();
