import createModule from "../dist/main.js";

const $ = (id) => document.getElementById(id);
const out = $("out");
const statusEl = $("status");
const log = (...a) => { console.log(...a); out.textContent += "\n" + a.join(" "); };

const nEl = $("n");
const itersEl = $("iters");
const btnJS = $("btnJS");
const btnWasm = $("btnWasm");
const btnCompare = $("btnCompare");
const resJS = $("resJS");
const resWasm = $("resWasm");
const resCompare = $("resCompare");

function fibJS(n){ return n<=1 ? n : fibJS(n-1)+fibJS(n-2); }
function enableWasm(enabled){ [btnWasm, btnCompare].forEach(b => b.disabled = !enabled); }

let fibWasm;
(async () => {
  try {
    statusEl.textContent = "Carregando módulo Wasm…";
    const Module = await createModule({
      locateFile: (p) => `/dist/${p}`,
    });
    fibWasm = Module.cwrap("fib", "number", ["number"]);
    statusEl.textContent = "Módulo carregado ✅";
    statusEl.classList.add("ok");
    enableWasm(true);
  } catch(e){
    statusEl.textContent = "Falha ao carregar Wasm ❌";
    statusEl.classList.add("err");
    log(e);
    enableWasm(false);
  }
})();

btnJS.addEventListener("click", () => {
  const n = +nEl.value, it = +itersEl.value;
  let v=0; const t0 = performance.now();
  for(let i=0;i<it;i++) v = fibJS(n);
  const t1 = performance.now();
  resJS.textContent = `JS: fib(${n}) × ${it} → ${v} | ${(t1-t0).toFixed(2)} ms total | ${((t1-t0)/it).toFixed(2)} ms/call`;
  log(resJS.textContent);
});

btnWasm.addEventListener("click", () => {
  const n = +nEl.value, it = +itersEl.value;
  let v=0; const t0 = performance.now();
  for(let i=0;i<it;i++) v = fibWasm(n);
  const t1 = performance.now();
  resWasm.textContent = `Wasm: fib(${n}) × ${it} → ${v} | ${(t1-t0).toFixed(2)} ms total | ${((t1-t0)/it).toFixed(2)} ms/call`;
  log(resWasm.textContent);
});

btnCompare.addEventListener("click", () => {
  const n = +nEl.value, it = +itersEl.value;
  fibJS(20); fibWasm(20);

  // JS
  let vJS=0, t0=performance.now();
  for(let i=0;i<it;i++) vJS=fibJS(n);
  let jsMs=performance.now()-t0;

  // Wasm
  let vW=0; t0=performance.now();
  for(let i=0;i<it;i++) vW=fibWasm(n);
  let wasmMs=performance.now()-t0;

  const ok=vJS===vW, speed=jsMs/it/(wasmMs/it);
  const msg=`Comparação: fib(${n}) × ${it} — JS ${(jsMs/it).toFixed(2)} ms/call | Wasm ${(wasmMs/it).toFixed(2)} ms/call | Speedup ≈ ${speed.toFixed(2)}× ${ok?"✅":"⚠️"}`;
  resCompare.textContent=msg;
  log(msg);
});
