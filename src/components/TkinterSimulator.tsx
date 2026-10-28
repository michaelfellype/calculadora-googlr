import React, { useState, useEffect } from 'react';
import { TkinterDialog } from '../types/calculator';
import { AlertCircle, AlertTriangle, Check, HelpCircle, Layers, RefreshCw, X } from 'lucide-react';

interface TkinterSimulatorProps {
  onSelectCodeSection?: (sectionId: string) => void;
}

export const TkinterSimulator: React.FC<TkinterSimulatorProps> = ({
  onSelectCodeSection,
}) => {
  const [displayValue, setDisplayValue] = useState<string>('0');
  const [history, setHistory] = useState<string>('');
  const [inspectorMode, setInspectorMode] = useState<boolean>(false);
  const [hoveredWidget, setHoveredWidget] = useState<{
    name: string;
    type: string;
    gridPos: string;
    command: string;
    pythonSnippet: string;
  } | null>(null);

  const [dialog, setDialog] = useState<TkinterDialog>({
    isOpen: false,
    type: 'error',
    title: '',
    message: '',
  });

  const [recentEvents, setRecentEvents] = useState<string[]>([
    'janela = tk.Tk() inicializada',
    'entrada_texto.grid(row=0, col=0, span=4)',
    'janela.mainloop() escutando eventos...',
  ]);

  const addEventLog = (msg: string) => {
    setRecentEvents((prev) => [msg, ...prev.slice(0, 4)]);
  };

  // Botões do Teclado
  const handleChar = (char: string) => {
    setDisplayValue((prev) => {
      if (prev === '0' || prev === 'Erro') {
        return char;
      }
      return prev + char;
    });
    addEventLog(`Evento: inserir_caractere('${char}')`);
  };

  const handleClear = () => {
    setDisplayValue('0');
    setHistory('');
    addEventLog('Evento: limpar_visor() chamado');
  };

  const handleBackspace = () => {
    setDisplayValue((prev) => {
      if (prev.length > 1) {
        return prev.slice(0, -1);
      }
      return '0';
    });
    addEventLog('Evento: apagar_ultimo() [Backspace]');
  };

  const handleCalculate = () => {
    addEventLog('Evento: calcular_resultado() acionado');
    const expr = displayValue;
    setHistory(expr);

    // Converte operadores visuais para operadores Python
    const pythonExpr = expr.replace(/×/g, '*').replace(/÷/g, '/');

    // Checagem de divisão por zero explícita
    if (/\/0(?!\d)/.test(pythonExpr) || /\/0\.0*(?![1-9])/.test(pythonExpr)) {
      setDialog({
        isOpen: true,
        type: 'error',
        title: 'Erro Matemático (messagebox.showerror)',
        message:
          'ZeroDivisionError: Não é permitido dividir por zero!\n\nNo código Python, o bloco "except ZeroDivisionError:" interceptou a falha e acionou messagebox.showerror().',
      });
      addEventLog('EXCEÇÃO: ZeroDivisionError capturada!');
      return;
    }

    try {
      // Validação de caracteres
      const safeRegex = /^[0-9+\-*/. ]+$/;
      if (!safeRegex.test(pythonExpr)) {
        throw new Error('Sintaxe Inválida');
      }

      // Executa o cálculo
      // eslint-disable-next-line no-eval
      const result = Function(`'use strict'; return (${pythonExpr})`)();

      if (!isFinite(result) || isNaN(result)) {
        throw new Error('Divisão por zero');
      }

      const formatted = Number.isInteger(result) ? result.toString() : Number(result.toFixed(6)).toString();
      setDisplayValue(formatted);
      addEventLog(`Resultado calculado com sucesso: ${formatted}`);
    } catch (e) {
      setDialog({
        isOpen: true,
        type: 'error',
        title: 'Expressão Inválida (messagebox.showwarning)',
        message:
          'SyntaxError / ValueError: A conta digitada possui erros de digitação ou operadores soltos.\n\nO bloco "except (ValueError, SyntaxError):" evitou que a janela quebrasse.',
      });
      addEventLog('EXCEÇÃO: Expressão inválida interceptada');
    }
  };

  const closeDialog = () => {
    setDialog((prev) => ({ ...prev, isOpen: false }));
    setDisplayValue('0');
  };

  // Suporte a teclado do usuário
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (dialog.isOpen) {
        if (e.key === 'Enter' || e.key === 'Escape') closeDialog();
        return;
      }
      if (e.key >= '0' && e.key <= '9') handleChar(e.key);
      else if (e.key === '+') handleChar('+');
      else if (e.key === '-') handleChar('-');
      else if (e.key === '*') handleChar('×');
      else if (e.key === '/') {
        e.preventDefault();
        handleChar('÷');
      }
      else if (e.key === '.') handleChar('.');
      else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleCalculate();
      }
      else if (e.key === 'Backspace') handleBackspace();
      else if (e.key === 'Escape') handleClear();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [displayValue, dialog.isOpen]);

  const buttonDefs = [
    { label: 'C', row: 1, col: 0, bg: 'bg-rose-500 hover:bg-rose-600 text-white', action: handleClear, code: 'limpar_visor' },
    { label: 'CE', row: 1, col: 1, bg: 'bg-slate-500 hover:bg-slate-600 text-white', action: handleClear, code: 'limpar_visor' },
    { label: '⌫', row: 1, col: 2, bg: 'bg-slate-500 hover:bg-slate-600 text-white', action: handleBackspace, code: 'apagar_ultimo' },
    { label: '÷', row: 1, col: 3, bg: 'bg-sky-600 hover:bg-sky-700 text-white font-bold', action: () => handleChar('÷'), code: 'inserir_caractere("÷")' },

    { label: '7', row: 2, col: 0, bg: 'bg-slate-700 hover:bg-slate-600 text-white', action: () => handleChar('7'), code: 'inserir_caractere("7")' },
    { label: '8', row: 2, col: 1, bg: 'bg-slate-700 hover:bg-slate-600 text-white', action: () => handleChar('8'), code: 'inserir_caractere("8")' },
    { label: '9', row: 2, col: 2, bg: 'bg-slate-700 hover:bg-slate-600 text-white', action: () => handleChar('9'), code: 'inserir_caractere("9")' },
    { label: '×', row: 2, col: 3, bg: 'bg-sky-600 hover:bg-sky-700 text-white font-bold', action: () => handleChar('×'), code: 'inserir_caractere("×")' },

    { label: '4', row: 3, col: 0, bg: 'bg-slate-700 hover:bg-slate-600 text-white', action: () => handleChar('4'), code: 'inserir_caractere("4")' },
    { label: '5', row: 3, col: 1, bg: 'bg-slate-700 hover:bg-slate-600 text-white', action: () => handleChar('5'), code: 'inserir_caractere("5")' },
    { label: '6', row: 3, col: 2, bg: 'bg-slate-700 hover:bg-slate-600 text-white', action: () => handleChar('6'), code: 'inserir_caractere("6")' },
    { label: '-', row: 3, col: 3, bg: 'bg-sky-600 hover:bg-sky-700 text-white font-bold', action: () => handleChar('-'), code: 'inserir_caractere("-")' },

    { label: '1', row: 4, col: 0, bg: 'bg-slate-700 hover:bg-slate-600 text-white', action: () => handleChar('1'), code: 'inserir_caractere("1")' },
    { label: '2', row: 4, col: 1, bg: 'bg-slate-700 hover:bg-slate-600 text-white', action: () => handleChar('2'), code: 'inserir_caractere("2")' },
    { label: '3', row: 4, col: 2, bg: 'bg-slate-700 hover:bg-slate-600 text-white', action: () => handleChar('3'), code: 'inserir_caractere("3")' },
    { label: '+', row: 4, col: 3, bg: 'bg-sky-600 hover:bg-sky-700 text-white font-bold', action: () => handleChar('+'), code: 'inserir_caractere("+")' },

    { label: '0', row: 5, col: 0, bg: 'bg-slate-700 hover:bg-slate-600 text-white', action: () => handleChar('0'), code: 'inserir_caractere("0")' },
    { label: '.', row: 5, col: 1, bg: 'bg-slate-700 hover:bg-slate-600 text-white', action: () => handleChar('.'), code: 'inserir_caractere(".")' },
    { label: '=', row: 5, col: 2, span: 2, bg: 'bg-emerald-600 hover:bg-emerald-700 text-white font-bold', action: handleCalculate, code: 'calcular_resultado()' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Contextual */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Simulador Tkinter Interativo
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <span>Python 3.12</span>
              <span aria-hidden="true">·</span>
              <span>Biblioteca Gráfica Nativa</span>
              <span aria-hidden="true">·</span>
              <span>Tratamento de Exceções Ativo</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setInspectorMode(!inspectorMode)}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                inspectorMode
                  ? 'bg-sky-50 border-sky-300 text-sky-800'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-sky-600" />
              <span>{inspectorMode ? 'Inspetor Ativado' : 'Ativar Modo Inspetor'}</span>
            </button>
            <button
              onClick={handleClear}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reiniciar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Stage (Simulator) + Right Controls & Inspection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Stage: Simulated OS Tkinter Window */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="w-full max-w-[360px] bg-slate-900 rounded-xl shadow-2xl border border-slate-700/80 overflow-hidden relative">
            {/* Tkinter Window Title Bar */}
            <div className="bg-slate-800 px-3.5 py-2.5 flex items-center justify-between border-b border-slate-700 select-none">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded bg-sky-500/20 text-sky-400 flex items-center justify-center text-[10px] font-mono font-bold">
                  Py
                </div>
                <span className="text-xs font-medium text-slate-200 truncate">
                  Calculadora Python Tkinter
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  title="Minimizar"
                  className="w-3 h-3 rounded-full bg-slate-600 hover:bg-slate-500 transition-colors"
                />
                <button
                  title="Maximizar (desativado via resizable=False)"
                  className="w-3 h-3 rounded-full bg-slate-600 opacity-40 cursor-not-allowed"
                />
                <button
                  onClick={handleClear}
                  title="Fechar / Resetar"
                  className="w-3 h-3 rounded-full bg-rose-500/80 hover:bg-rose-500 transition-colors flex items-center justify-center text-[8px] text-white"
                >
                  <X className="w-2 h-2" />
                </button>
              </div>
            </div>

            {/* Simulated Tkinter Root Container */}
            <div className="p-4 bg-slate-900 text-white space-y-4">
              {/* Visor / tk.Entry */}
              <div
                onMouseEnter={() =>
                  inspectorMode &&
                  setHoveredWidget({
                    name: 'Visor Numérico',
                    type: 'tk.Entry(janela, font=("Arial", 22), justify="right")',
                    gridPos: 'row=0, column=0, columnspan=4',
                    command: 'entrada_texto.insert(tk.END, char)',
                    pythonSnippet:
                      'entrada_texto = tk.Entry(janela, font=("Arial", 22), bg="#0F172A", fg="#F8FAFC", justify="right")\nentrada_texto.grid(row=0, column=0, columnspan=4, padx=16, pady=16)',
                  })
                }
                className={`bg-slate-950 rounded-lg p-3.5 border transition-all text-right ${
                  inspectorMode
                    ? 'border-sky-400 ring-2 ring-sky-400/30'
                    : 'border-slate-800'
                }`}
              >
                <div className="text-[11px] text-slate-400 h-4 font-mono truncate">
                  {history ? `${history} =` : ' '}
                </div>
                <div className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-tight overflow-x-auto whitespace-nowrap scrollbar-none">
                  {displayValue}
                </div>
              </div>

              {/* Botões da Calculadora em Grade (Tkinter Grid) */}
              <div className="grid grid-cols-4 gap-2">
                {buttonDefs.map((btn) => (
                  <button
                    key={`${btn.row}-${btn.col}`}
                    onClick={btn.action}
                    onMouseEnter={() =>
                      inspectorMode &&
                      setHoveredWidget({
                        name: `Botão "${btn.label}"`,
                        type: 'tk.Button(janela, text=...)',
                        gridPos: `row=${btn.row}, column=${btn.col}${btn.span ? `, columnspan=${btn.span}` : ''}`,
                        command: btn.code,
                        pythonSnippet: `botao = tk.Button(janela, text="${btn.label}", command=${btn.code})\nbotao.grid(row=${btn.row}, column=${btn.col}${btn.span ? `, columnspan=${btn.span}` : ''}, padx=4, pady=4, sticky="nsew")`,
                      })
                    }
                    style={{ gridColumn: btn.span ? `span ${btn.span} / span ${btn.span}` : undefined }}
                    className={`h-12 rounded-lg font-mono text-base font-semibold transition-all active:scale-95 flex items-center justify-center cursor-pointer shadow-sm select-none ${btn.bg} ${
                      inspectorMode ? 'hover:ring-2 hover:ring-amber-300' : ''
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated Native OS Messagebox Dialog */}
            {dialog.isOpen && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-20 animate-in fade-in duration-150">
                <div className="w-full max-w-[280px] bg-slate-800 border border-slate-600 rounded-lg shadow-2xl p-4 text-slate-100">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-rose-500/20 text-rose-400 shrink-0 mt-0.5">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white tracking-wide">
                        {dialog.title}
                      </h4>
                      <p className="text-[11px] text-slate-300 mt-1.5 leading-relaxed whitespace-pre-line">
                        {dialog.message}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-700 flex justify-end">
                    <button
                      onClick={closeDialog}
                      className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-semibold cursor-pointer shadow-xs"
                    >
                      OK
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <p className="text-xs text-slate-500 text-center mt-3">
            Você também pode digitar diretamente pelo teclado do seu computador!
          </p>
        </div>

        {/* Right Stage: Inspector Info & Experimentation Controls */}
        <div className="lg:col-span-6 space-y-5">
          {/* Widget Inspection Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-sky-600" />
                Raio-X de Widgets do Tkinter
              </span>
              <span className="text-xs text-slate-500">
                {inspectorMode ? 'Passe o cursor sobre os botões' : 'Ative o inspetor para analisar'}
              </span>
            </div>

            {hoveredWidget ? (
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">{hoveredWidget.name}</span>
                  <span className="text-xs font-mono text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                    {hoveredWidget.gridPos}
                  </span>
                </div>
                <div className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-700">Comando associado: </span>
                  <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">
                    {hoveredWidget.command}
                  </code>
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Como é escrito em Python:
                  </div>
                  <pre className="p-3 bg-slate-900 text-slate-200 rounded-lg text-xs font-mono overflow-x-auto">
                    <code>{hoveredWidget.pythonSnippet}</code>
                  </pre>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-slate-500">
                <p>
                  Ative o <strong>Modo Inspetor</strong> acima e passe o mouse sobre qualquer botão ou sobre o visor para entender como o Tkinter constrói e posiciona cada elemento na tela.
                </p>
              </div>
            )}
          </div>

          {/* Test Scenarios Panel */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">
              Testes Rápidos de Aprendizado
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                onClick={() => {
                  setDisplayValue('24+18');
                  addEventLog('Teste rápido: 24 + 18');
                }}
                className="p-2.5 text-left border border-slate-200 rounded-lg hover:border-sky-300 hover:bg-sky-50/50 transition-colors cursor-pointer"
              >
                <div className="text-xs font-bold text-slate-800">Soma Básica</div>
                <div className="text-[11px] text-slate-500 mt-0.5 font-mono">24 + 18 = 42</div>
              </button>

              <button
                onClick={() => {
                  setDisplayValue('100÷0');
                  addEventLog('Teste de estresse: 100 ÷ 0');
                }}
                className="p-2.5 text-left border border-rose-200 rounded-lg bg-rose-50/30 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <div className="text-xs font-bold text-rose-900 flex items-center gap-1">
                  <span>Divisão por Zero</span>
                </div>
                <div className="text-[11px] text-rose-600 mt-0.5 font-mono">100 ÷ 0 (Erro)</div>
              </button>

              <button
                onClick={() => {
                  setDisplayValue('15××3');
                  addEventLog('Teste de sintaxe: 15 ×× 3');
                }}
                className="p-2.5 text-left border border-amber-200 rounded-lg bg-amber-50/30 hover:bg-amber-50 transition-colors cursor-pointer"
              >
                <div className="text-xs font-bold text-amber-900">Sintaxe Inválida</div>
                <div className="text-[11px] text-amber-600 mt-0.5 font-mono">15 ×× 3 (Aviso)</div>
              </button>
            </div>
          </div>

          {/* Real-time Event Queue Logger */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-900">
                Fila de Eventos do Tkinter (Mainloop)
              </span>
              <span className="text-[11px] text-slate-400 font-mono">tempo real</span>
            </div>
            <div className="bg-slate-950 rounded-lg p-3 font-mono text-xs text-slate-300 space-y-1">
              {recentEvents.map((evt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-sky-400">›</span>
                  <span className={idx === 0 ? 'text-sky-300 font-semibold' : 'text-slate-400'}>
                    {evt}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              O método <code>janela.mainloop()</code> fica permanentemente ouvindo cada um desses eventos e chamando as funções vinculadas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
