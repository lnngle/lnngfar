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

function isProbablyText(buffer) {
  const inspectLength = Math.min(buffer.length, 2048);
  for (let i = 0; i < inspectLength; i += 1) {
    const byte = buffer[i];
    if (byte === 0) {
      return false;
    }

    const isControl = byte < 32 && byte !== 9 && byte !== 10 && byte !== 13;
    if (isControl) {
      return false;
    }
  }

  return true;
}

async function generate(ctx) {
  const templateRoot = path.join(ctx.blueprintRootPath, 'templates');
  const templateFiles = walkFiles(templateRoot).sort((a, b) => a.localeCompare(b));
  const projectName = ctx.manifestName;

  return templateFiles.map((filePath) => {
    const relative = path.relative(templateRoot, filePath).replace(/\\/g, '/');
    const buffer = fs.readFileSync(filePath);

    if (isProbablyText(buffer)) {
      const content = buffer.toString('utf-8').replace(/{{PROJECT_NAME}}/g, projectName);
      return {
        path: relative,
        content,
        contentEncoding: 'utf-8'
      };
    }

    return {
      path: relative,
      content: buffer.toString('base64'),
      contentEncoding: 'base64'
    };
  });
}

module.exports = {
  generate
};
