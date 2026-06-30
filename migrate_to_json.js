const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'lib', 'pairContent.ts');
const rawTs = fs.readFileSync(filePath, 'utf8');

// Find the start of the DATA object
const dataStartKey = 'const DATA: Record<string, PairContent> = {';
const startIndex = rawTs.indexOf(dataStartKey);

if (startIndex === -1) {
  console.error('Could not find DATA object in pairContent.ts');
  process.exit(1);
}

// Find the end of the DATA object (which is followed by the first function export)
const dataEndKey = '/** Returns unique rich content';
const endIndex = rawTs.indexOf(dataEndKey);

if (endIndex === -1) {
  console.error('Could not find end of DATA object in pairContent.ts');
  process.exit(1);
}

// Extract the DATA object content
let objectContent = rawTs.slice(startIndex + dataStartKey.length - 1, endIndex).trim();

// If it ends with a comma, or functions, trim until the last closing brace
const lastBraceIndex = objectContent.lastIndexOf('}');
objectContent = objectContent.slice(0, lastBraceIndex + 1);

// Write to a temporary JS file
const tempFilePath = path.join(__dirname, 'temp_data.js');
fs.writeFileSync(tempFilePath, `module.exports = ${objectContent};`, 'utf8');

console.log('Created temporary data module.');

// Load the temporary module
const DATA = require(tempFilePath);

// Create data/pairs folder
const pairsDir = path.join(__dirname, 'data', 'pairs');
if (!fs.existsSync(pairsDir)) {
  fs.mkdirSync(pairsDir, { recursive: true });
}

// Write each pair to its own JSON file
let count = 0;
for (const [key, value] of Object.entries(DATA)) {
  const pairFilePath = path.join(pairsDir, `${key}.json`);
  fs.writeFileSync(pairFilePath, JSON.stringify(value, null, 2), 'utf8');
  count++;
}

console.log(`Successfully migrated ${count} pairs to ${pairsDir}`);

// Clean up the temporary file
fs.unlinkSync(tempFilePath);
console.log('Cleaned up temporary files.');
