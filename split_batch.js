const fs = require('fs');
const path = require('path');

const batchPath = path.join(__dirname, 'batch2.json');
const tempJsPath = path.join(__dirname, 'temp_batch2.js');
const pairsDir = path.join(__dirname, 'data', 'pairs');

if (!fs.existsSync(batchPath)) {
  console.error('batch2.json does not exist!');
  process.exit(1);
}

try {
  const rawContent = fs.readFileSync(batchPath, 'utf8');

  // Write as a valid JavaScript module export
  fs.writeFileSync(tempJsPath, `module.exports = ${rawContent};`, 'utf8');

  // Require it - Node will automatically parse and resolve string escapes
  const batchData = require(tempJsPath);
  let count = 0;

  for (const [pair, data] of Object.entries(batchData)) {
    const pairFilePath = path.join(pairsDir, `${pair}.json`);
    fs.writeFileSync(pairFilePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Created: ${pair}.json`);
    count++;
  }

  console.log(`Successfully split ${count} files from batch2.json`);
  
  // Clean up
  fs.unlinkSync(batchPath);
  fs.unlinkSync(tempJsPath);
  console.log('Cleaned up batch2.json and temporary JS file.');
} catch (error) {
  console.error('Error splitting batch:', error);
  if (fs.existsSync(tempJsPath)) {
    fs.unlinkSync(tempJsPath);
  }
  process.exit(1);
}
