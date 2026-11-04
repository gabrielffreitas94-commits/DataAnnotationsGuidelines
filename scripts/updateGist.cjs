const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const GIST_ID = 'a551abab1395c1f911f0d5979c9c09e0';

// Import guideline texts
const guidelinesDir = path.join(__dirname, '..', 'src', 'data', 'guidelines');

function extractExportedString(filePath) {
  const code = fs.readFileSync(filePath, 'utf-8');
  // Match string between backticks
  const match = code.match(/`([\s\S]*?)`;?\s*$/);
  if (!match) {
    throw new Error(`Could not parse template literal from ${filePath}`);
  }
  return match[1];
}

const ptBR = extractExportedString(path.join(guidelinesDir, 'pt-BR.ts'));
const enUS = extractExportedString(path.join(guidelinesDir, 'en-US.ts'));
const es419 = extractExportedString(path.join(guidelinesDir, 'es-419.ts'));
const esES = extractExportedString(path.join(guidelinesDir, 'es-ES.ts'));
const frFR = extractExportedString(path.join(guidelinesDir, 'fr-FR.ts'));
const itIT = extractExportedString(path.join(guidelinesDir, 'it-IT.ts'));
const deDE = extractExportedString(path.join(guidelinesDir, 'de-DE.ts'));

const payload = {
  description: 'DataAnnotation Guidelines — Audio & Voice Prosody Cockpit',
  files: {
    'guideline.md': { content: ptBR },
    'guideline.pt-BR.md': { content: ptBR },
    'guideline.en-US.md': { content: enUS },
    'guideline.es-419.md': { content: es419 },
    'guideline.es-ES.md': { content: esES },
    'guideline.fr-FR.md': { content: frFR },
    'guideline.it-IT.md': { content: itIT },
    'guideline.de-DE.md': { content: deDE },
  },
};

const tmpFile = path.join(__dirname, 'gist_payload.json');
fs.writeFileSync(tmpFile, JSON.stringify(payload, null, 2), 'utf-8');

try {
  console.log(`Updating Gist ${GIST_ID} via gh api...`);
  const output = execSync(`gh api -X PATCH /gists/${GIST_ID} --input "${tmpFile}"`, {
    encoding: 'utf-8',
    maxBuffer: 10 * 1024 * 1024,
  });
  console.log('Successfully updated Gist!');
  const parsed = JSON.parse(output);
  console.log('Gist URL:', parsed.html_url);
} catch (err) {
  console.error('Failed to update Gist:', err.message);
  if (err.stdout) console.error(err.stdout.toString());
  if (err.stderr) console.error(err.stderr.toString());
  process.exit(1);
} finally {
  if (fs.existsSync(tmpFile)) {
    fs.unlinkSync(tmpFile);
  }
}
