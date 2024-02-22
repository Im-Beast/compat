export NODE_OPTIONS='--import tsx/esm'
export TSX_TSCONFIG_PATH='./tsconfig.json'

alias deno='deno run --check -A'

echo "Node"

node ./tests/command/mod.ts
node ./tests/read_file/mod.ts

echo "Deno"

deno ./tests/command/mod.ts
deno ./tests/read_file/mod.ts