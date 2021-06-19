
const fs = require("fs");
const path = require("path");

const basePath = process.argv[2];
const times = parseInt(process.argv[3]);

if (!basePath) {
    console.error("Needs base path.");
    process.exit(1);
}

if (!Number.isInteger(times) || times <= 0) {
    console.error("Needs to inform how many times the last frame should be repeated.");
    process.exit(1);
}

const pattern = /(\d+)\.png$/i;
const files = fs.readdirSync(basePath)
    .filter(file => pattern.test(file))
    .map(file => path.join(basePath, file))
    .sort();

if (files.length === 0) {
    console.info("No matching files found.");
    process.exit(0);
}

const lastFile = files[files.length - 1];
const match = lastFile.match(pattern);
let seq = parseInt(match[1]);
const digits = match[1].length;

for (let i = seq + 1; i <= seq + times; i++) {
    const newFile = lastFile.replace(pattern, i.toString().padStart(digits, "0") + ".png");
    fs.copyFileSync(lastFile, newFile);
}
