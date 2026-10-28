# Laboratório Interativo: Calculadora Python com Interface Tkinter

Plataforma educacional interativa projetada para iniciantes em programação aprenderem a construir uma calculadora gráfica completa em Python usando a biblioteca nativa Tkinter, com simulador visual ao vivo, inspeção de código didática, tratamento de erros robusto e exercícios práticos guiados.

### User Review & Critical Decisions

> [!IMPORTANT]
> As decisões abaixo foram alinhadas e confirmadas na Fase 1 para guiar a arquitetura do aplicativo de ensino:

- **Formato da Calculadora Confirmado**: Calculadora com interface gráfica desktop nativa do Python utilizando `tkinter` e `tkinter.messagebox`.
- **Forma de Aprendizado Confirmada**: Modo interativo com simulador de interface gráfica no navegador, acompanhado de testes guiados e desafios práticos (exercícios de completar código e consertar bugs).
- **Tratamento de Erros Confirmado**: Implementação explícita de prevenção contra divisão por zero (`ZeroDivisionError`) e validação de texto/entradas numéricas (`ValueError`).
- **Exportação do Código**: Opção de copiar e baixar diretamente o arquivo executável `calculadora_tkinter.py` pronto para rodar em qualquer computador com Python 3 instalado.

---

### 1. Overview & Core Concept

- **O que faz**: Oferece uma experiência imersiva de aprendizado onde o aluno pode:
  1. Experimentar um simulador funcional da calculadora Tkinter idêntico a uma janela gráfica de desktop real.
  2. Explorar o código Python organizado em módulos (inicialização da janela, funções matemáticas com tratamento de exceções, montagem dos botões e visor com sistema de grid).
  3. Resolver 4 desafios práticos progressivos com feedback imediato (ex.: adicionar operador, prevenir crash de divisão por zero, validar texto).
  4. Clicar em qualquer parte do código para ver um raio-X explicativo com a lógica em português e analogias para iniciantes.
- **Público-alvo**: Pessoas que estão dando os primeiros passos na programação em Python e desejam entender como conectar lógica matemática a interfaces visuais.
- **Valor Principal**: Transforma a teoria de Python e Tkinter em prática imediata, eliminando o medo de telas pretas de terminal e erros comuns de iniciante.

---

### 2. User Experience & Visual Design

- **Fluxo do Usuário**:
  1. **Visão Geral & Simulador**: O usuário visualiza a janela da calculadora Tkinter simulada em tempo real e pode testar cálculos normais, bem como provocar divisões por zero ou caracteres inválidos para ver os alertas visuais.
  2. **Inspetor de Código Passo a Passo**: Ao lado do simulador, o código Python completo é exibido com syntax highlighting. Ao clicar em blocos (funções, layout de botões, tratamento de erros), a explicação detalhada se abre dinamicamente com visualização dos conceitos.
  3. **Laboratório de Desafios & Prática**: Uma aba interativa apresenta missões práticas (ex.: "Corrija a divisão por 0", "Crie o botão de multiplicação", "Trate entradas com letras"). O aluno testa e recebe feedback em tempo real.
  4. **Guia de Instalação e Execução**: Instruções claras de como rodar o script em Windows, Mac e Linux com um único comando (`python calculadora_tkinter.py`).

- **Identidade Visual & Tema (Seguindo Educação & Simulações)**:
  - *Direção Estética*: Interface limpa, contemporânea e acadêmica com foco em legibilidade de código e clareza visual, remetendo a um ambiente de desenvolvimento amigável.
  - *Paleta de Cores*: Fundo neutro limpo (`#F8FAFC` slate-50 / dark `#0F172A`), superfícies estruturais em `#FFFFFF` / slate-900 com bordas ultrafinas, acentos em Azul Python (`#0284C7`) e Âmbar de atenção (`#D97706`), além de Esmeralda (`#059669`) para sucessos nos exercícios.
  - *Tipografia*: Títulos em fonte sem serifa estruturada (`Plus Jakarta Sans`), corpo de texto limpo (`DM Sans`) e código com números tabulares e fonte monoespaçada legível (`JetBrains Mono` / `IBM Plex Mono`).
  - *Distribuição 60-30-10*: 60% tela neutra, 30% painéis e blocos de código com divisores sutis, 10% destaques de interação e botões principais.

