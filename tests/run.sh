export NODE_OPTIONS='--import tsx/esm'
export TSX_TSCONFIG_PATH='./tsconfig.json'

echo "Node"

node ./tests/command/mod.ts

echo "Deno"

deno run \
	--allow-run \
	--check ./tests/command/mod.ts