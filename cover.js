
const fs = require("fs");
const path = require("path");

const basePath = process.argv[2];

if (!basePath) {
    console.error("Needs base path.");
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

const oldLastFile = files[files.length - 1];
const match = oldLastFile.match(pattern);
let newLastSeq = parseInt(match[1]) + 1;
const digits = newLastSeq.toString().length;
let newLastFile = "";

// move everybody one up
for (const file of files.reverse()) {
    const oldSeq = parseInt(file.match(pattern)[1]);
    const newSeq = oldSeq + 1;
    const newFile = oldLastFile.replace(pattern, newSeq.toString().padStart(digits, "0") + ".png");
    console.info(file, newFile);
    fs.renameSync(file, newFile);

    if (newLastFile.length === 0) {
        newLastFile = newFile;
    }
}

// copy last to position 0
const firstFile = newLastFile.replace(pattern, "0".toString().padStart(digits, "0") + ".png");
console.info(newLastFile, firstFile);
fs.copyFileSync(newLastFile, firstFile);
