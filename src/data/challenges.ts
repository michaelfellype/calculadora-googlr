import { Challenge } from '../types/calculator';

export const CHALLENGES: Challenge[] = [
  {
    id: 'div-zero',
    title: 'Desafio 1: Prevenir Divisão por Zero',
    difficulty: 'Iniciante',
    topic: 'Condicionais & Exceções',
    description: 'Em matemática e em Python, dividir qualquer número por 0 resulta em erro crítico (ZeroDivisionError). Complete a função para verificar se o divisor é zero antes de tentar calcular.',
    objective: 'Adicione uma condicional "if b == 0:" que retorne uma mensagem de erro ou levante ZeroDivisionError.',
    startingCode: `def dividir(a, b):
    # DICA: Verifique se b é igual a 0 antes da divisão
    if b == 0:
        return "Erro: Divisão por zero"
    return a / b`,
    solutionSnippet: `def dividir(a, b):
    if b == 0:
        return "Erro: Divisão por zero"
    return a / b`,
    hint: 'Use a condicional: if b == 0: return "Erro: Divisão por zero"',
    explanation: 'Ao testar o valor de "b" antes de executar "a / b", protegemos o programa contra travamentos inesperados.',
    testCases: [
      {
        inputDesc: 'dividir(10, 2)',
        expected: '5.0',
        checkFn: (code: string) => {
          const hasIf = /if\s+b\s*==\s*0/.test(code);
          const hasReturn = /return\s+a\s*\/\s*b/.test(code);
          if (hasIf && hasReturn) {
            return { passed: true, message: 'Excelente! A função calcula 10 / 2 = 5.0 corretamente.' };
          }
          return { passed: false, message: 'Certifique-se de manter "return a / b" para divisões normais.' };
        }
      },
      {
        inputDesc: 'dividir(10, 0)',
        expected: 'Mensagem de erro ou bloqueio',
        checkFn: (code: string) => {
          const hasCheck = /if\s+b\s*==\s*0/.test(code) && (/return.*(erro|zero|não|divis)/i.test(code) || /raise\s+ZeroDivisionError/.test(code));
          if (hasCheck) {
            return { passed: true, message: 'Perfeito! Quando b é 0, a função intercepta e evita a quebra do sistema.' };
          }
          return { passed: false, message: 'Você precisa verificar "if b == 0:" e retornar um aviso de erro.' };
        }
      }
    ]
  },
  {
    id: 'multiplicar',
    title: 'Desafio 2: Função de Multiplicação',
    difficulty: 'Iniciante',
    topic: 'Funções & Operadores Básicos',
    description: 'Crie a função responsável por multiplicar dois números em Python. Em Python, o operador de multiplicação é o asterisco (*).',
    objective: 'Defina a função "def multiplicar(a, b):" que retorne o produto de "a" e "b".',
    startingCode: `def multiplicar(a, b):
    # Escreva o retorno da multiplicação aqui
    return a * b`,
    solutionSnippet: `def multiplicar(a, b):
    return a * b`,
    hint: 'Em Python, use o operador *: return a * b',
    explanation: 'Funções puras recebem parâmetros (a, b) e geram uma saída determinística sem alterar variáveis globais.',
    testCases: [
      {
        inputDesc: 'multiplicar(6, 7)',
        expected: '42',
        checkFn: (code: string) => {
          const valid = /def\s+multiplicar\s*\(\s*a\s*,\s*b\s*\)\s*:/.test(code) && /return\s+a\s*\*\s*b/.test(code);
          if (valid) {
            return { passed: true, message: 'Correto! 6 * 7 resulta em 42.' };
          }
          return { passed: false, message: 'Verifique se você usou "def multiplicar(a, b):" e "return a * b".' };
        }
      },
      {
        inputDesc: 'multiplicar(-4, 5)',
        expected: '-20',
        checkFn: (code: string) => {
          const valid = /return\s+a\s*\*\s*b/.test(code);
          return {
            passed: valid,
            message: valid ? 'Regra de sinais respeitada (-4 * 5 = -20).' : 'A multiplicação deve usar o operador asterisco (*).'
          };
        }
      }
    ]
  },
  {
    id: 'grid-layout',
    title: 'Desafio 3: Posicionando Widgets no Grid do Tkinter',
    difficulty: 'Intermediário',
    topic: 'Tkinter Grid Geometry',
    description: 'No Tkinter, o método .grid(row, column) organiza os elementos como em uma planilha. Posicione o botão de soma (+) na linha 4 e coluna 3.',
    objective: 'Configure o botão para ser colocado em row=4 e column=3.',
    startingCode: `# Criando o botão de soma
botao_soma = tk.Button(janela, text="+", bg="#0284C7", fg="#FFFFFF")

# Ajuste os valores de row e column:
botao_soma.grid(row=4, column=3, padx=4, pady=4, sticky="nsew")`,
    solutionSnippet: `botao_soma = tk.Button(janela, text="+", bg="#0284C7", fg="#FFFFFF")
botao_soma.grid(row=4, column=3, padx=4, pady=4, sticky="nsew")`,
    hint: 'Configure botao_soma.grid(row=4, column=3, ...)',
    explanation: 'Linhas (rows) começam do zero no topo e descem; Colunas (columns) começam da esquerda (0) e vão para a direita.',
    testCases: [
      {
        inputDesc: 'Posição na Grade',
        expected: 'row=4, column=3',
        checkFn: (code: string) => {
          const hasRow = /row\s*=\s*4/.test(code);
          const hasCol = /column\s*=\s*3/.test(code);
          if (hasRow && hasCol) {
            return { passed: true, message: 'Excelente! O botão ocupará a 5ª linha e a 4ª coluna da grade.' };
          }
          return { passed: false, message: 'Defina explicitamente row=4 e column=3 dentro de .grid().' };
        }
      }
    ]
  },
  {
    id: 'try-except',
    title: 'Desafio 4: Tratamento de Erros com try / except',
    difficulty: 'Intermediário',
    topic: 'Tratamento de Exceções',
    description: 'Quando o usuário digita letras ou caracteres estranhos onde deveria haver números, o Python pode disparar um ValueError. Proteja o código usando um bloco try / except.',
    objective: 'Tente converter o texto com float(texto); se falhar em ValueError, retorne 0.0.',
    startingCode: `def converter_numero_seguro(texto):
    try:
        return float(texto)
    except ValueError:
        return 0.0`,
    solutionSnippet: `def converter_numero_seguro(texto):
    try:
        return float(texto)
    except ValueError:
        return 0.0`,
    hint: 'Use try: return float(texto) seguido de except ValueError: return 0.0',
    explanation: 'O bloco try tenta executar a conversão. Se o usuário digitar "abc", o Python salta direto para o except sem quebrar o programa!',
    testCases: [
      {
        inputDesc: 'converter_numero_seguro("42.5")',
        expected: '42.5',
        checkFn: (code: string) => {
          const hasTry = /try\s*:/.test(code) && /float\s*\(\s*texto\s*\)/.test(code);
          return {
            passed: hasTry,
            message: hasTry ? 'Conversão válida executada com sucesso.' : 'Certifique-se de converter texto com float(texto) dentro do try:.'
          };
        }
      },
      {
        inputDesc: 'converter_numero_seguro("invalido")',
        expected: '0.0 (sem travar o app)',
        checkFn: (code: string) => {
          const hasExcept = /except\s+ValueError\s*:/.test(code) && /return\s+0(?:\.0)?/.test(code);
          return {
            passed: hasExcept,
            message: hasExcept ? 'Exceção ValueError capturada e tratada com elegância!' : 'Capture ValueError com except ValueError: e retorne 0.0.'
          };
        }
      }
    ]
  }
];