- **Feedback Interativo**:
  - Respostas imediatas a cliques no simulador gráfico (animação tátil nos botões da calculadora).
  - Alertas popup modais simulando exatamente as caixas de diálogo nativas do `tkinter.messagebox.showerror`.
  - Badges de validação nos desafios com verificação instantânea da lógica.

---

### 3. Key Product Decisions & Trade-Offs

- **Simulador Gráfico em React vs Execução Remota em Servidor**:
  - *Decisão Escolhida*: Simulador de alta fidelidade no cliente React replicando o comportamento, widgets e fluxo de eventos do Tkinter, acompanhado de motor de análise de código.
  - *Por que*: Oferece resposta instantânea com zero latência, funciona offline e permite inspecionar cada widget visualmente sem necessidade de streaming de tela X11/VNC ou dependências pesadas de servidor.
  - *Alternativas consideradas*: Servidor com Web-VNC ou streaming de janela Python; descartado por fragilidade, lentidão e complexidade desnecessária para quem está aprendendo a sintaxe básica.

- **Código Modular com Funções e Dicionário de Operações**:
  - *Decisão Escolhida*: Código Python estruturado com funções puras para operações (`somar`, `subtrair`, `multiplicar`, `dividir`), validação segura com `try/except (ValueError, ZeroDivisionError)` e layout limpo usando `grid(row, column)`.
  - *Por que*: Ensina as melhores práticas do Python desde o primeiro dia (modularidade, tratamento de exceções idiomático e organização de UI).

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        App.tsx (Header & Tabs)                         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
    ┌───────────────────────────────┼───────────────────────────────┐
    ▼                               ▼                               ▼
┌─────────────────────────┐ ┌─────────────────────────┐ ┌─────────────────────────┐
│     Interactive Lab     │ │      Code Explorer      │ │   Practice Challenges   │
│  ┌───────────────────┐  │ │  ┌───────────────────┐  │ │  ┌───────────────────┐  │
│  │ Tkinter Simulator │  │ │  │ Python Highlighting│ │ │  │ 4 Guided Tasks    │  │
│  │ (Visor + Keypad)  │  │ │  │ with Line Markers │  │ │  │ - Division by Zero │  │
│  └─────────┬─────────┘  │ │  └─────────┬─────────┘  │ │  │ - Clear Function   │  │
│            ▼            │ │            ▼            │ │  │ - New Operator     │  │
│  ┌───────────────────┐  │ │  ┌───────────────────┐  │ │  │ - Input Validation │  │
│  │ Simulated Dialogs │  │ │  │ Deep-Dive Anatomy │  │ │  └─────────┬─────────┘  │
│  │ (messagebox error)│  │ │  │ (Tkinter concepts)│  │ │            ▼            │
│  └───────────────────┘  │ │  └───────────────────┘  │ │  Interactive Validator│  │
└─────────────────────────┘ └─────────────────────────┘ └─────────────────────────┘
```

- **Modelo de Estado**:
  - `activeTab`: Alternância entre Simulador & Código, Inspetor Anatômico e Desafios Práticos.
  - `simulatedCalculatorState`: Visor, histórico de cálculo, flag de erro e memória da calculadora Tkinter simulada.
  - `activeCodeSection`: Seção destacada no código para exibição contextual de conceitos (Imports, Funções Lógicas, Layout Grid, Event Loop `mainloop`).
  - `completedChallenges`: Progresso do usuário nos exercícios interativos de fixação.
  - `copiedState`: Feedback visual ao copiar o código Python completo.

- **Componentes Chave**:
  - `TkinterSimulator`: Reprodução fiel da janela do sistema operacional com botões de fechar/minimizar, display LCD e teclado matricial.
  - `CodeViewer`: Visualizador de código com numeração de linhas, destaques pedagógicos e botão de download do arquivo `.py`.
  - `ConceptCard`: Cartões de explicação de tópicos essenciais de Python (Variáveis, Funções, Condicionais, Tratamento de Exceções, Bibliotecas).
  - `ChallengeSuite`: Sistema interativo de exercícios com perguntas e testes de código para fixar o aprendizado.
