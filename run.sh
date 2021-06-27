
if [ -z "$1" ]; then
  echo "Missing path argument"
  exit 1
fi

if [ ! -d "$1" ]; then
  echo "Invalid directory"
  exit 1
fi

node prefix-with-zeros "${$1}"
node drop-duplicates "${$1}"
node fix-holes "${$1}"
node one-every "${$1}" 3
node fix-holes "${$1}"
node elapsed "${$1}"
node repeat-last "${$1}" 30
node cover "${$1}"
