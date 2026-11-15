const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const sensitiveVariableName =
  /(?:^|_)(?:SECRET|PRIVATE|TOKEN|PASSWORD|CREDENTIALS?|API_KEY|ACCESS_KEY|CLIENT_SECRET|DATABASE_URL|JWT)(?:_|$)/i;
const explicitPublicKeyName = /(?:^|_)PUBLIC_(?:API_)?KEY$/i;
const privateWord = /(?:SECRET|PRIVATE|TOKEN|PASSWORD|CREDENTIAL)/i;

const credentialPatterns = [
  ["private key material", /-----BEGIN (?:RSA |DSA |EC |OPENSSH )?PRIVATE KEY-----/],
  ["AWS access key", /\bAKIA[0-9A-Z]{16}\b/],
  ["GitHub token", /\bgh[pousr]_[A-Za-z0-9]{20,}\b/],
  ["Slack token", /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/],
  ["Stripe secret key", /\b(?:sk|rk)_live_[A-Za-z0-9]{12,}\b/],
  ["Google API key", /\bAIza[0-9A-Za-z_-]{35}\b/],
  ["OpenAI secret key", /\bsk-(?:proj-)?[A-Za-z0-9_-]{30,}\b/],
  ["JWT", /\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/],
];

const inlineSecretAssignment =
  /\b([A-Za-z_][A-Za-z0-9_]*(?:API[_-]?KEY|ACCESS[_-]?TOKEN|REFRESH[_-]?TOKEN|CLIENT_SECRET|PRIVATE[_-]?KEY|PASSWORD|CREDENTIALS?))\b\s*[:=]\s*["'`]([^"'`\r\n]{8,})["'`]/gi;
const ignoredDirectories = new Set([
  ".git",
  "node_modules",
  "build",
  "coverage",
  "gh-pages-temp",
]);

const findings = new Set();

function checkVariableName(name, source) {
  if (!name.startsWith("REACT_APP_") || !sensitiveVariableName.test(name)) {
    return;
  }

  const explicitlyPublic =
    explicitPublicKeyName.test(name) && !privateWord.test(name);
  if (!explicitlyPublic) {
    findings.add(`${source}: ${name} looks sensitive and would be bundled for browsers`);
  }
}

function checkValue(value, source) {
  for (const [label, pattern] of credentialPatterns) {
    if (pattern.test(value)) {
      findings.add(`${source}: detected ${label}`);
    }
    pattern.lastIndex = 0;
  }
}

function readEnvironmentFile(filePath) {
  const fileName = path.basename(filePath);
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);

  lines.forEach((line, index) => {
    const match = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!match) return;

    const [, name, rawValue] = match;
    const source = `${fileName}:${index + 1}`;
    checkVariableName(name, source);
    checkValue(rawValue, source);
  });
}

function walkFiles(directory) {
  if (!fs.existsSync(directory)) return [];

  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) return [];
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walkFiles(entryPath) : [entryPath];
  });
}

const environmentFiles = fs
  .readdirSync(projectRoot)
  .filter((name) => /^\.env(?:\.|$)/.test(name))
  .map((name) => path.join(projectRoot, name));

for (const filePath of environmentFiles) {
  readEnvironmentFile(filePath);
}

for (const [name, value] of Object.entries(process.env)) {
  if (name.startsWith("REACT_APP_")) {
    checkVariableName(name, "process environment");
    checkValue(value, "process environment");
  }
}

for (const filePath of walkFiles(projectRoot)) {
  let content;
  try {
    content = fs.readFileSync(filePath, "utf8");
  } catch {
    continue;
  }

  if (content.includes("\u0000")) continue;

  const relativePath = path.relative(projectRoot, filePath);
  const lines = content.split(/\r?\n/);
  lines.forEach((line, index) => {
    const source = `${relativePath}:${index + 1}`;
    checkValue(line, source);

    inlineSecretAssignment.lastIndex = 0;
    const match = inlineSecretAssignment.exec(line);
    if (match) {
      findings.add(`${source}: hard-coded value assigned to ${match[1]}`);
    }
  });
}

if (findings.size > 0) {
  console.error("Client secret check failed. Keep private credentials out of browser code:");
  for (const finding of findings) console.error(`- ${finding}`);
  process.exit(1);
}

console.log("Client secret check passed.");
