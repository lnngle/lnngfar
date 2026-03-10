const fs = require('node:fs');
const path = require('node:path');

const IGNORED_DIRS = new Set(['.git', 'node_modules']);

function parseSemver(version) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version);
  if (!match) {
    return null;
  }

  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3])
  };
}

function compareSemver(a, b) {
  if (a.major !== b.major) {
    return a.major - b.major;
  }
  if (a.minor !== b.minor) {
    return a.minor - b.minor;
  }
  return a.patch - b.patch;
}

function pickMaxVersion(versions) {
  const parsed = versions
    .map((item) => ({ raw: item, parsed: parseSemver(item) }))
    .filter((item) => item.parsed !== null);

  if (parsed.length === 0) {
    return null;
  }

  parsed.sort((left, right) => compareSemver(left.parsed, right.parsed));
  return parsed[parsed.length - 1].raw;
}

function collectVersionsFromEditorDirs(rootPath) {
  if (!rootPath || !fs.existsSync(rootPath)) {
    return [];
  }

  const entries = fs.readdirSync(rootPath, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => parseSemver(name) !== null);
}

function collectVersionsFromNamedDirs(rootPath) {
  if (!rootPath || !fs.existsSync(rootPath)) {
    return [];
  }

  const versions = [];
  const entries = fs.readdirSync(rootPath, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const match = /CocosCreator[-_ ]?(\d+\.\d+\.\d+)/i.exec(entry.name);
    if (match) {
      versions.push(match[1]);
    }
  }

  return versions;
}

function resolveCreatorVersion() {
  const envVersion = process.env.LNNGFAR_COCOS_CREATOR_VERSION;
  if (envVersion && parseSemver(envVersion)) {
    return envVersion;
  }

  const home = process.env.USERPROFILE || process.env.HOME || '';
  const localAppData = process.env.LOCALAPPDATA || '';
  const programFiles = process.env.ProgramFiles || '';
  const programFilesX86 = process.env['ProgramFiles(x86)'] || '';

  const candidates = [
    path.join('C:', 'CocosDashboard', 'resources', '.editors'),
    path.join(localAppData, 'Programs', 'cocos-dashboard', 'resources', '.editors'),
    path.join(localAppData, 'Programs', 'CocosDashboard', 'resources', '.editors'),
    path.join(localAppData, 'CocosDashboard', 'resources', '.editors'),
    path.join(programFiles, 'CocosDashboard', 'resources', '.editors'),
    path.join(programFilesX86, 'CocosDashboard', 'resources', '.editors')
  ];

  const directVersionCandidates = [
    path.join('C:', 'CocosDashboard'),
    path.join(localAppData, 'Programs'),
    path.join(programFiles, 'Cocos'),
    path.join(programFilesX86, 'Cocos')
  ];

  const collected = [];
  for (const candidate of candidates) {
    collected.push(...collectVersionsFromEditorDirs(candidate));
  }
  for (const candidate of directVersionCandidates) {
    collected.push(...collectVersionsFromNamedDirs(candidate));
  }

  const projectJsonPath = path.join(home, '.CocosCreator', 'editor', 'project.json');
  if (fs.existsSync(projectJsonPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(projectJsonPath, 'utf-8'));
      const projects = Array.isArray(data.projects) ? data.projects : [];
      for (const project of projects) {
        const version = project?.creatorVersion || project?.version || project?.editorVersion;
        if (typeof version === 'string' && parseSemver(version)) {
          collected.push(version);
        }
      }
    } catch {
      // ignore invalid local config
    }
  }

  return pickMaxVersion(collected) || '3.8.7';
}

function walkFiles(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.isDirectory() && IGNORED_DIRS.has(entry.name)) {
      continue;
    }

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

function patchPackageJson(content, creatorVersion) {
  try {
    const parsed = JSON.parse(content);
    const currentVersion = parsed?.creator?.version;
    if (!parsed.creator || typeof parsed.creator !== 'object') {
      parsed.creator = {};
    }

    if (currentVersion !== creatorVersion) {
      parsed.creator.version = creatorVersion;
    }

    return `${JSON.stringify(parsed, null, 2)}\n`;
  } catch {
    return content;
  }
}

async function generate(ctx) {
  const templateRoot = path.join(ctx.blueprintRootPath, 'templates');
  const templateFiles = walkFiles(templateRoot).sort((a, b) => a.localeCompare(b));
  const creatorVersion = resolveCreatorVersion();

  return templateFiles.map((filePath) => {
    const relative = path.relative(templateRoot, filePath).replace(/\\/g, '/');
    const buffer = fs.readFileSync(filePath);

    if (isProbablyText(buffer)) {
      let content = buffer.toString('utf-8');

      if (relative === 'package.json') {
        content = patchPackageJson(content, creatorVersion);
      }

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
