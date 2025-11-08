#!/usr/bin/env bash
set -e  # para o script se algo falhar

# === CONFIGURAÇÃO ===
SRC="./src/main.c"
OUT_DIR="./dist"
OUT_JS="$OUT_DIR/main.js"
PORT=8080

# === ATIVAR EMSDK ===
if [ -f "$HOME/Documents/emsdk/emsdk_env.sh" ]; then
  source "$HOME/Documents/emsdk/emsdk_env.sh" > /dev/null
else
  echo "❌ Emscripten não encontrado em ~/Documents/emsdk"
  exit 1
fi

# === COMPILAR ===
echo "🔧 Compilando $SRC → $OUT_JS ..."
mkdir -p "$OUT_DIR"

emcc "$SRC" -O3 -s WASM=1 \
  -s EXPORTED_FUNCTIONS='["_fib"]' \
  -s EXPORTED_RUNTIME_METHODS='["cwrap"]' \
  -s MODULARIZE=1 -s EXPORT_NAME='createModule' \
  -s EXPORT_ES6=1 \
  -o "$OUT_JS"

echo "✅ Build concluído: $OUT_JS"

# === SERVIDOR LOCAL ===
echo "🌐 Iniciando servidor local em http://localhost:$PORT ..."
python3 "$HOME/Documents/emsdk/upstream/emscripten/emrun.py" --no_browser --port $PORT index.html
