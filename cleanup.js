const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function walkDir(dir, callback) {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        if (fs.statSync(dirPath).isDirectory()) {
            walkDir(dirPath, callback);
        } else {
            callback(path.join(dir, f));
        }
    });
}

function removeComments(filePath) {
    if (!filePath.match(/\.(tsx|ts|jsx|js|java)$/)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove {/* ... */}
    content = content.replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, '');
    
    // Remove /* ... */
    content = content.replace(/\/\*[\s\S]*?\*\//g, '');
    
    // Remove // ... but NOT http:// or https://
    content = content.replace(/(?<!:)\/\/.*$/gm, '');
    
    // Remove excessive empty lines
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

    fs.writeFileSync(filePath, content, 'utf8');
}

console.log("Limpando comentários do frontend...");
walkDir(path.join(__dirname, 'frontend/src'), removeComments);

console.log("Limpando comentários do backend...");
walkDir(path.join(__dirname, 'src/main/java'), removeComments);

console.log("Formatando frontend com Prettier...");
try {
    execSync('npx --yes prettier --write "src/**/*.{ts,tsx}"', { cwd: path.join(__dirname, 'frontend'), stdio: 'inherit' });
} catch (e) {
    console.error("Aviso: Falha ao rodar o Prettier", e);
}
console.log("Processo concluído.");
