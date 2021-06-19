
const fs = require("fs");
const path = require("path");

const basePath = process.argv[2];

if (!basePath) {
    console.error("Needs base path.");
    process.exit(1);
}

const ext = ".png";
const pattern = /^(\d+)\.png$/i;
let maxSeq = 0;
let maxSeqStr = "0";
const files = new Set();

for (const file of fs.readdirSync(basePath)) {
    const match = file.match(pattern);
    if (match) {
        const seq = parseInt(match[1]);
        if (seq > maxSeq) {
            maxSeq = seq;
            maxSeqStr = match[1];
        }
        files.add(seq);
    }
}

const numberOfDigits = maxSeqStr.length;
console.info(`Maximum sequence is: ${maxSeq}`);
console.info(`Number of digits: ${numberOfDigits}`);

for (const file of files) {
    const left = path.join(basePath, file.toString() + ext);
    const right = path.join(basePath, file.toString().padStart(numberOfDigits, "0") + ext);
    fs.renameSync(left, right);
}
