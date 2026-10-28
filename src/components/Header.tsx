import React from 'react';
import { TabType } from '../types/calculator';
import { Download, Terminal } from 'lucide-react';
import { RAW_PYTHON_CODE } from '../data/pythonCode';

interface HeaderProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onDownload: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onDownload,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white shadow-sm">
              <Terminal className="w-4 h-4" />
            </div>
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                onTabChange('simulator');
              }}
              className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap"
            >
              Python Tkinter Lab
            </a>
          </div>

          {/* Zone 2: 4 single-line nav links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <button
              onClick={() => onTabChange('simulator')}
              className={`whitespace-nowrap transition-colors pb-0.5 border-b-2 cursor-pointer ${
                activeTab === 'simulator'
                  ? 'border-sky-600 text-sky-700 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Simulador Tkinter
            </button>
            <button
              onClick={() => onTabChange('code')}
              className={`whitespace-nowrap transition-colors pb-0.5 border-b-2 cursor-pointer ${
                activeTab === 'code'
                  ? 'border-sky-600 text-sky-700 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Explorador de Código
            </button>
            <button
              onClick={() => onTabChange('challenges')}
              className={`whitespace-nowrap transition-colors pb-0.5 border-b-2 cursor-pointer ${
                activeTab === 'challenges'
                  ? 'border-sky-600 text-sky-700 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Desafios Práticos
            </button>
            <button
              onClick={() => onTabChange('guide')}
              className={`whitespace-nowrap transition-colors pb-0.5 border-b-2 cursor-pointer ${
                activeTab === 'guide'
                  ? 'border-sky-600 text-sky-700 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Como Executar
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onDownload}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shadow-sm cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar .py</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav row */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-100 bg-slate-50 px-2 py-2 text-xs font-medium text-slate-600">
        <button
          onClick={() => onTabChange('simulator')}
          className={`px-2 py-1 rounded ${activeTab === 'simulator' ? 'text-sky-700 font-bold bg-sky-50' : ''}`}
        >
          Simulador
        </button>
        <button
          onClick={() => onTabChange('code')}
          className={`px-2 py-1 rounded ${activeTab === 'code' ? 'text-sky-700 font-bold bg-sky-50' : ''}`}
        >
          Código
        </button>
        <button
          onClick={() => onTabChange('challenges')}
          className={`px-2 py-1 rounded ${activeTab === 'challenges' ? 'text-sky-700 font-bold bg-sky-50' : ''}`}
        >
          Desafios
        </button>
        <button
          onClick={() => onTabChange('guide')}
          className={`px-2 py-1 rounded ${activeTab === 'guide' ? 'text-sky-700 font-bold bg-sky-50' : ''}`}
        >
          Instruções
        </button>
      </div>
    </header>
  );
};
