# Windows WSL2 instructions: run `nvm use` on the root folder and then `./run.sh <path>`, like so:
# ./run.sh "/mnt/c/Users/myuser/My art folder with spaces/myart/timelapse/"

if [ -z "$1" ]; then
  echo "Missing path argument"
  exit 1
fi

if [ ! -d "$1" ]; then
  echo "Invalid directory"
  exit 1
fi

DIR=$1

node prefix-with-zeros "${DIR}"
node drop-duplicates "${DIR}"
node fix-holes "${DIR}"
node one-every "${DIR}" 4
node fix-holes "${DIR}"
node elapsed "${DIR}"
node repeat-last "${DIR}" 30
node cover "${DIR}"
