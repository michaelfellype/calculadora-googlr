import React, { useState } from 'react';
import { CHALLENGES } from '../data/challenges';
import { Challenge } from '../types/calculator';
import { CheckCircle2, ChevronLeft, ChevronRight, HelpCircle, Lightbulb, Play, RotateCcw, Trophy, XCircle } from 'lucide-react';

export const PracticeLab: React.FC = () => {
  const [activeChallengeIdx, setActiveChallengeIdx] = useState<number>(0);
  const [userCodeMap, setUserCodeMap] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    CHALLENGES.forEach((c) => {
      initial[c.id] = c.startingCode;
    });
    return initial;
  });

  const [testResultsMap, setTestResultsMap] = useState<
    Record<string, { passed: boolean; message: string }[]>
  >({});

  const [completedChallenges, setCompletedChallenges] = useState<Set<string>>(
    new Set()
  );

  const [showHint, setShowHint] = useState<boolean>(false);
  const [showSolution, setShowSolution] = useState<boolean>(false);

  const currentChallenge: Challenge = CHALLENGES[activeChallengeIdx];
  const currentCode = userCodeMap[currentChallenge.id] || currentChallenge.startingCode;
  const currentResults = testResultsMap[currentChallenge.id];

  const handleCodeChange = (newCode: string) => {
    setUserCodeMap((prev) => ({ ...prev, [currentChallenge.id]: newCode }));
  };

  const handleReset = () => {
    setUserCodeMap((prev) => ({
      ...prev,
      [currentChallenge.id]: currentChallenge.startingCode,
    }));
    setTestResultsMap((prev) => {
      const copy = { ...prev };
      delete copy[currentChallenge.id];
      return copy;
    });
    setShowHint(false);
    setShowSolution(false);
  };

  const handleRunTests = () => {
    const results = currentChallenge.testCases.map((tc) => tc.checkFn(currentCode));
    setTestResultsMap((prev) => ({
      ...prev,
      [currentChallenge.id]: results,
    }));

    const allPassed = results.every((r) => r.passed);
    if (allPassed) {
      setCompletedChallenges((prev) => new Set([...prev, currentChallenge.id]));
    }
  };

  const isCurrentCompleted = completedChallenges.has(currentChallenge.id);

  return (
    <div className="space-y-6">
      {/* Top Banner with Progress Counter */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Modo Interativo: Desafios Práticos de Código
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <span>Exercícios de Fixação</span>
              <span aria-hidden="true">·</span>
              <span>Testes Unitários Automatizados</span>
              <span aria-hidden="true">·</span>
              <span>Feedback Instantâneo</span>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>
                Concluídos: <strong>{completedChallenges.size}</strong> de {CHALLENGES.length}
              </span>
            </div>
          </div>
        </div>

        {/* Challenge navigation pills */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CHALLENGES.map((ch, idx) => {
            const isDone = completedChallenges.has(ch.id);
            const isActive = idx === activeChallengeIdx;
            return (
              <button
                key={ch.id}
                onClick={() => {
                  setActiveChallengeIdx(idx);
                  setShowHint(false);
                  setShowSolution(false);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : isDone
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                <span>
                  {idx + 1}. {ch.title.split(': ')[1] || ch.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Challenge Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Instructions, Objective, & Tests */}
        <div className="lg:col-span-5 space-y-5">
          {/* Objective Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-sky-600 uppercase tracking-wider">
                {currentChallenge.topic}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Dificuldade: {currentChallenge.difficulty}
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              {currentChallenge.title}
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed">
              {currentChallenge.description}
            </p>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800">
              <span className="font-bold text-slate-900">Objetivo: </span>
              {currentChallenge.objective}
            </div>

            {/* Hint & Solution Toggles */}
            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => setShowHint(!showHint)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-600 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>{showHint ? 'Ocultar Dica' : 'Ver Dica'}</span>
              </button>

              <button
                onClick={() => setShowSolution(!showSolution)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-600 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
                <span>{showSolution ? 'Ocultar Solução' : 'Ver Gabarito'}</span>
              </button>
            </div>

            {showHint && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 animate-in fade-in">
                <strong>Dica: </strong>
                {currentChallenge.hint}
              </div>
            )}

            {showSolution && (
              <div className="p-3 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono space-y-1.5 animate-in fade-in">
                <div className="text-[10px] text-slate-400 font-sans uppercase">Código Sugerido:</div>
                <pre className="overflow-x-auto whitespace-pre">
                  <code>{currentChallenge.solutionSnippet}</code>
                </pre>
                <p className="text-[11px] text-slate-300 font-sans pt-1 border-t border-slate-700">
                  {currentChallenge.explanation}
                </p>
              </div>
            )}
          </div>

          {/* Test Cases Results */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Casos de Teste Automatizados
              </span>
              <span className="text-xs text-slate-500">
                {currentChallenge.testCases.length} verificações
              </span>
            </div>

            {currentResults ? (
              <div className="space-y-2">
                {currentResults.map((res, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
                      res.passed
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                        : 'bg-rose-50/70 border-rose-200 text-rose-900'
                    }`}
                  >
                    {res.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="font-bold">
                        {currentChallenge.testCases[i].inputDesc}
                      </div>
                      <div className="mt-0.5 opacity-90">{res.message}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-4 text-center">
                Clique no botão <strong>"Executar Verificação"</strong> ao lado para testar seu código em tempo real.
              </p>
            )}

            {isCurrentCompleted && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Desafio concluído com sucesso! Excelente trabalho.</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Interactive Code Editor */}
        <div className="lg:col-span-7 bg-slate-950 rounded-xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
          {/* Editor Header Bar */}
          <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-200">exercicio_python.py</span>
              <span className="text-[10px] text-slate-400">Edite o código abaixo:</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                title="Restaurar código original"
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Resetar</span>
              </button>
              <button
                onClick={handleRunTests}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-xs"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Executar Verificação</span>
              </button>
            </div>
          </div>

          {/* Editable Textarea formatted like code */}
          <div className="p-4 flex-1">
            <textarea
              value={currentCode}
              onChange={(e) => handleCodeChange(e.target.value)}
              rows={12}
              spellCheck={false}
              className="w-full bg-slate-950 text-slate-100 font-mono text-xs sm:text-sm leading-relaxed p-2 focus:outline-none focus:ring-1 focus:ring-sky-500 rounded resize-none"
              placeholder="Digite seu código Python aqui..."
            />
          </div>

          {/* Editor Footer with Navigation */}
          <div className="bg-slate-900/90 px-4 py-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <button
              disabled={activeChallengeIdx === 0}
              onClick={() => {
                setActiveChallengeIdx((prev) => Math.max(0, prev - 1));
                setShowHint(false);
                setShowSolution(false);
              }}
              className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Desafio Anterior</span>
            </button>

            <span className="text-slate-500 font-mono">
              {activeChallengeIdx + 1} de {CHALLENGES.length}
            </span>

            <button
              disabled={activeChallengeIdx === CHALLENGES.length - 1}
              onClick={() => {
                setActiveChallengeIdx((prev) =>
                  Math.min(CHALLENGES.length - 1, prev + 1)
                );
                setShowHint(false);
                setShowSolution(false);
              }}
              className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>Próximo Desafio</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
