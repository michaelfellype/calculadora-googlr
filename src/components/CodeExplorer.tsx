import React, { useState } from 'react';
import { CODE_SECTIONS, RAW_PYTHON_CODE } from '../data/pythonCode';
import { CodeSectionId } from '../types/calculator';
import { BookOpen, Check, Copy, Download, ExternalLink, Sparkles } from 'lucide-react';

interface CodeExplorerProps {
  onDownload: () => void;
}

export const CodeExplorer: React.FC<CodeExplorerProps> = ({ onDownload }) => {
  const [selectedSectionId, setSelectedSectionId] = useState<CodeSectionId>('all');
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(RAW_PYTHON_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const codeLines = RAW_PYTHON_CODE.split('\n');

  const activeSection =
    selectedSectionId !== 'all'
      ? CODE_SECTIONS.find((s) => s.id === selectedSectionId)
      : null;

  // Renderizador simples de sintaxe Python com cores acessíveis
  const formatPythonLine = (line: string) => {
    if (line.trim().startsWith('#')) {
      return <span className="text-slate-400 italic">{line}</span>;
    }

    // Identificação de palavras-chave
    const parts = line.split(/(\b(?:def|return|import|from|as|try|except|raise|if|else|elif|for|in|while|pass|lambda|isinstance|float|int|str|True|False|None)\b|"[^"]*"|'[^']*'|#.*$)/g);

    return parts.map((part, i) => {
      if (/^(?:def|return|import|from|as|try|except|raise|if|else|elif|for|in|while|pass|lambda)$/.test(part)) {
        return <span key={i} className="text-sky-400 font-semibold">{part}</span>;
      }
      if (/^(?:isinstance|float|int|str|True|False|None)$/.test(part)) {
        return <span key={i} className="text-amber-300 font-medium">{part}</span>;
      }
      if (part.startsWith('"') || part.startsWith("'")) {
        return <span key={i} className="text-emerald-300">{part}</span>;
      }
      if (part.startsWith('#')) {
        return <span key={i} className="text-slate-400 italic">{part}</span>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Bar with Actions */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Código-Fonte Completo & Anatomia Didática
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <span>Python 3 Standard Library</span>
              <span aria-hidden="true">·</span>
              <span>207 Linhas de Código</span>
              <span aria-hidden="true">·</span>
              <span>PEP 8 Compliant</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado!' : 'Copiar Código'}</span>
            </button>
            <button
              onClick={onDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar Arquivo .py</span>
            </button>
          </div>
        </div>

        {/* Section Filters (Segmented tabs) */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedSectionId('all')}
            className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
              selectedSectionId === 'all'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Todo o Código
          </button>
          {CODE_SECTIONS.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setSelectedSectionId(sec.id)}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                selectedSectionId === sec.id
                  ? 'bg-sky-600 text-white font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {sec.title.split('. ')[1] || sec.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Code Editor Display + Anatomical Concept Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Code Viewer Panel */}
        <div className="lg:col-span-7 bg-slate-950 rounded-xl border border-slate-800 shadow-xl overflow-hidden">
          <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-mono text-slate-200">calculadora_tkinter.py</span>
              <span className="text-[10px] text-slate-500">(utf-8)</span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">
              {activeSection
                ? `Linhas ${activeSection.startLine} a ${activeSection.endLine}`
                : `${codeLines.length} linhas`}
            </span>
          </div>

          <div className="p-4 max-h-[620px] overflow-y-auto font-mono text-xs text-slate-200 leading-relaxed">
            {codeLines.map((line, index) => {
              const lineNum = index + 1;
              const isHighlight =
                activeSection &&
                lineNum >= activeSection.startLine &&
                lineNum <= activeSection.endLine;

              // Se o filtro estiver em uma seção específica, diminui a opacidade do resto
              const isDimmed = activeSection && !isHighlight;

              return (
                <div
                  key={index}
                  className={`flex items-start gap-4 px-2 py-0.5 rounded transition-colors ${
                    isHighlight
                      ? 'bg-sky-950/70 border-l-2 border-sky-400 text-white'
                      : isDimmed
                      ? 'opacity-35'
                      : 'hover:bg-slate-900/60'
                  }`}
                >
                  <span className="w-8 text-right text-slate-600 select-none text-[11px] shrink-0 font-mono">
                    {lineNum}
                  </span>
                  <span className="whitespace-pre overflow-x-auto">
                    {formatPythonLine(line)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Anatomical Explanation Deck */}
        <div className="lg:col-span-5 space-y-5">
          {activeSection ? (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <div>
                <div className="text-[11px] font-bold text-sky-600 uppercase tracking-wider">
                  Raio-X Anatômico
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {activeSection.title}
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {activeSection.summary}
                </p>
              </div>

              {/* Detalhes da seção */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="text-xs font-semibold text-slate-900">
                  Como funciona no Python:
                </div>
                <ul className="space-y-2 text-xs text-slate-600">
                  {activeSection.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-sky-600 font-bold shrink-0">›</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Conceitos Chave */}
              <div className="space-y-2.5 pt-3 border-t border-slate-100">
                <div className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Conceitos para Guardar:
                </div>
                <div className="space-y-2">
                  {activeSection.keyConcepts.map((concept, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    >
                      <div className="font-bold text-slate-800">{concept.term}</div>
                      <div className="text-slate-600 mt-1 leading-relaxed">
                        {concept.explanation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                <BookOpen className="w-5 h-5 text-sky-600" />
                Guia Rápido dos Módulos da Calculadora
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Clique nos botões de filtro no topo para iluminar cada seção do código e aprender como cada engrenagem foi construída:
              </p>

              <div className="space-y-2.5 pt-2">
                {CODE_SECTIONS.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => setSelectedSectionId(sec.id)}
                    className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-sky-300 hover:bg-sky-50/40 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-sky-700">
                        {sec.title}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        L{sec.startLine}-{sec.endLine}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                      {sec.summary}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Dica Didática para Iniciantes */}
          <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl text-xs text-sky-900 space-y-1.5">
            <div className="font-bold flex items-center gap-1.5">
              <span>💡 Dica de Ouro em Python</span>
            </div>
            <p className="leading-relaxed text-sky-800">
              O Python não precisa de ponto e vírgula (<code>;</code>) nem chaves (<code>{`{}`}</code>) para delimitar blocos. Ele usa a <strong>indentação</strong> (4 espaços em branco). Mantenha sempre o alinhamento correto das linhas para que o código rode perfeitamente!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
