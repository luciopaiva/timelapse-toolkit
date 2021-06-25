
const fs = require("fs");
const path = require("path");

const basePath = process.argv[2];

if (!basePath) {
    console.error("Needs base path.");
    process.exit(1);
}

const pattern = /^.*?(\d+)\.png$/i;
const files = fs.readdirSync(basePath)
    .filter(file => pattern.test(file))
    .map(file => path.join(basePath, file))
    .sort();

if (files.length === 0) {
    console.info("No matching files found.");
    process.exit(0);
}

let nextSeq = 0;
let seqDigits = (files.length - 1).toString().length;

for (const file of files) {
    const paddedNextSeq = nextSeq.toString().padStart(seqDigits, "0");
    const newFile = file.replace(/\d+\.png/i, `${paddedNextSeq}.png`);
    fs.renameSync(file, newFile);
    console.info(`Renamed "${file}" to "${newFile}".`);
    nextSeq++;
}
