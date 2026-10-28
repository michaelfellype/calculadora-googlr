/**
 * Tipos e interfaces para o Laboratório Didático da Calculadora Python Tkinter
 */

export type TabType = 'simulator' | 'code' | 'challenges' | 'guide';

export type CodeSectionId =
  | 'all'
  | 'imports'
  | 'operations'
  | 'visor_logic'
  | 'ui_window'
  | 'buttons_grid'
  | 'event_loop';

export interface CodeSection {
  id: CodeSectionId;
  title: string;
  startLine: number;
  endLine: number;
  summary: string;
  details: string[];
  keyConcepts: {
    term: string;
    explanation: string;
  }[];
}

export interface Challenge {
  id: string;
  title: string;
  difficulty: 'Iniciante' | 'Intermediário';
  topic: string;
  description: string;
  objective: string;
  startingCode: string;
  solutionSnippet: string;
  hint: string;
  explanation: string;
  testCases: {
    inputDesc: string;
    expected: string;
    checkFn: (code: string) => { passed: boolean; message: string };
  }[];
}

export interface TkinterDialog {
  isOpen: boolean;
  type: 'error' | 'info';
  title: string;
  message: string;
}
