const fs = require('node:fs');
const path = require('node:path');

function walkFiles(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(absolutePath));
    } else {
      files.push(absolutePath);
    }
  }

  return files;
}

async function generate(ctx) {
  const templateRoot = path.join(ctx.blueprintRootPath, 'templates');
  const templateFiles = walkFiles(templateRoot).sort((a, b) => a.localeCompare(b));
  const projectName = ctx.manifestName;

  return templateFiles.map((filePath) => {
    const relative = path.relative(templateRoot, filePath).replace(/\\/g, '/');
    const content = fs.readFileSync(filePath, 'utf-8').replace(/{{PROJECT_NAME}}/g, projectName);
    return {
      path: relative,
      content
    };
  });
}

module.exports = {
  generate
};
