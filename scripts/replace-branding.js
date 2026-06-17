const fs = require("fs");
const path = require("path");

const adminDir = path.join(__dirname, "../src/app/admin");

function replaceInFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const updated = content
    .replace(/Y4U INDIA/g, "ThriftTheory")
    .replace(/Y4U/g, "ThriftTheory");
  
  if (content !== updated) {
    fs.writeFileSync(filePath, updated, "utf8");
    console.log(`Updated branding in: ${path.relative(adminDir, filePath)}`);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (file.endsWith(".tsx") || file.endsWith(".ts")) {
      replaceInFile(fullPath);
    }
  }
}

console.log("Replacing old branding in admin dashboard...");
walk(adminDir);
console.log("Replacement completed successfully!");
