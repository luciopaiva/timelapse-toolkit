
const fs = require("fs");
const path = require("path");

const basePath = process.argv[2];

if (!basePath) {
    console.error("Needs base path.");
    process.exit(1);
}

const pattern = /^(\d+)\.png$/i;
const files = fs.readdirSync(basePath)
    .filter(file => pattern.test(file))
    .map(file => path.join(basePath, file))
    .sort();

if (files.length === 0) {
    console.info("No matching files found.");
    process.exit(0);
}

let duplicateCount = 0;

let prevFile = fs.readFileSync(files[0]);
for (let i = 1; i < files.length; i++) {
    let curFile = fs.readFileSync(files[i]);
    if (prevFile.equals(curFile)) {
        fs.unlinkSync(files[i]);
        console.info(`Removed file ${files[i]}.`)
        duplicateCount++;
    } else {
        prevFile = curFile;
    }
}

const duplicatePercentage = (100 * duplicateCount / files.length).toFixed(0);
console.info(`Total files scanned: ${files.length}.`);
console.info(`Duplicates found and removed: ${duplicateCount} (${duplicatePercentage}%).`);
