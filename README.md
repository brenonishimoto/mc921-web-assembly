# mc921-web-assembly
Projeto de demonstração prática de WebAssembly (Wasm) desenvolvido para o seminário da disciplina MC921.
- Compilação de código C para WebAssembly usando Emscripten
- Consumo das funções C no JavaScript via `cwrap`
- Comparação de desempenho entre Fibonacci em JavaScript e Fibonacci em C/Wasm

## Pré-requisitos
- Emscripten SDK instalado e ativado na sessão do terminal.

## Build
### Linux (Bash)
```
chmod +x build.sh
./build.sh
