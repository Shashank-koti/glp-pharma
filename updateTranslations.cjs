const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'i18n', 'locales');
// Read the translations file path from arg
const translationsFile = process.argv[2];
const newTranslations = JSON.parse(fs.readFileSync(translationsFile, 'utf-8'));

Object.keys(newTranslations).forEach(lang => {
  const filePath = path.join(localesDir, `${lang}.json`);
  if (fs.existsSync(filePath)) {
    const currentData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    // Deep merge function
    const merge = (target, source) => {
      for (const key of Object.keys(source)) {
        if (source[key] instanceof Object && key in target) {
          Object.assign(source[key], merge(target[key], source[key]));
        }
      }
      Object.assign(target || {}, source);
      return target;
    };
    
    merge(currentData, newTranslations[lang]);
    fs.writeFileSync(filePath, JSON.stringify(currentData, null, 2));
  }
});
