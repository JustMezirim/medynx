const fs = require('fs');
const path = require('path');

// Fix mixed quote issues
function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Fix mixed quotes like "doctor' or 'doctor"
  const mixedQuoteRegex1 = /"([^"]*?)'/g;
  if (content.match(mixedQuoteRegex1)) {
    content = content.replace(mixedQuoteRegex1, '"$1"');
    changed = true;
  }

  const mixedQuoteRegex2 = /'([^']*?)"/g;
  if (content.match(mixedQuoteRegex2)) {
    content = content.replace(mixedQuoteRegex2, "'$1'");
    changed = true;
  }

  // Fix &apos; followed by '
  const aposQuoteRegex = /&apos;'/g;
  if (content.match(aposQuoteRegex)) {
    content = content.replace(aposQuoteRegex, "'");
    changed = true;
  }

  // Fix template literals with mixed quotes
  const templateMixedRegex = /\$\{[^}]*?['"][^}]*?&apos;[^}]*?\}/g;
  if (content.match(templateMixedRegex)) {
    content = content.replace(templateMixedRegex, (match) => {
      return match.replace(/&apos;/g, "'").replace(/["']/g, "'");
    });
    changed = true;
  }

  // Fix className with mixed quotes
  const classNameRegex = /className=\{['`][^}]*?&apos;[^}]*?['`]\}/g;
  if (content.match(classNameRegex)) {
    content = content.replace(classNameRegex, (match) => {
      return match.replace(/&apos;/g, "'");
    });
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log(`Fixed: ${filePath}`);
  }
}

// Walk through src directory
function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fixFile(filePath);
    }
  });
}

// Start fixing
console.log('Fixing mixed quote issues...');
walkDir('./src');
console.log('Done!');