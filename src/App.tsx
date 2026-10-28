import React, { useState } from 'react';
import { TabType } from './types/calculator';
import { Header } from './components/Header';
import { TkinterSimulator } from './components/TkinterSimulator';
import { CodeExplorer } from './components/CodeExplorer';
import { PracticeLab } from './components/PracticeLab';
import { ExecutionGuide } from './components/ExecutionGuide';
import { RAW_PYTHON_CODE } from './data/pythonCode';
import { Check, Download, Info } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('simulator');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDownload = () => {
    const blob = new Blob([RAW_PYTHON_CODE], {
      type: 'text/x-python;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'calculadora_tkinter.py';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Download do arquivo calculadora_tkinter.py iniciado!');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-sky-500/20 selection:text-sky-900">
      {/* Top Bar Navigation */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onDownload={handleDownload}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'simulator' && <TkinterSimulator />}
        {activeTab === 'code' && <CodeExplorer onDownload={handleDownload} />}
        {activeTab === 'challenges' && <PracticeLab />}
        {activeTab === 'guide' && <ExecutionGuide onDownload={handleDownload} />}
      </main>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-3 text-xs font-medium animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer strictly adhering to anti-slop guidelines (no fake telemetry, unboxed metadata) */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Calculadora Python Tkinter</span>
            <span aria-hidden="true">·</span>
            <span>Laboratório de Aprendizado Prático</span>
            <span aria-hidden="true">·</span>
            <span>Iniciantes em Programação</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => setActiveTab('guide')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Guia de Instalação
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={handleDownload}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Baixar Código .py
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
