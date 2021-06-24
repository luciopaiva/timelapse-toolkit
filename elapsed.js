
const fs = require("fs");
const path = require("path");
const moment = require("moment");

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

let previousTime = 0;
let durationInMillis = 0;
const thresholdInMillis = 1000 * 60 * 5;  // maximum time between snapshots to consider as active work

for (const file of files) {
    const s = fs.statSync(file);
    if (previousTime > 0) {
        const elapsed = s.mtimeMs - previousTime;
        if (elapsed < thresholdInMillis) {
            durationInMillis += elapsed;
        }
    }
    previousTime = s.mtimeMs;
}

console.info(moment.duration(durationInMillis).humanize());
