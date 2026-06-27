const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const dir = path.join(__dirname, 'images');

fs.readdir(dir, (err, files) => {
  if (err) throw err;
  
  files.forEach(file => {
    if (file.endsWith('.webp')) {
      const filePath = path.join(dir, file);
      const tempPath = path.join(dir, 'temp_' + file);
      
      sharp(filePath)
        .resize({ width: 600, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(tempPath)
        .then(() => {
          fs.renameSync(tempPath, filePath);
          console.log(`Resized and compressed: ${file}`);
        })
        .catch(err => {
          console.error(`Error with ${file}:`, err);
        });
    }
  });
});
