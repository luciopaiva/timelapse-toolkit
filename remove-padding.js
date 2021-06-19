
const fs = require("fs");
const path = require("path");

const basePath = process.argv[2];

if (!basePath) {
    console.error("Needs base path.");
    process.exit(1);
}

const pattern = /(.*?)(\d+)(\.png)$/i;
const files = fs.readdirSync(basePath)
    .filter(file => pattern.test(file))
    .map(file => path.join(basePath, file))
    .sort();

if (files.length === 0) {
    console.info("No matching files found.");
    process.exit(0);
}

for (const file of files) {
    const match = file.match(pattern);
    const seq = parseInt(match[2]);
    const newFile = match[1] + seq + match[3];
    fs.renameSync(file, newFile);
}
