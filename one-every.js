
const fs = require("fs");
const path = require("path");

const basePath = process.argv[2];
const frameCount = parseInt(process.argv[3]);

if (!basePath) {
    console.error("Needs base path.");
    process.exit(1);
}

if (!Number.isInteger(frameCount) || frameCount <= 0) {
    console.error("Needs to inform x.");
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

let count = 1;
let dropped = 0;
let filesCountMinusLast = files.length - 1;  // make sure to never remove the last one, which is the finished art

for (let i = 1; i < filesCountMinusLast; i++) {
    if (count > 1) {
        fs.unlinkSync(files[i]);
        dropped++;
    }
    if (count === frameCount) {
        count = 1;
    } else {
        count++;
    }
}

console.info(`Total files scanned: ${files.length}.`);
console.info(`Total files dropped: ${dropped}.`);
