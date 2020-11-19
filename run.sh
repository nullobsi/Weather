#!/usr/bin/env sh
#designed for my friend's macos machine
echo "Downloading latest version..."
git pull || exit

echo "Build dial renderer..."
cd Canvas || exit
GOOS=js GOARCH=wasm go build -o ../util/Canvas/go_build_Canvas_js || exit
cd ..

echo "Run mod.ts..."
~/.deno/bin/deno run --unstable -A ./mod.ts