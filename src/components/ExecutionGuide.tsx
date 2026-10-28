import React, { useState } from 'react';
import { Check, Copy, Download, Monitor, Terminal } from 'lucide-react';
import { RAW_PYTHON_CODE } from '../data/pythonCode';

interface ExecutionGuideProps {
  onDownload: () => void;
}

export const ExecutionGuide: React.FC<ExecutionGuideProps> = ({ onDownload }) => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const copyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Como Executar a Calculadora no seu Computador
        </h2>
        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
          <span>Guia para Iniciantes</span>
          <span aria-hidden="true">·</span>
          <span>Windows, macOS & Linux</span>
          <span aria-hidden="true">·</span>
          <span>Sem instalações extras (Tkinter é nativo)</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
          Siga o passo a passo abaixo para rodar a aplicação desktop real diretamente no seu sistema operacional. O Tkinter já vem instalado por padrão no Python!
        </p>

        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-3">
          <button
            onClick={onDownload}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>1. Baixar calculadora_tkinter.py</span>
          </button>
        </div>
      </div>

      {/* Step by Step Cards */}
      <div className="space-y-4">
        {/* Passo 1 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-start gap-4">
          <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-xs shrink-0">
            1
          </div>
          <div className="space-y-2 flex-1">
            <h3 className="text-sm font-bold text-slate-900">
              Certifique-se de ter o Python 3 instalado
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Se ainda não tiver o Python no seu computador, acesse{' '}
              <a
                href="https://www.python.org/downloads/"
                target="_blank"
                rel="noreferrer"
                className="text-sky-600 font-semibold underline"
              >
                python.org/downloads
              </a>{' '}
              e baixe a versão recomendada.
            </p>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
              <strong>Atenção no Windows:</strong> Na primeira tela do instalador, marque a opção{' '}
              <code>"Add python.exe to PATH"</code> para poder executar comandos no terminal de qualquer pasta.
            </div>
          </div>
        </div>

        {/* Passo 2 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-start gap-4">
          <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-xs shrink-0">
            2
          </div>
          <div className="space-y-2 flex-1">
            <h3 className="text-sm font-bold text-slate-900">
              Salve o arquivo do código
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Clique no botão preto <strong>"Baixar .py"</strong> no cabeçalho ou salve o código em uma pasta fácil de achar (como a sua pasta <em>Downloads</em> ou <em>Documentos</em>) com o nome <code>calculadora_tkinter.py</code>.
            </p>
          </div>
        </div>

        {/* Passo 3 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-start gap-4">
          <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-xs shrink-0">
            3
          </div>
          <div className="space-y-3 flex-1">
            <h3 className="text-sm font-bold text-slate-900">
              Abra o Terminal ou Prompt de Comando na pasta
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Abra o terminal do seu sistema operacional e navegue até a pasta onde salvou o arquivo:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Windows */}
              <div className="p-3.5 bg-slate-900 text-slate-200 rounded-lg space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-semibold text-white">Windows (CMD / PowerShell)</span>
                  <button
                    onClick={() => copyCommand('python calculadora_tkinter.py')}
                    className="hover:text-white cursor-pointer"
                  >
                    {copiedCmd === 'python calculadora_tkinter.py' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <div className="font-mono text-xs text-sky-300">
                  python calculadora_tkinter.py
                </div>
              </div>

              {/* Mac / Linux */}
              <div className="p-3.5 bg-slate-900 text-slate-200 rounded-lg space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-semibold text-white">macOS / Linux (Terminal)</span>
                  <button
                    onClick={() => copyCommand('python3 calculadora_tkinter.py')}
                    className="hover:text-white cursor-pointer"
                  >
                    {copiedCmd === 'python3 calculadora_tkinter.py' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <div className="font-mono text-xs text-sky-300">
                  python3 calculadora_tkinter.py
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Passo 4 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-start gap-4">
          <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
            ✓
          </div>
          <div className="space-y-2 flex-1">
            <h3 className="text-sm font-bold text-slate-900">
              Pronto! A janela nativa será aberta
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              O Python iniciará o <code>janela.mainloop()</code> e exibirá a janela da calculadora com todos os botões clicáveis, visor responsivo e caixas de alerta pop-up quando ocorrerem erros de cálculo ou entradas inválidas.
            </p>
          </div>
        </div>
      </div>

      {/* Troubleshooting Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Resolução de Dúvidas Frequentes
        </h3>

        <div className="space-y-3 text-xs text-slate-600">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="font-bold text-slate-800">
              No Linux (Ubuntu/Debian), recebi "ModuleNotFoundError: No module named 'tkinter'"
            </div>
            <p className="mt-1">
              Em algumas distribuições Linux enxutas, o pacote Tkinter é separado. Basta executar no terminal:
            </p>
            <code className="inline-block mt-1.5 p-1.5 bg-slate-900 text-sky-300 font-mono rounded text-[11px]">
              sudo apt-get install python3-tk
            </code>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="font-bold text-slate-800">
              Posso modificar as cores e tamanho da calculadora?
            </div>
            <p className="mt-1">
              Sim! No código, procure por <code>janela.geometry("320x420")</code> para mudar a resolução e por <code>bg="#1E293B"</code> para trocar as cores dos botões e do fundo usando qualquer código hexadecimal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
