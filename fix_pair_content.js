const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'lib', 'pairContent.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Let's find all instances of double-backslash-quote or triple-backslash-quote in single-quoted strings
// In the source file, it looks like: \\'
// Let's log them first to see what we are replacing.
const matches = [];
const lines = content.split('\n');
lines.forEach((line, index) => {
  if (line.includes("\\\\'")) {
    matches.push({ lineNum: index + 1, content: line.trim() });
  }
});

console.log('Found matches:', matches);

// Replace double backslash quote with single backslash quote
// Since \\' in string is represented as \\\\' in regex:
const updatedContent = content.replace(/\\\\'/g, "\\'");

fs.writeFileSync(filePath, updatedContent, 'utf8');
console.log('File updated successfully!');
